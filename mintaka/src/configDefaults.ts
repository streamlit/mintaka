import includes from "lodash/includes"

import {
  ChannelPropertiesConfig,
  ChannelPropertyValuesConfig,
  Config,
  EncodingConfig,
  MarkConfig,
  MarkPropertyValuesConfig,
  ModeConfig,
} from "./configTypes.ts"

import {
  ChannelName,
  LayerState,
  StateValue,
} from "./stateTypes.ts"

// For these constants, order matters! This is the order they'll appear in the UI.
// (string keys in JS Objects are guaranteed to be ordered by insertion order)

// NOTE: Ordering matters.
export const modes: ModeConfig = {
  Basic: {
    presets: true,
    encoding: new Set(["x", "y", "theta", "latitude", "longitude", "color"]),
    channelProperties: new Set(["field"]),
    else: false,
  },

  Advanced: {
    presets: false,
    layers: true,
  },
}

// NOTE: Ordering matters.
export const mark: MarkConfig = {
  "Type": "type",
  "Shape": "shape",
  "Filled": "filled",
  "Line": "line",
  "Point": "point",
  "Interpolate": "interpolate",
  "Angle": "angle",
  "Orient": "orient",
  "Radius": "radius",
  "Inner radius": "radius2",
  "Size": "size",
  "Align": "align",
  "X offset": "dx",
  "Y offset": "dy",
  "Color": "color",
  "Opacity": "opacity",
  "Stroke dash": "strokeDash",
  "Stroke width": "strokeWidth",
  "Tooltip": "tooltip",
}

// NOTE: Ordering matters.
export const encoding: EncodingConfig = {
  // Important for some marks
  "Text": "text",
  "URL": "url",

  // Basic
  "X": "x",
  "Y": "y",
  "Arc angle": "theta",
  "Latitude": "latitude",
  "Longitude": "longitude",
  "Color": "color",

  // Advanced
  "Size": "size",
  "Opacity": "opacity",
  "Shape": "shape",
  "Stroke dash": "strokeDash",
  "Stroke width": "strokeWidth",
  "Angle": "angle",
  "X 2": "x2",
  "Y 2": "y2",
  "Latitude 2": "latitude2",
  "Longitude 2": "longitude2",
  "Radius": "radius",
  "Radius 2": "radius2",
  "Arc angle 2": "theta2",
  "X offset": "xOffset",
  "Y offset": "yOffset",
  "Detail": "detail",
  //"Tooltip": "tooltip",

  // Faceting
  "Facet": "facet",
  "Column": "column",
  "Row": "row",
}

// NOTE: Ordering matters.
export const channelProperties: ChannelPropertiesConfig = {
  // Basic
  "Field": "field",

  // Data
  "Datum": "datum",
  "Value": "value",
  "Type": "type",

  // Aggregation
  "Aggregate": "aggregate",
  "Bin": "bin",
  "Bin size": "binStep",
  "Max bins": "maxBins",

  // Axis
  "Scale": "scaleType",
  "Palette": "scheme",
  "Domain": "domain",
  "Range": "range",
  "Zero": "zero",
  "Sort": "sort",
  "Stack": "stack",
  "Time unit": "timeUnit",
  "Title": "title",
  "Legend": "legend",
}

// NOTE: Ordering matters.
export const markPropertyValues: MarkPropertyValuesConfig = {
  type: {
    "Point": "point",
    "Line": "line",
    "Area": "area",
    "Bar": "bar",
    "Arc": "arc",
    "Box plot": "boxplot",
    //"Geo shape": "geoshape",
    "Image": "image",
    "Rect": "rect",
    "Rule": "rule",
    "Text": "text",
    "Tick": "tick",
    "Trail": "trail",
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
    "Vertical": null,
    "Horizontal": "horizontal",
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
    "Crosshair": "M-1,0 L1,0 M0,1 L0,-1",  // Special property we added.
    "Chevron": "M-1,0.35 L0,-0.35 L1,0.35",  // Special property we added.
  },

  filled: {
    "Outlined": null,
    "Filled": true,
  },

  tooltip: {
    "Hidden": null,
    "Visible": true,
  },

  line: {
    "Hidden": null,
    "Visible": true,
  },

  align: {
    "Default": null,
    "Left": "left",
    "Center": "center",
    "Right": "right",
  }
}

// NOTE: Ordering matters.
export const channelPropertyValues: ChannelPropertyValuesConfig = {
  type: {
    "Auto": null,
    "Nominal": "nominal",
    "Ordinal": "ordinal",
    "Quantitative": "quantitative",
    "Temporal": "temporal",
    //"GeoJSON": "geojson",
  },

  aggregate: {
    "Off": null,
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

  scaleType: {
    "Auto": null,

    // Continuous - Quantitative
    "Linear": "linear",
    "Log": "log",
    "Exponential": "pow",
    "Square root": "sqrt",
    "Symlog": "symlog",

    "Identity": "identity",
    "Sequential": "sequential",

    // Continuous - Time
    "Time": "time",
    "UTC": "utc",

    // Discretizing scales
    "Quantile": "quantile",
    "Quantize": "quantize",
    "Threshold": "threshold",
    "Bin-ordinal": "bin-ordinal",

    // Discrete scales
    "Ordinal": "ordinal",
    "Point": "point",
    "Band": "band",
  },

  stack: {
    "Auto": null,
    "Stack": true,
    "Stack from center": "center",
    "Normalized": "normalize",
    "Dodge": "mintaka-dodge",  // Special property we added.
    "No stacking": false,
  },

  legend: {
    "Off": false,
    "Top": null,
  },

  sort: {
    "Auto": null,
    "Ascending": "ascending",
    "Descending": "descending",
  },

  bin: {
    "Off": null,
    "On": true,
  },

  zero: {
    "Auto": null,
    "Always visible": true,
    "Not always visible": false,
  },

  scheme: {
    "Auto": null,
    // Categorical Schemes
    "accent": "accent",
    "category10": "category10",
    "category20": "category20",
    "category20b": "category20b",
    "category20c": "category20c",
    "dark2": "dark2",
    "paired": "paired",
    "pastel1": "pastel1",
    "pastel2": "pastel2",
    "set1": "set1",
    "set2": "set2",
    "set3": "set3",
    "tableau10": "tableau10",
    "tableau20": "tableau20",
    // Sequential Single-Hue Schemes
    "blues": "blues",
    "tealblues": "tealblues",
    "teals": "teals",
    "greens": "greens",
    "browns": "browns",
    "oranges": "oranges",
    "reds": "reds",
    "purples": "purples",
    "warmgreys": "warmgreys",
    "greys": "greys",
    // Sequential Multi-Hue Schemes
    "viridis": "viridis",
    "magma": "magma",
    "inferno": "inferno",
    "plasma": "plasma",
    "cividis": "cividis",
    "turbo": "turbo",
    "bluegreen": "bluegreen",
    "bluepurple": "bluepurple",
    "goldgreen": "goldgreen",
    "goldorange": "goldorange",
    "goldred": "goldred",
    "greenblue": "greenblue",
    "orangered": "orangered",
    "purplebluegreen": "purplebluegreen",
    "purpleblue": "purpleblue",
    "purplered": "purplered",
    "redpurple": "redpurple",
    "yellowgreenblue": "yellowgreenblue",
    "yellowgreen": "yellowgreen",
    "yelloworangebrown": "yelloworangebrown",
    "yelloworangered": "yelloworangered",
    // For Dark Backgrounds
    "darkblue": "darkblue",
    "darkgold": "darkgold",
    "darkgreen": "darkgreen",
    "darkmulti": "darkmulti",
    "darkred": "darkred",
    // For Light Backgrounds
    "lightgreyred": "lightgreyred",
    "lightgreyteal": "lightgreyteal",
    "lightmulti": "lightmulti",
    "lightorange": "lightorange",
    "lighttealblue": "lighttealblue",
    // Diverging Schemes
    "blueorange": "blueorange",
    "brownbluegreen": "brownbluegreen",
    "purplegreen": "purplegreen",
    "pinkyellowgreen": "pinkyellowgreen",
    "purpleorange": "purpleorange",
    "redblue": "redblue",
    "redgrey": "redgrey",
    "redyellowblue": "redyellowblue",
    "redyellowgreen": "redyellowgreen",
    "spectral": "spectral",
    // Cyclical Schemes
    "rainbow": "rainbow",
    "sinebow": "sinebow",
  },
}

export function selectMarkProperty(
  name: string,
  layer: LayerState,
  stateValue: StateValue,
): boolean {
  const markType = layer?.mark?.type

  switch (name) {
    case "shape":
      return markType == "point"

    case "filled":
      return markType == "point" && !includes(
        ["stroke", markPropertyValues.shape["Crosshair"]],
        layer?.mark?.shape)

    case "point":
    case "interpolate":
      return includes(["line", "area"], markType)

    case "angle":
      return includes(["text", "image"], markType) ||
        (markType == "point" && !includes(["circle", null, undefined], layer?.mark?.shape))

    case "size":
      return includes(["point", "text", "image"], markType)

    case "radius":
    case "radius2":
      return markType == "arc"

    case "width":
    case "height":
      return markType == "image"

    case "line":
      return markType == "area"

    case "orient":
      return includes(["bar", "line", "area", "boxplot", "rule"], markType)

    case "strokeWidth":
    case "strokeDash":
      return includes(["line", "rule"], markType) ||
        (markType == "area" && layer?.mark?.line == true) ||
        (markType == "point" && (
          !layer?.mark?.filled ||
          includes(
            ["stroke", markPropertyValues.shape["Crosshair"]], layer?.mark?.shape)
        ))

    case "align":
    case "dx":
    case "dy":
      return markType == "text"

    default:
      return true
  }
}

export function selectChannel(
  name: string,
  layer: LayerState,
  stateValue: StateValue,
): boolean {
  const markType = layer?.mark?.type

  switch (name) {
    case "x":
    case "y":
      return !includes(["arc", "geoshape"], markType)

    case "xOffset":
      return includes(["bar", "point"], markType)
        && includes(["ordinal", "nominal"], layer?.encoding?.x?.type)

    case "yOffset":
      return includes(["bar", "point"], markType)
        && includes(["ordinal", "nominal"], layer?.encoding?.y?.type)

    case "x2":
    case "y2":
      return includes(["area", "bar", "rect", "rule"], markType)

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
    // return stateValue.layers.some(
    //   layer => includes(["arc", "geoshape"], layer.mark.type))

    case "text":
      return markType == "text"

    case "url":
      return markType == "image"

    case "size":
      return !includes(["image", "arc"], markType)

    case "geojson":
      return markType == "geoshape"

    case "shape":
      return includes(["point", "line", "area"], markType)

    case "strokeWidth":
    case "strokeDash":
      return includes(["line", "rule"], markType) ||
        (markType == "area" && layer?.mark?.line == true) ||
        (markType == "point" && !layer?.mark?.filled)

    case "angle":
      return includes(["text", "image", "point"], markType)

    case "facet":
    case "row":
    case "column":
      return stateValue.layers.length == 1

    default:
      return true
  }
}

export function selectChannelProperty(
  name: string,
  channelName: ChannelName,
  layer: LayerState,
  stateValue: StateValue,
): boolean {
  const channelState = layer?.encoding?.[channelName] ?? {}

  const fieldIsSet = Array.isArray(channelState.field)
    ? (channelState.field.length > 0 && channelState.field.some(f => f != null))
    : channelState.field != null

  const valueOrDatumIsSet = !fieldIsSet
    && (channelState.value != null || channelState.datum != null)

  const is_color_channel_and_folded_dataset = (channelName == "color") && (
    isArrayWith2PlusElements(layer?.encoding?.x?.field) ||
    isArrayWith2PlusElements(layer?.encoding?.y?.field)
  )

  switch (name) {
    case "field":
      return !is_color_channel_and_folded_dataset && !valueOrDatumIsSet

    case "value":
      return !fieldIsSet && !channelState.datum && !is_color_channel_and_folded_dataset

    case "datum":
      return !fieldIsSet && !channelState.value && !is_color_channel_and_folded_dataset

    case "type":
    case "scaleType":
      return fieldIsSet && !is_color_channel_and_folded_dataset

    case "domain":
      return !is_color_channel_and_folded_dataset

    case "sort":
      return fieldIsSet

    case "title":
      return fieldIsSet && !includes(["theta", "theta2", "radius", "radius2"], channelName)

    case "aggregate":
      return fieldIsSet && !channelState.bin && !is_color_channel_and_folded_dataset

    case "bin":
      return fieldIsSet && channelState.aggregate == null && !is_color_channel_and_folded_dataset

    case "binStep":
      return channelState.bin == true && !channelState.maxBins

    case "maxBins":
      return channelState.bin == true && !channelState.binStep

    case "scheme":
      return channelName == "color"

    case "stack":
      return fieldIsSet && includes(["x", "y", "theta", "radius"], channelName)

    case "legend":
      return fieldIsSet && includes(["color", "size", "opacity", "shape", "strokeDash"], channelName)

    case "timeUnit":
      return fieldIsSet && channelState.type == "temporal"

    case "sortBy":
      return fieldIsSet && includes(["nominal", "ordinal"], channelState.type)

    case "zero":
      return fieldIsSet && !includes(["log", "time", "utc"], channelState.scaleType)

    default:
      return true
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArrayWith2PlusElements(obj: any): boolean {
  if (!obj) return false
  if (!Array.isArray(obj)) return false
  return obj.length > 1
}

export const DEFAULT_CONFIG: Config = {
  modes,
  mark,
  encoding,
  markPropertyValues,
  channelProperties,
  channelPropertyValues,
  selectMarkProperty,
  selectChannel,
  selectChannelProperty,
}
