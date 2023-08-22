import { isElementOf } from "./array.ts"

// For these constants, order matters! This is the order they'll appear in the UI.
// (string keys in JS Objects are guaranteed to be ordered by insertion order)

export const RANDOM_FIELD_NAME = "vlcb--random-values"

export const CONFIG = {
  modes: {
    "Base": {
      presets: true,
      //mark: false,
      encoding: ["basic"],
      channelProperties: ["basic"],
      else: false,
      alwaysShowNonNull: true,
    },
    "Agg": {
      presets: false,
      //mark: true,
      encoding: ["basic"],
      channelProperties: ["aggregation"],
      else: false,
    },
    "Axis": {
      presets: false,
      //mark: true,
      encoding: ["basic"],
      channelProperties: ["axes"],
      else: false,
    },
    "Mark": {
      //presets: false,
      mark: ["advanced"],
      //encoding: false,
      //channelProperties: false,
      else: false,
    },
    "Adv": {
      presets: false,
      //mark: true,
      //encoding: true,
      //channelProperties: true,
      else: true,
    },
  },

  mark: {
    // Format:
    //   [groupName]: {
    //     [propertyName]: { label: propertyLabel },
    //   }

    basic: {
      type: { label: "Type" },
    },

    advanced: {
      shape: { label: "Shape" },
      filled: { label: "Filled" },
      line: { label: "Line" },
      point: { label: "Point" },
      interpolate: { label: "Interpolate" },
      angle: { label: "Angle" },
      orient: { label: "Orient" },
      radius: { label: "Radius" },
      radius2: { label: "Inner radius" },
      size: { label: "Size" },
      opacity: { label: "Opacity" },
      tooltip: { label: "Tooltip" },
    },
  },

  encoding: {
    // Format:
    //   [groupName]: {
    //     [propertyName]: { label: propertyLabel },
    //   }

    requiredForSomeMarks: {
      text: { label: "Text" },
      url: { label: "URL" },
    },

    basic: {
      x: { label: "X" },
      y: { label: "Y" },
      theta: { label: "Arc angle" },
      latitude: { label: "Latitude" },
      longitude: { label: "Longitude" },
      color: { label: "Color" },
    },

    advanced: {
      size: { label: "Size" },
      opacity: { label: "Opacity" },
      shape: { label: "Shape" },
      strokeDash: { label: "Dash" },
      angle: { label: "Angle" },
      x2: { label: "X 2" },
      y2: { label: "Y 2" },
      latitude2: { label: "Latitude 2" },
      longitude2: { label: "Longitude 2" },
      radius: { label: "Radius" },
      radius2: { label: "Radius 2" },
      theta2: { label: "Arc angle 2" },
      xOffset: { label: "X offset" },
      yOffset: { label: "Y offset" },
      // strokeWidth
      // detail
      // tooltip
    },

    faceting: {
      facet: { label: "Facet" },
      column: { label: "Column" },
      row: { label: "Row" },
    },
  },

  channelProperties: {
    // Format:
    //   [groupName]: {
    //     [propertyName]: { label: propertyLabel },
    //   }

    basic: {
      field: { label: "Field" }
    },

    data: {
      datum: { label: "Datum" },
      value: { label: "Value" },
      type: { label: "Type" },
    },

    aggregation: {
      aggregate: { label: "Aggregate" },
      bin: { label: "Bin" },
      binStep: { label: "Bin size" },
      maxBins: { label: "Max bins" },
    },

    axes: {
      scaleType: { label: "Scale" },
      scheme: { label: "Palette" },
      domain: { label: "Domain" },
      range: { label: "Range" },
      zero: { label: "Show zero" },
      sort: { label: "Sort" },
      stack: { label: "Stack" },
      timeUnit: { label: "Time unit" },
      title: { label: "Title" },
      legend: { label: "Legend" },
    },
  },

  markPropertyValues: {
    // Format:
    //   [propertyName]: {
    //     [valueLabel]: value,
    //   }

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
  },

  channelPropertyValues: {
    // Format:
    //   [propertyName]: {
    //     [valueLabel]: value,
    //   }

    type: {
      "Auto": null,
      "Nominal": "nominal",
      "Ordinal": "ordinal",
      "Quantitative": "quantitative",
      "Temporal": "temporal",
      //"GeoJSON": "geojson",
    },

    aggregate: {
      "": null,
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
      "": null,
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
      "No stacking": false,
    },

    legend: {
      "Off": false,
      "Top": null,
    },

    sort: {
      "": null,
      "Ascending": "ascending",
      "Descending": "descending",
    },

    bin: {
      "Off": null,
      "On": true,
      "Already binned": "binned",
    },

    zero: {
      "Auto": null,
      "Always": true,
      "Avoid": false,
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
  },

  selectMarkProperty(name, state) {
    const markType = state?.mark?.type

    switch (name) {
      case "shape":
      case "filled":
        return markType == "point"

      case "point":
      case "interpolate":
        return isElementOf(markType, ["line", "area"])

      case "angle":
        return isElementOf(markType, ["text", "image", "point"])

      case "size":
        return isElementOf(markType, ["point", "text", "image"])

      case "radius":
      case "radius2":
        return markType == "arc"

      case "width":
      case "height":
        return markType == "image"

      case "line":
        return markType == "area"

      case "orient":
        return isElementOf(markType, ["bar", "line", "area", "boxPlot"])

      default:
        return true
    }
  },

  selectChannel(name, state) {
    const markType = state?.mark?.type

    switch (name) {
      case "x":
      case "y":
        return !isElementOf(markType, ["arc", "geoshape"])

      case "xOffset":
        return isElementOf(markType, ["bar", "point"])
          && isElementOf(state?.encoding?.x?.type, ["ordinal", "nominal"])

      case "yOffset":
        return isElementOf(markType, ["bar", "point"])
          && isElementOf(state?.encoding?.y?.type, ["ordinal", "nominal"])

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

      case "shape":
        return isElementOf(markType, ["point", "line", "area"])

      case "strokeDash":
        return isElementOf(markType, ["line", "area"])

      case "angle":
        return isElementOf(markType, ["text", "image", "point"])

      default:
        return true
    }
  },

  selectChannelProperty(name, channelName, state): boolean {
    const channelState = state?.encoding?.[channelName] ?? {}
    const fieldIsSet = Array.isArray(channelState.field)
      ? (channelState.field.length > 0 && channelState.field.some(f => f != null))
      : channelState.field != null

    const is_color_channel_in_folded_dataset = (channelName == "color") && (
        (Array.isArray(state?.encoding?.x?.field) && state.encoding.x.field.length > 1) ||
        (Array.isArray(state?.encoding?.y?.field) && state.encoding.y.field.length > 1)
    )

    switch (name) {
      case "field":
        return !is_color_channel_in_folded_dataset

      case "value":
        return !fieldIsSet && !channelState.datum && !is_color_channel_in_folded_dataset

      case "datum":
        return !fieldIsSet && !channelState.value && !is_color_channel_in_folded_dataset

      case "type":
      case "scaleType":
        return fieldIsSet && !is_color_channel_in_folded_dataset

      case "domain":
        return !is_color_channel_in_folded_dataset

      case "sort":
        return fieldIsSet

      case "title":
        return fieldIsSet && !isElementOf(channelName, ["theta", "theta2", "radius", "radius2"])

      case "aggregate":
        return fieldIsSet && !channelState.bin && !is_color_channel_in_folded_dataset

      case "bin":
        return fieldIsSet && channelState.aggregate == null && !is_color_channel_in_folded_dataset

      case "binStep":
        return channelState.bin == true && !channelState.maxBins

      case "maxBins":
        return channelState.bin == true && !channelState.binStep

      case "scheme":
        return channelName == "color"

      case "stack":
        return fieldIsSet && isElementOf(channelName, ["x", "y", "theta", "radius"])

      case "legend":
        return fieldIsSet && isElementOf(channelName, ["color", "size", "opacity", "shape", "strokeDash"])

      case "timeUnit":
        return fieldIsSet && channelState.type == "temporal"

      case "sortBy":
        return fieldIsSet && isElementOf(channelState.type, ["nominal", "ordinal"])

      case "zero":
        return fieldIsSet && !isElementOf(channelState.scaleType, ["log", "time", "utc"])

      default:
        return true
    }
  },
}

export const UI_EXTRAS = {
  xOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
  yOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
}
