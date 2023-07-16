import React, { useState, useEffect } from 'react'
import merge from 'lodash/merge'

import { EncodingPicker } from './EncodingPicker.tsx'

const MARKS = [
  //'arc',
  'area',
  'bar',
  //'image',
  'line',
  'point',
  //'rect',
  //'rule',
  //'text',
  //'tick',
  //'trail',
  'circle',
  'square',
  //'geoshape',
]

const FIELD_TYPES = [
  'auto',  // We added this.
  'nominal',
  'ordinal',
  'quantitative',
  'temporal',
  //'geojson',
]

const DEFAULTS = {
  markType: 'circle',
  xFieldIndex: 0,
  yFieldIndex: 1,
  xType: 'quantitative',
  yType: 'quantitative',
  colorType: 'nominal',
  sizeType: 'quantitative',
}

interface ColSpec {
  label: str,
  field: str | null,
  detectedType: str | null,
}

interface BuilderPaneProps {
  components: {
    Label: React.Node,
    SelectBox: React.Node,
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

  const [markType, setMarkType] = useState(props.origSpec?.mark?.type ?? DEFAULTS.markType)

  const [xField, setXField] = useState(
    encoding?.x?.field ?? props.colSpecs?.[DEFAULTS.xFieldIndex + 1]?.field)
  const [xType, setXType] = useState(encoding?.x?.type ?? 'auto')

  const [yField, setYField] = useState(
    encoding?.y?.field ?? props.colSpecs?.[DEFAULTS.yFieldIndex + 1]?.field)
  const [yType, setYType] = useState(encoding?.y?.type ?? 'auto')

  const [colorField, setColorField] = useState(encoding?.color?.field)
  const [colorType, setColorType] = useState(encoding?.color?.type ?? 'auto')

  const [sizeField, setSizeField] = useState(encoding?.size?.field)
  const [sizeType, setSizeType] = useState(encoding?.size?.type ?? 'auto')

  const fields = {'None': null}
  props.colSpecs.forEach(s => fields[s.label] = s.field)

  useEffect(() => {
    const newSpec = merge({}, props.origSpec, {
      mark: {
        type: markType,
        tooltip: true,
      },
      encoding: {
        x: xField && {
          field: xField,
          //type: xType,
          type: getColType(
            xType,
            xField,
            props.colSpecs,
            DEFAULTS.xType,
          )
        },
        y: yField && {
          field: yField,
          //type: yType,
          type: getColType(
            yType,
            yField,
            props.colSpecs,
            DEFAULTS.yType,
          )
        },
        color: colorField && {
          field: colorField,
          //type: colorType,
          type: getColType(
            colorType,
            colorField,
            props.colSpecs,
            DEFAULTS.colorType,
          )
        },
        size: sizeField && {
          field: sizeField,
          //type: sizeType,
          type: getColType(
            sizeType,
            sizeField,
            props.colSpecs,
            DEFAULTS.sizeType,
          )
        },
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
      xField,
      xType,
      yField,
      yType,
      colorField,
      colorType,
      sizeField,
      sizeType,
      props.origSpec,
  ])

  return (
    <props.components.BuilderWrapper>
      <props.components.WidgetGroup>
        <props.components.WidgetWrapper>
          <props.components.Label>Mark</props.components.Label>
          <props.components.SelectBox
            items={MARKS}
            value={markType}
            setValue={setMarkType}
          />
        </props.components.WidgetWrapper>
      </props.components.WidgetGroup>

      <EncodingPicker
        components={props.components}
        title={"X"}
        field={xField}
        fields={fields}
        setField={setXField}
        type={xType}
        types={FIELD_TYPES}
        setType={setXType}
      />

      <EncodingPicker
        components={props.components}
        title={"Y"}
        field={yField}
        fields={fields}
        setField={setYField}
        type={yType}
        types={FIELD_TYPES}
        setType={setYType}
      />

      <EncodingPicker
        components={props.components}
        title={"Color"}
        field={colorField}
        fields={fields}
        setField={setColorField}
        type={colorType}
        types={FIELD_TYPES}
        setType={setColorType}
      />

      <EncodingPicker
        components={props.components}
        title={"Size"}
        field={sizeField}
        fields={fields}
        setField={setSizeField}
        type={sizeType}
        types={FIELD_TYPES}
        setType={setSizeType}
      />

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

function getColType(colType, colName, colSpecs, fallback) {
  if (colType != 'auto') return colType

  const colSpec = colSpecs.find(s => s.field == colName)
  return colSpec.detectedType ?? fallback;
}
