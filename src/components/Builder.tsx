import React, { useState, useEffect, useCallback } from "react"
import merge from "lodash/merge"

import { EncodingPicker, useEncodingState } from "./EncodingPicker.tsx"

const DEFAULTS = {
  mark: {
    type: "circle",
  },
  x: {
    fieldIndex: 0,
    visibilityState: "expanded",
  },
  y: {
    fieldIndex: 1,
    visibilityState: "expanded",
  },
  color: {
    visibilityState: "expanded",
  },
}

const MARKS = [
  // Basic
  "area", // Properties: point, line, interpolate
  "bar", // Properties: orient, binSpacing
  "circle",
  "line", // Properties: point, interpolate
  "point",
  "square",

  // Advanced
  "boxplot",
  "rect",
  "tick",
  //"image",
  //"arc",
  //"rule",
  //"text", // Need to show "text" encoding. Properties: dx, dy, fontSize, limit, align, baseline
  //"geoshape",
]

const FIELD_TYPES = {
  "Auto": null,  // We added this.
  "Nominal": "nominal",
  "Ordinal": "ordinal",
  "Quantitative": "quantitative",
  "Temporal": "temporal",
  //"GeoJSON": "geojson",
}

interface ColSpec {
  label: str,
  field: str | null,
  detectedType: str | null,
}

interface Dict<T> {
  [key: str]: T,
}

interface BuilderPaneProps {
  channels: Dict[str],  // Title -> Channel dict
  components: {
    SelectBox: React.Node,
    TextBox: React.Node,
    BuilderContainer: React.Node,
    WidgetGroup: React.Node,
    WidgetWraper: React.Node,
  },
  colSpecs: ColSpec[],
  state: {
    spec: any,
    setSpec: (any) => void,
  },
  baseSpec: any,
}

export function BuilderPane(props: BuilderPaneProps) {
  const [key, setKey] = useState(0)

  const reset = useCallback(() => setKey(key + 1))

  return (
    <props.components.BuilderContainer>
      <LayerBuilder key={key} {...props} />

      <props.components.ToolbarContainer>
        <props.components.Button
          onClick={reset}
        >
          Reset
        </props.components.Button>
      </props.components.ToolbarContainer>
    </props.components.BuilderContainer>
  )
}

export function LayerBuilder(props: BuilderPaneProps) {
  const [markType, setMarkType] = useState(props?.baseSpec?.mark?.type ?? DEFAULTS.mark.type)

  const encodingInfos =
    Object.entries(props.channels).map(([title, channel]) => ({
      channel,
      title,
      encodingState: useEncodingState(
        props?.baseSpec?.encoding?.[channel],
        { field: props.colSpecs?.[DEFAULTS[channel]?.fieldIndex + 1]?.field },
      ),
    }))

  // tooltip
  // text, angle, xOffset(+random), yOffset(+random),
  // strokeWidth, strokeDash, shape

  const fields = {"None": null}
  props.colSpecs.forEach(s => fields[s.label] = s.field)

  useEffect(() => {
    const newSpec = updateVegaSpec(markType, encodingInfos, props?.baseSpec, props.colSpecs)
    props.state.setSpec(newSpec)
  }, [
      markType,
      props?.baseSpec,
      ...encodingInfos.map(x => x.encodingState.state)
  ])

  return (
    <props.components.LayerContainer>
      <props.components.WidgetGroup visibilityState={"always"}>
          <props.components.SelectBox
            label="Mark"
            items={MARKS}
            value={markType}
            setValue={setMarkType}
            visibilityState={"always"}
          />
      </props.components.WidgetGroup>

      {encodingInfos.map((encInfo) => (
        <EncodingPicker
          encodingInfo={encInfo}
          components={props.components}
          fields={fields}
          types={FIELD_TYPES}
          key={encInfo.title}
          visibilityState={DEFAULTS[encInfo.channel]?.visibilityState}
        />
      ))}
    </props.components.LayerContainer>
  )
}

export function useBuilderState(baseSpec) {
  const [spec, setSpec] = useState(baseSpec)

  return {
    spec,
    setSpec,
  }
}

function updateVegaSpec(markType, encodingInfos, baseSpec, colSpecs) {
  return merge({}, baseSpec, {
    mark: {
      type: markType,
      tooltip: true,
    },

    encoding: encodingInfos.reduce(
      (encodingSpec, encInfo) => {
        const channelSpec = buildChannelSpec(encInfo, colSpecs)
        if (channelSpec) {
          encodingSpec[encInfo.channel] = channelSpec
        }
        return encodingSpec
      },
      {}
    ),

    params: [{
      name: "grid",
      select: "interval",
      bind: "scales"
    }]
  })
}

function buildChannelSpec(encodingInfo, colSpecs) {
  const state = encodingInfo.encodingState.state

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
        state.type,
        state.field,
        DEFAULTS[encodingInfo.channel]?.type,
        colSpecs,
      )
    }

    if (state.aggregate != null) channelSpec.aggregate = state.aggregate
    if (state.binStep != null) channelSpec.bin = { step: state.binStep }
    if (state.stack != null) channelSpec.stack = state.stack
  }

  return Object.keys(channelSpec).length > 0 ? channelSpec : null
}

function getColType(colType, colName, defaultType, colSpecs) {
  if (colType != null) return colType

  const colSpec = colSpecs.find(s => s.field == colName)
  return colSpec?.detectedType ?? defaultType
}
