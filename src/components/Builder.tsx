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
  const [markType, setMarkType] = useState(props.origSpec?.mark?.type ?? DEFAULTS.mark.type)

  const origEncSpec = props.origSpec?.encoding
  const encodingInfos =
    Object.entries(props.channels).map(([title, channel]) => ({
      channel,
      title,
      encodingState: useEncodingState(
        origEncSpec?.[channel],
        { field: props.colSpecs?.[DEFAULTS[channel]?.fieldIndex + 1]?.field },
      ),
    }))

  // tooltip
  // facet, row, column
  // x2, y2, text, angle, xOffset(+random), yOffset(+random), strokeWidth, strokeDash, shape

  const fields = {"None": null}
  props.colSpecs.forEach(s => fields[s.label] = s.field)

  useEffect(() => {
    const newSpec = updateVegaSpec(markType, encodingInfos, props.origSpec, props.colSpecs)
    props.state.setSpec(newSpec)
  }, [
      markType,
      props.origSpec,
      ...encodingInfos.map(x => x.encodingState.state)
  ])

  return (
    <props.components.BuilderWrapper>
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

function updateVegaSpec(markType, encodingInfos, origSpec, colSpecs) {
  return merge({}, origSpec, {
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

  if (state.field == null) {
    if (state.value) {
      channelSpec.value = state.value
    } else {
      return null
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

  return channelSpec
}

function getColType(colType, colName, defaultType, colSpecs) {
  if (colType != null) return colType

  const colSpec = colSpecs.find(s => s.field == colName)
  return colSpec?.detectedType ?? defaultType
}
