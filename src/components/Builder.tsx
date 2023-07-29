import React, { useState, useEffect, useCallback } from "react"
import merge from "lodash/merge"

import { ChannelBuilder, useChannelState } from "./ChannelBuilder.tsx"
import { isElementOf, haveAnyElementsInCommon } from "../array.ts"

const RANDOM_FIELD_NAME = "random--p5bJXXpQgvPz6yvQMFiy"

const UI_EXTRAS = {
  xOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
  yOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
}

const MARKS = {
  // Basic
  point: { label: "Point", advanced: false, isDefault: true },
  line: { label: "Line", advanced: false }, // Properties: point, interpolate
  area: { label: "Area", advanced: false }, // Properties: point, line, interpolate
  bar: { label: "Bar", advanced: false }, // Properties: orient, binSpacing
  arc: { label: "Arc", advanced: false },
  boxplot: { label: "Box plot", advanced: false },

  // Advanced
  circle: { label: "Circle", advanced: true },
  geoshape: { label: "Geo shape", advanced: true },
  image: { label: "Image", advanced: true }, // Properties: width, height, align, baseline
  rect: { label: "Rect", advanced: true },
  rule: { label: "Rule", advanced: true },
  square: { label: "Square", advanced: true },
  text: { label: "Text", advanced: true }, // Properties: dx, dy, fontSize, limit, align, baseline
  tick: { label: "Tick", advanced: true },
}

const CHANNELS = {
  text: { label: "Text", advanced: false },
  url: { label: "URL", advanced: false },
  x: { label: "X", advanced: false, defaultFieldIndex: 0 },
  x2: { label: "X2", advanced: true },
  y: { label: "Y", advanced: false, defaultFieldIndex: 1 },
  y2: { label: "Y2", advanced: true },
  theta: { label: "Theta", advanced: false, defaultFieldIndex: 0 },
  theta2: { label: "Theta2", advanced: true },
  radius: { label: "Radius", advanced: true },
  radius2: { label: "Radius2", advanced: true },
  latitude: { label: "Latitude", advanced: false },
  latitude2: { label: "Latitude2", advanced: true },
  longitude: { label: "Longitude", advanced: false },
  longitude2: { label: "Longitude2", advanced: true },
  color: { label: "Color", advanced: false },
  size: { label: "Size", advanced: true },
  opacity: { label: "Opacity", advanced: true },
  facet: { label: "Facet", advanced: true },
  row: { label: "Row", advanced: true },
  column: { label: "Column", advanced: true },
  xOffset: { label: "X offset", advanced: true },
  yOffset: { label: "Y offset", advanced: true },
  // angle
  // strokeWidth, strokeDash
  // shape
  // tooltip
}

const FIELDS = {
  field: { label: "Field", advanced: false },
  value: { label: "Value", advanced: true },
  type: { label: "Type", advanced: true },
  aggregate: { label: "Aggregate", advanced: true },
  binStep: { label: "Bin size", advanced: true },
  stack: { label: "Stack", advanced: true },
  legend: { label: "Legend", advanced: true },
  timeUnit: { label: "Time unit", advanced: true },
  title: { label: "Title", advanced: true },
}

const AUTO_FIELD = "__null__"

const FIELD_TYPES = {
  [AUTO_FIELD]: "Auto",  // We added this.
  nominal: "Nominal",
  ordinal: "Ordinal",
  quantitative: "Quantitative",
  temporal: "Temporal",
  geojson: "GeoJSON",
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
  marks: any,  // name -> {label, advanced, isDefault}
  channels: any,  // name -> {label, advanced, defaultFieldIndex}
  fields: any,  // name -> {label, advanced}
  smartHideFields: boolean,
  components: {
    // TODO
  },
  columns: ColSpec[],
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
      <LayerBuilder key={`builder-${key}`} {...props} />

      <props.components.ToolbarContainer>
        <props.components.Button onClick={reset}>
          Reset
        </props.components.Button>
      </props.components.ToolbarContainer>
    </props.components.BuilderContainer>
  )
}

export function LayerBuilder(props: BuilderPaneProps) {
  const marks = props.marks ?? MARKS
  const channels = props.channels ?? CHANNELS
  const fields = props.fields ?? FIELDS

  const [markType, setMarkType] = useState(
    props?.baseSpec?.mark?.type ??
    Object.entries(marks).find(([k, mspec]) => mspec.default)?.[0] ??
    Object.keys(marks)[0])

  const channelStates = Object.keys(channels)
    .map((channel) => {

      const defaultFieldIndex = channels[channel]?.defaultFieldIndex

      const fallbackState = defaultFieldIndex == null
        ? null
        : {
          field: props.columns?.[defaultFieldIndex + 1]?.colName
        }

      return {
        channel,
        stateObj: useChannelState(
          props?.baseSpec?.encoding?.[channel],
          fallbackState,
        ),
      }
    })

  const columns = {"None": null}
  props.columns.forEach(s => columns[s.colName] = s.colName)

  useEffect(() => {
    const newSpec = updateVegaSpec(markType, channelStates, props?.baseSpec, props.columns)
    props.state.setSpec(newSpec)
  }, [
      markType,
      props?.baseSpec,
      ...channelStates.map(x => x.stateObj.state)
  ])

  return (
    <props.components.LayerContainer>
      <props.components.MarkContainer>
        <props.components.GenericPickerWidget
          vlPropType="mark"
          vlPropName="mark"
          widgetHint="select"
          label="Mark"
          items={Object.fromEntries(
            Object.entries(marks).map(([k, v]) => [v.label, k])
          )}
          value={markType}
          setValue={setMarkType}
        />
      </props.components.MarkContainer>

      {channelStates
        .filter(channelState => shouldIncludeChannel(channelState.channel, markType))
        .map(channelState => (
          <ChannelBuilder
            channelState={channelState}
            fields={fields}
            channels={channels}
            components={props.components}
            smartHideFields={props.smartHideFields ?? true}
            columns={{...columns, ...UI_EXTRAS[channelState.channel]?.extraCols}}
            types={FIELD_TYPES}
            key={channelState.channel}
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

function updateVegaSpec(markType, channelStates, baseSpec, columns) {
  const encoding = Object.fromEntries(channelStates
    .filter(channelState => shouldIncludeChannel(channelState.channel, markType))
    .map(channelState => {
      const channelSpec = buildChannelSpec(channelState, columns)
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

    data: {
      name: "dataset1",
    },

    encoding,
  }

  const transforms = buildTransforms(channelStates)

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

function buildChannelSpec(channelState, columns) {
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
        columns,
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
    enc => enc.stateObj?.state?.field == RANDOM_FIELD_NAME)

  const transforms = []

  if (hasRandomField) {
    transforms.push(
      {"calculate": "random()", "as": RANDOM_FIELD_NAME},
    )
  }

  return transforms.length > 0 ? transforms : null
}

function getColType(channel, colType, colName, columns) {
  if (colType != null && colType != AUTO_FIELD) return colType
  if (colName == RANDOM_FIELD_NAME) return "quantitative"

  const colSpec = columns.find(s => s.colName == colName)
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

    case "latitude":
    case "latitude2":
    case "longitude":
    case "longitude2":
      return markType == "geoshape"

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
      return !isElementOf(markType, ["image", "arc"])

    case "geojson":
      return markType == "geoshape"

    default:
      return true
  }
}

function getTypeAsStr(obj) {
  const simple_type = typeof obj
  if (simple_type != "object") return simple_type

  if (obj instanceof Date) return "date"
  if (obj instanceof Object) return "object"

  return "unknown"
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
