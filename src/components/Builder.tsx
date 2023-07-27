import React, { useState, useEffect, useCallback } from "react"
import merge from "lodash/merge"

import { ChannelBuilder, useChannelState } from "./ChannelBuilder.tsx"
import { isElementOf, haveAnyElementsInCommon } from "../array.ts"

const UI_DEFAULTS = {
  mark: {
    type: "circle",
  },
  x: {
    fieldIndex: 0,
    importance: "high",
  },
  y: {
    fieldIndex: 1,
    importance: "high",
  },
  theta: {
    fieldIndex: 0,
    importance: "high",
  },
  color: {
    importance: "high",
  },
}

const UI_EXTRAS = {
  xOffset: {
    extraFields: {"Random jitter": "random--p5bJXXpQgvPz6yvQMFiy"},
  },
  yOffset: {
    extraFields: {"Random jitter": "random--p5bJXXpQgvPz6yvQMFiy"},
  },
}

const MARKS = {
  // Basic
  "point": "Point",
  "circle": "Circle",
  "square": "Square",
  "line": "Line", // Properties: point, interpolate
  "area": "Area", // Properties: point, line, interpolate
  "bar": "Bar", // Properties: orient, binSpacing
  "arc": "Arc",

  // Advanced
  "boxplot": "Box plot",
  "rect": "Rect",
  "tick": "Tick",
  "rule": "Rule",
  "text": "Text", // Need to show "text" channel. Properties: dx, dy, fontSize, limit, align, baseline
  "image": "Image", // width, height, align, baseline
  //"geoshape": "Geographic shape",
}

const ENCODING_CHANNELS = {
  "text": "Text",
  "url": "URL",
  "x": "X",
  "x2": "X2",
  "y": "Y",
  "y2": "Y2",
  "theta": "Theta",
  "theta2": "Theta2",
  "radius": "Radius",
  "radius2": "Radius2",
  "color": "Color",
  "size": "Size",
  "opacity": "Opacity",
  "facet": "Facet",
  "row": "Row",
  "column": "Column",
  "xOffset": "X Offset",
  "yOffset": "Y Offset",
}

const CHANNEL_FIELDS = {
  "field": "Field",
  "value": "Value",
  "type": "Type",
  "aggregate": "Aggregate",
  "binStep": "Bin size",
  "stack": "Stack",
  "legend": "Legend",
  "timeUnit": "Time unit",
  "title": "Title",
}

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
  marks: Dict[str],  // Title -> Channel dict
  encodingChannels: Dict[str],  // name -> title
  channelFields: Dict[str],  // name -> title
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
  const [markType, setMarkType] = useState(props?.baseSpec?.mark?.type ?? UI_DEFAULTS.mark.type)

  const marks = props.marks ?? MARKS
  const encodingChannels = props.encodingChannels ?? ENCODING_CHANNELS
  const channelFields = props.channelFields ?? CHANNEL_FIELDS

  const channelStates =
    Object.entries(encodingChannels).map(([channel, title]) => ({
      channel,
      stateObj: useChannelState(
        props?.baseSpec?.encoding?.[channel],
        { field: props.colSpecs?.[UI_DEFAULTS[channel]?.fieldIndex + 1]?.field },
      ),
    }))

  // text, angle, xOffset(+random), yOffset(+random),
  // strokeWidth, strokeDash, shape, tooltip

  const fields = {"None": null}
  props.colSpecs.forEach(s => fields[s.label] = s.field)

  useEffect(() => {
    const newSpec = updateVegaSpec(markType, channelStates, props?.baseSpec, props.colSpecs)
    props.state.setSpec(newSpec)
  }, [
      markType,
      props?.baseSpec,
      ...channelStates.map(x => x.stateObj.state)
  ])

  return (
    <props.components.LayerContainer>
      <props.components.WidgetGroup importance="highest">
          <props.components.GenericPickerWidget
            name="mark"
            widgetHint="select"
            label="Mark"
            items={Object.fromEntries(Object.entries(marks).map(entry => entry.reverse()))}
            value={markType}
            setValue={setMarkType}
            importance={"highest"}
          />
      </props.components.WidgetGroup>

      {channelStates
        .filter(channelState => shouldIncludeChannel(channelState.channel, markType))
        .map(channelState => (
          <ChannelBuilder
            channelState={channelState}
            channelFields={channelFields}
            encodingChannels={encodingChannels}
            components={props.components}
            fields={{...fields, ...UI_EXTRAS[channelState.channel]?.extraFields}}
            types={FIELD_TYPES}
            key={channelState.channel}
            importance={UI_DEFAULTS[channelState.channel]?.importance}
          />
        ))
      }
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

function updateVegaSpec(markType, channelStates, baseSpec, colSpecs) {
  const encoding = Object.fromEntries(channelStates
    .filter(channelState => shouldIncludeChannel(channelState.channel, markType))
    .map(channelState => {
      const channelSpec = buildChannelSpec(channelState, colSpecs)
      if (channelSpec) return [channelState.channel, channelSpec]
      return []
    })
  )

  const builderSpec = {
    mark: {
      type: markType,
      tooltip: true,
    },

    params: [{
      name: "grid",
      select: "interval",
      bind: "scales"
    }],

    encoding,
  }

  const transforms = buildTransforms(channelStates)

  if (transforms) {
    builderSpec.data = {
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

function buildChannelSpec(channelState, colSpecs) {
  const state = channelState.stateObj.state

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
        channelState.channel,
        state.type,
        state.field,
        colSpecs,
      )
    }

    if (state.aggregate != null) channelSpec.aggregate = state.aggregate
    if (state.binStep != null) channelSpec.bin = { step: state.binStep }
    if (state.stack != null) channelSpec.stack = state.stack
  }

  return Object.keys(channelSpec).length > 0 ? channelSpec : null
}

function buildTransforms(channelState) {
  const hasRandomField = channelState.some(
    enc => enc.stateObj?.state?.field == "random--p5bJXXpQgvPz6yvQMFiy")

  const transforms = []

  if (hasRandomField) {
    transforms.push(
      {"calculate": "random()", "as": "random--p5bJXXpQgvPz6yvQMFiy"},
    )
  }

  return transforms.length > 0 ? transforms : null
}

function getColType(channel, colType, colName, colSpecs) {
  if (colType != null) return colType
  if (colName == "random--p5bJXXpQgvPz6yvQMFiy") return "quantitative"

  const colSpec = colSpecs.find(s => s.field == colName)
  return colSpec?.detectedType
}

function shouldIncludeChannel(channel, markType) {
  switch (channel) {
    case "x":
    case "y":
    case "xOffset":
    case "yOffset":
      return !isElementOf(markType, ["arc", "geoshape"])

    case "x2":
    case "y2":
      return isElementOf(markType, ["area", "bar", "rect", "rule"])

    case "theta":
    case "theta2":
    case "radius":
    case "radius2":
      return markType == "arc" // OR there's an Arc layer in the chart

    case "text":
      return markType == "text"

    case "url":
      return markType == "image"

    case "size":
      return markType != "image"

    default:
      return true
  }
}
