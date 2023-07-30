import { isElementOf, haveAnyElementsInCommon } from "./array.ts"

export const RANDOM_FIELD_NAME = "random--p5bJXXpQgvPz6yvQMFiy"

export const UI_EXTRAS = {
  xOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
  yOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
}

// For these constants, order matters! This is the order they'll appear in the UI.
// (string keys in JS Objects are guaranteed to be ordered by insertion order)

export const WIDGETS = {
  mark: {
    type: { label: "Type", advanced: false, default: "point" },
    line: { label: "Line", advanced: true },
    point: { label: "Point", advanced: true },
    interpolate: { label: "Interpolate", advanced: true },
    orient: { label: "Orient", advanced: true },
    shape: { label: "Shape", advanced: true },
    filled: { label: "Filled", advanced: true },
    binSpacing: { label: "Bin spacing", advanced: true },
    angle: { label: "Angle", advanced: true }
    // size: { label: "Size", advanced: true },
    // width: { label: "Width", advanced: true },
    // height: { label: "Height", advanced: true },
    // align: { label: "Align", advanced: true },
    // baseline: { label: "Baseline", advanced: true },
    // strokeWidth: { label: "strokeWidth", advanced: true },
    // strokeDash: { label: "strokeDash", advanced: true },
    // href: { label: "Href", advanced: true},
  },

  channels: {
    text: { label: "Text", advanced: false },
    url: { label: "URL", advanced: false },
    x: { label: "X", advanced: false, defaultColIndex: 0 },
    x2: { label: "X2", advanced: true },
    y: { label: "Y", advanced: false, defaultColIndex: 1 },
    y2: { label: "Y2", advanced: true },
    theta: { label: "Theta", advanced: false, defaultColIndex: 0 },
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
  },

  channelProperties: {
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
}

export const AUTO_FIELD = "__null__"

export const FIELD_TYPES = {
  [AUTO_FIELD]: "Auto",  // We added this.
  nominal: "Nominal",
  ordinal: "Ordinal",
  quantitative: "Quantitative",
  temporal: "Temporal",
  geojson: "GeoJSON",
}

export const MARK_PROPERTY_VALUES = {
  type: {
    "Point": "point",
    "Line": "line", // Properties: point, interpolate
    "Area": "area", // Properties: point, line, interpolate
    "Bar": "bar", // Properties: orient, binSpacing
    "Arc": "arc",
    "Box plot": "boxplot",
    "Circle": "circle",
    "Geo shape": "geoshape",
    "Image": "image", // Properties: width, height, align, baseline
    "Rect": "rect",
    "Rule": "rule",
    "Square": "square",
    "Text": "text", // Properties: dx, dy, fontSize, limit, align, baseline
    "Tick": "tick",
  },

  point: {
    "Hide": null,
    "Show": true,
  },

  interpolate: {
    "Linear": "linear",
    "Monotone": "monotone",
    "Basis": "basis",
    "Cardinal": "cardinal",
    "Step": "step",
    "Step after": "step-after",
    "Step before": "step-before",
    "Basis closed": "basis-closed",
    "Basis open": "basis-open",
    "Cardinal closed": "cardinal-closed",
    "Cardinal open": "cardinal-open",
    "Linear-closed": "linear-closed",
    "Bundle": "bundle",
  },

  orient: {
    "Horizontal": "horizontal",
    "Vertical": "vertical",
  },

  shape: {
    "Circle": "circle",
    "Square": "square",
    "Cross": "cross",
    "Diamond": "diamond",
    "Stroke": "stroke",
    "Arrow": "arrow",
    "Wedge": "wedge",
    "Triangle": "triangle",
  },

  filled: {
    "false": null,
    "true": true,
  },

  line: {
    "false": null,
    "true": true,
  },
}

export const CHANNEL_PROPERTY_VALUES = {
  aggregate: {
    "None": null,
    "Count": "count",
    "Sum": "sum",
    "Mean": "mean",
    "Std. deviation": "stdev",
    "Variance": "variance",
    "Min": "min",
    "Max": "max",
    "1st quartile": "q1",
    "Median": "median",
    "3rd quartile": "q3",
    "Distinct": "distinct",
    "Valid": "valid",
    "Missing": "missing",
  },

  timeUnit: {
    "Auto": null,
    "Milliseconds": "milliseconds",
    "Seconds": "seconds",
    "Minutes": "minutes",
    "Hours": "hours",
    "Day of the month": "date",
    "Day of year": "dayofyear",
    "Day of week": "day",
    "Week": "week",
    "Month": "month",
    "Quarter": "quarter",
    "Year": "year",
    "Year and quarter": "yearquarter",
    "Year and month": "yearmonth",
    "Year, month, date": "yearmonthdate",
  },

  stack: {
    "True": null,
    "Normalize": "normalize",
    "False": false,
  },

  legend: {
    "Off": false,
    "On": null,
  },
}

export function keepMarkProperty(property, markType, smartHideProperties = true) {
  if (!smartHideProperties) return true

  switch (property) {
    case "shape":
    case "filled":
      return markType == "point"

    case "point":
    case "interpolate":
      return isElementOf(markType, ["line", "area"])

    case "angle":
      return isElementOf(markType, ["point", "text", "image"])

    case "line":
      return markType == "area"

    case "binSpacing":
      return markType == "bar"

    case "orient":
      return isElementOf(markType, ["bar", "line", "area", "boxPlot"])

    default:
      return true
  }
}

export function keepChannel(channel, markType, smartHideProperties = true) {
  if (!smartHideProperties) return true

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

export function keepChannelProperty(
  name, channel, state, smartHideProperties = true): boolean
{
  if (!smartHideProperties) return true

  const fieldIsSet = !!state.field

  switch (name) {
    case "field":
      return true

    case "value":
      return !fieldIsSet

    case "type":
      return fieldIsSet

    case "title":
      return fieldIsSet && !isElementOf(channel, ["theta", "theta2", "radius", "radius2"])

    case "aggregate":
      return fieldIsSet && state.binStep == null

    case "binStep":
      return fieldIsSet && state.aggregate == null

    case "stack":
      return fieldIsSet && isElementOf(channel, ["x", "y"])

    case "legend":
      return fieldIsSet && isElementOf(channel, ["color", "size", "opacity"])

    case "timeUnit":
      return fieldIsSet && state.type == "temporal"

    default:
      return true
  }
}
