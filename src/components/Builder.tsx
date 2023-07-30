import React, { useState, useEffect, useCallback } from "react"
import merge from "lodash/merge"

import * as specConfig from "../specConfig.ts"
import { isElementOf, haveAnyElementsInCommon } from "../array.ts"

import { BuilderPaneProps } from "./commonTypes.ts"
import { LayerBuilder } from "./LayerBuilder.tsx"


export function BuilderPane(props: BuilderPaneProps) {
  const widgets = props.widgets ?? specConfig.WIDGETS

  const [key, setKey] = useState(0)
  const builderState = useBuilderState(props.columns, widgets)

  const reset = useCallback(() => {
    setKey(key + 1)
  }, [setKey])

  useEffect(() => {
    props.state.setSpec(
      updateVegaSpec(builderState, props.columns, props?.baseSpec)
    )
  }, [
      props.baseSpec,
      props.columns,
      builderState.mark.state,
      builderState.encoding.states,
  ])

  return (
    <props.ui.BuilderContainer>
      <LayerBuilder
        key={`builder-${key}`}
        layerState={builderState}
        columns={props.columns}
        ui={props.ui}
        widgets={widgets}
        smartHideProperties={props.smartHideProperties}
        />

      <props.ui.ToolbarContainer>
        <props.ui.Button onClick={reset}>
          Reset
        </props.ui.Button>
      </props.ui.ToolbarContainer>
    </props.ui.BuilderContainer>
  )
}

export function useSpecState(baseSpec) {
  const [spec, setSpec] = useState(baseSpec)
  return { spec, setSpec }
}

function useBuilderState(columns, widgets) {
  // TODO: If we want to use the baseSpec here for defaults, then we need
  // to be able to convert it to a format we use for the state. That's complex
  // because specs have several shorthands. For example, mark can be "circle"
  // or {"type": "circle"}.

  const markValues = specConfig.MARK_VALUES
  const [markState, setMarkState] = useState(
    Object.fromEntries(
      Object.entries(widgets.mark).map(([property, markSpec]) => [
        property,
        widgets.mark[property]?.default
      ])))

  const [channelStates, setEncodingState] = useState(
    Object.fromEntries(
      Object.entries(widgets.channels).map(([channel, channelSpec]) => {
        const defaultColIndex = channelSpec.defaultColIndex
        const defaultColName = columns?.[defaultColIndex]?.colName

        const fallbackState = defaultColIndex == null
          ? {}
          : { field: defaultColName }

        return [
          channel,
          fallbackState
        ]
      })
    )
  )

  return {
    mark: {
      state: markState,
      setProperty: (property: str, newValue: any) => {
        setMarkState({
          ...markState,
          [property]: newValue,
        })
      },
    },

    encoding: {
      states: channelStates,
      setProperty: (channel: str) => (property: str, newValue: any) => {
        setEncodingState({
          ...channelStates,
          [channel]: {
            ...channelStates[channel],
            [property]: newValue,
          }
        })
      },
    }
  }
}

// TODO: Use Arrow fields to guess columnTypes:
// arrowdata.schema.fields[0].name
// arrowdata.schema.fields[0].type
// arrowjs.type :: DataType.isDate, isTime, isTimestamp, isBool, isInt, isFloat

export function simpleColumnTypeDetector(exampleCell) {
  switch (getTypeAsStr(exampleCell)) {
    case "number":
      return "quantitative"

    case Date:
      return "temporal"

    default:
      return "nominal"
  }
}

function getTypeAsStr(obj) {
  const simple_type = typeof obj
  if (simple_type != "object") return simple_type

  if (obj instanceof Date) return "date"
  if (obj instanceof Object) return "object"

  return "unknown"
}

function updateVegaSpec(builderState, columns, baseSpec) {
  const mark = Object.fromEntries(
    Object.entries(builderState.mark.state)
      .filter(([k, v]) => v != null)
      .filter(([k, v]) =>
        specConfig.keepMarkProperty(k, builderState.mark.state.type)))

  const encoding = Object.fromEntries(
    Object.entries(builderState.encoding.states)
      .filter(([channel]) =>
        specConfig.keepChannel(
          channel, builderState.mark.state.type))
      .map(([channel, channelState]) => {
        const channelSpec = buildChannelSpec(channel, channelState, columns)
        if (channelSpec) return [channel, channelSpec]
        return []
      }))

  const builderSpec = {
    mark: {
      tooltip: true,
      ...mark,
    },

    encoding,

    params: [{
      name: "grid",
      select: "interval",
      bind: "scales"
    }],

    data: {
      name: "dataset1",
    },
  }

  const transforms = buildTransforms(builderState.encoding.states)

  if (transforms) {
    builderSpec.data = {
      ...builderSpec.data,
      transform: transforms,
    }
  }

  const outSpec = merge({}, baseSpec, builderSpec)

  // The row, column, and facet encodings use the chart-wide size,
  // which is usually not what users want. Besides, they don't work when
  // width/height are set to "container". So we just delete the chart
  // width/height and let Vega pick the best dimensions instead.
  if (haveAnyElementsInCommon(Object.keys(encoding), ["row", "column", "facet"])) {
    delete outSpec.width
    delete outSpec.height
  }

  return outSpec
}

function buildChannelSpec(channel, state, columns) {
  const channelSpec = {}

  if (state.title != null) channelSpec.title = state.title
  if (state.legend != null) channelSpec.legend = state.legend
  if (state.type == "temporal") channelSpec.timeUnit = state.timeUnit

  if (state.field == null) {
    if (state.value) {
      channelSpec.value = state.value
    }
  } else {
    if (state.field != null) {
      channelSpec.field = state.field
      channelSpec.type = getColType(
        channel,
        state.type,
        state.field,
        columns,
      )
    }

    if (state.aggregate != null) channelSpec.aggregate = state.aggregate
    if (state.binStep != null) channelSpec.bin = { step: state.binStep }
    if (state.stack != null) channelSpec.stack = state.stack
  }

  return Object.keys(channelSpec).length > 0 ? channelSpec : null
}

function buildTransforms(channelStates) {
  const hasRandomField = Object.values(channelStates)
    .some(channelState => channelState.field == specConfig.RANDOM_FIELD_NAME)

  const transforms = []

  if (hasRandomField) {
    transforms.push(
      {"calculate": "random()", "as": specConfig.RANDOM_FIELD_NAME},
    )
  }

  return transforms.length > 0 ? transforms : null
}

function getColType(channel, colType, colName, columns) {
  if (colType != null && colType != specConfig.AUTO_FIELD) return colType
  if (colName == specConfig.RANDOM_FIELD_NAME) return "quantitative"

  const colSpec = columns.find(s => s.colName == colName)
  return colSpec?.detectedType
}
