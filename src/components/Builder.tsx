import React, { useState, useEffect, useCallback } from 'react'
import merge from 'lodash/merge'

import { EncodingPicker, useEncodingState } from './EncodingPicker.tsx'

const DEFAULTS = {
  mark: {
    type: 'circle',
  },
  x: {
    fieldIndex: 0,
    type: 'quantitative',
  },
  y: {
    fieldIndex: 1,
    type: 'quantitative',
  },
  color: {
    type: 'nominal',
  },
  size: {
    type: 'quantitative',
  },
  opacity: {
    type: 'quantitative',
  },
}

const MARKS = [
  //'arc',
  'area', // Properties: point, line, interpolate
  'bar', // Properties: orient, binSpacing
  'boxplot',
  //'errorband',
  //'errorbar',
  //'image',
  'line', // Properties: point, interpolate
  'point', // Properties: none needed. Use encoding + value instead.
  //'rect',
  //'rule',
  //'text', // Need to show 'text' encoding. Properties: dx, dy, fontSize, limit, align, baseline
  //'tick',
  //'trail',
  'circle', // Properties: none needed. Use encoding + value instead.
  'square', // Properties: none needed. Use encoding + value instead.
  //'geoshape',
]

const FIELD_TYPES = {
  'Auto': null,  // We added this.
  'Nominal': 'nominal',
  'Ordinal': 'ordinal',
  'Quantitative': 'quantitative',
  'Temporal': 'temporal',
  //'GeoJSON': 'geojson',
}

interface ColSpec {
  label: str,
  field: str | null,
  detectedType: str | null,
}

interface BuilderPaneProps {
  components: {
    SelectBox: React.Node,
    TextBox: React.Node,
    BuilderWrapper: React.Node,
    WidgetGroup: React.Node,
    WidgetWraper: React.Node,
  },
  colSpecs: ColSpec[],
  state: {
    setSpec: (any) => void,
  },
  origSpec: any,
}

export function BuilderPane(props: BuilderPaneProps) {
  const encoding = props.origSpec?.encoding

  const [markType, setMarkType] = useState(props.origSpec?.mark?.type ?? DEFAULTS.mark.type)

  const xEncodingState = useEncodingState({
    field: encoding?.x?.field ?? props.colSpecs?.[DEFAULTS.x.fieldIndex + 1]?.field,
    type: encoding?.x?.type,
    value: null,
    aggregate: null,
    binStep: null,
    // title
    // timeUnit (if temporal)
    // axis
  })

  const yEncodingState = useEncodingState({
    field: encoding?.y?.field ?? props.colSpecs?.[DEFAULTS.y.fieldIndex + 1]?.field,
    type: encoding?.y?.type,
    value: null,
    aggregate: null,
    binStep: null,
    // title
    // timeUnit (if temporal)
    // axis
  })

  const colorEncodingState = useEncodingState({
    field: encoding?.color?.field,
    type: encoding?.color?.type,
    value: null,
    aggregate: null,
    binStep: null,
    // title
    // timeUnit (if temporal)
    // axis
  })

  const sizeEncodingState = useEncodingState({
    field: encoding?.size?.field,
    type: encoding?.size?.type,
    value: null,
    aggregate: null,
    binStep: null,
    // title
    // timeUnit (if temporal)
    // axis
  })

  const opacityEncodingState = useEncodingState({
    field: encoding?.opacity?.field,
    type: encoding?.opacity?.type,
    value: null,
    aggregate: null,
    binStep: null,
    // title
    // timeUnit (if temporal)
    // axis
  })

  const encodings = [
    ['X', xEncodingState],
    ['Y', yEncodingState],
    ['Color', colorEncodingState],
    ['Size', sizeEncodingState],
    ['Opacity', opacityEncodingState],
  ]

  // tooltip
  // facet, row, column
  // x2, y2, text, angle, xOffset(+random), yOffset(+random), strokeWidth, strokeDash, shape

  const fields = {'None': null}
  props.colSpecs.forEach(s => fields[s.label] = s.field)

  useEffect(() => {
    const newSpec = merge({}, props.origSpec, {
      mark: {
        type: markType,
        tooltip: true,
      },
      encoding: {
        ...buildEncoding('x', xEncodingState.state, props.colSpecs),
        ...buildEncoding('y', yEncodingState.state, props.colSpecs),
        ...buildEncoding('color', colorEncodingState.state, props.colSpecs),
        ...buildEncoding('size', sizeEncodingState.state, props.colSpecs),
        ...buildEncoding('opacity', opacityEncodingState.state, props.colSpecs),
      },
      params: [{
        name: 'grid',
        select: 'interval',
        bind: 'scales'
      }]
    })

    props.state.setSpec(newSpec)
  }, [
      markType,
      props.origSpec,
      ...encodings.map(x => x[1].state)
  ])

  return (
    <props.components.BuilderWrapper>
      <props.components.WidgetGroup>
          <props.components.SelectBox
            label='Mark'
            items={MARKS}
            value={markType}
            setValue={setMarkType}
          />
      </props.components.WidgetGroup>

      {encodings.map(([title, encodingState]) => (
        <EncodingPicker
          components={props.components}
          title={title}
          encodingState={encodingState}
          fields={fields}
          types={FIELD_TYPES}
          key={title}
        />
      ))}

    </props.components.BuilderWrapper>
  )
}

export function useBuilderState(origSpec) {
  const [spec, setSpec] = useState(origSpec)

  return {
    spec,
    setSpec,
  }
}

function buildEncoding(key, state, colSpecs) {
  const enc = {}
  const encWrapper = {[key]: enc}

  if (state.field == null) {
    if (state.value) {
      enc.value = state.value
    } else {
      return {}
    }
  } else {
    enc.field = state.field
    enc.type = getColType(
      state.type,
      state.field,
      DEFAULTS[key].type,
      colSpecs,
    )

    if (state.aggregate) enc.aggregate = state.aggregate
    if (state.binStep) enc.bin = { step: state.binStep }
  }

  return encWrapper
}

function getColType(colType, colName, defaultType, colSpecs) {
  if (colType != null) return colType

  const colSpec = colSpecs.find(s => s.field == colName)
  return colSpec?.detectedType ?? defaultType
}
