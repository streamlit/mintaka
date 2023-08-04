import { isElementOf } from "./array.ts"

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

export const PRESETS = {
  "Scatter plot": {
    mark: {
      type: "point",
      filled: true,
    },
    findColumns: {
      A: { type: ["quantitative", null] },
      B: { type: ["quantitative", null] },
      C1: { type: ["nominal", "ordinal"], maxUnique: 10 },
      C2: { type: ["quantitative", null] },
      D: { type: ["quantitative", null] },
    },
    encoding: {
      x: { field: "A", scale: { zero: false } },
      y: { field: "B", scale: { zero: false } },
      size: { field: "D" },
    },
    ifColumn: {
      C1: { encoding: { color: { field: "C1" } } },
      C2: { encoding: { color: { field: "C2" } } },
    }
  },

  "Line chart": {
    mark: {
      type: "line",
    },
    findColumns: {
      A: { type: ["quantitative", "temporal", null] },
      B1: { type: ["quantitative"] },
      B2: { type: [null] },
      C: { type: ["nominal", "ordinal"], maxUnique: 10 },
    },
    encoding: {
      x: { field: "A" },
    },
    ifColumn: {
      B1: { encoding: { y: { field: "B1", aggregate: "mean" } } },
      B2: { encoding: { y: { field: "B2" } } },
      C: { encoding: { color: { field: "C" } } },
    },
  },

  "Area chart": {
    mark: {
      type: "area",
    },
    findColumns: {
      A: { type: ["quantitative", null] },
      B1: { type: ["quantitative"] },
      B2: { type: [null] },
      C: { type: ["nominal", "ordinal"], maxUnique: 10 },
    },
    encoding: {
      x: { field: "A" },
      opacity: { value: 0.7 },
    },
    ifColumn: {
      B1: { encoding: { y: { field: "B1", aggregate: "mean", stack: false } } },
      B2: { encoding: { y: { field: "B2", stack: false } } },
      C: { encoding: { color: { field: "C" } } },
    },
  },

  "Bar chart": {
    mark: {
      type: "bar",
    },
    findColumns: {
      A1: { type: ["quantitative"] },
      C1: { type: ["nominal", "ordinal"], maxUnique: 10 },
      A2: {},
      C2: {},
    },
    encoding: {
    },
    ifColumn: {
      A1: {
        encoding: {
          x: { field: "A1", bin: true },
          y: { field: "A1", aggregate: "count", stack: false },
        },
      },
      A2: {
        encoding: {
          x: { field: "A2", type: "nominal", sort: "ascending" },
          y: { field: "A2", aggregate: "count", stack: false },
        },
      },
      C1: {
        encoding: {
          color: { field: "C1", bin: null },
          xOffset: { field: "C1", bin: null },
        },
      },
      C2: {
        encoding: {
          color: { field: "C2", bin: true },
          xOffset: { field: "C2", bin: true }
        },
      },
    }
  },

  "Stacked bar chart": {
    mark: {
      type: "bar",
    },
    findColumns: {
      A1: { type: ["quantitative"] },
      C1: { type: ["nominal", "ordinal"], maxUnique: 10 },
      A2: {},
      C2: {},
    },
    encoding: {
    },
    ifColumn: {
      A1: {
        encoding: {
          y: { field: "A1", aggregate: "count" },
          x: { field: "A1", bin: true },
        },
      },
      A2: {
        encoding: {
          x: { field: "A2", type: "nominal", sort: "ascending" },
          y: { field: "A2", aggregate: "count" },
        },
      },
      C1: {
        encoding: { color: { field: "C1", bin: null } },
      },
      C2: {
        encoding: { color: { field: "C2", bin: true } },
      },
    }
  },

  "Pie chart": {
    mark: {
      type: "arc",
    },
    findColumns: {
      A: { type: ["quantitative", null] },
      B1: { type: ["nominal", "ordinal"], maxUnique: 20 },
      B2: {},
    },
    encoding: {
      theta: { field: "A", aggregate: "count" },
    },
    ifColumn: {
      B1: {
        encoding: {
          color: { field: "B1", bin: null },
        }
      },
      B2: {
        encoding: {
          color: { field: "B2", bin: true },
        }
      },
    }
  },
}

export const WIDGETS = {
  mark: {
    basic: {
      type: { label: "Type" },
    },
    advanced: {
      line: { label: "Line" },
      point: { label: "Point" },
      interpolate: { label: "Interpolate" },
      orient: { label: "Orient" },
      shape: { label: "Shape" },
      filled: { label: "Filled" },
      angle: { label: "Angle" },
      size: { label: "Size" },
      // width: { label: "Width" },
      // height: { label: "Height" },
      // strokeWidth: { label: "strokeWidth" },
      // strokeDash: { label: "strokeDash" },
      // href: { label: "Href" },
    },
  },

  encoding: {
    basic: {
      text: { label: "Text" },
      url: { label: "URL" },
      x: { label: "X" },
      y: { label: "Y" },
      theta: { label: "Theta" },
      latitude: { label: "Latitude" },
      longitude: { label: "Longitude" },
      color: { label: "Color" },
    },

    advanced: {
      x2: { label: "X2" },
      y2: { label: "Y2" },
      theta2: { label: "Theta2" },
      radius: { label: "Radius" },
      radius2: { label: "Radius2" },
      latitude2: { label: "Latitude2" },
      longitude2: { label: "Longitude2" },
      size: { label: "Size" },
      opacity: { label: "Opacity" },
      facet: { label: "Facet" },
      row: { label: "Row" },
      column: { label: "Column" },
      xOffset: { label: "X offset" },
      yOffset: { label: "Y offset" },
      // angle
      // strokeWidth, strokeDash
      // shape
      // tooltip
    },
  },

  channelProperties: {
    basic: {
      field: { label: "Field" },
    },
    advanced: {
      value: { label: "Value" },
      type: { label: "Type" },
      sort: { label: "Sort" },
      aggregate: { label: "Aggregate" },
      bin: { label: "Bin" },
      binStep: { label: "Bin size" },
      stack: { label: "Stack" },
      timeUnit: { label: "Time unit"},
      title: { label: "Title" },
      legend: { label: "Legend" },
    },
  },
}

export const AUTO_FIELD = "__null__"

export const FIELD_TYPES = {
  [AUTO_FIELD]: "Auto",
  nominal: "Nominal",
  ordinal: "Ordinal",
  quantitative: "Quantitative",
  temporal: "Temporal",
  geojson: "GeoJSON",
}

export const MARK_PROPERTY_VALUES = {
  type: {
    "Point": "point",
    "Line": "line",
    "Area": "area",
    "Bar": "bar",
    "Arc": "arc",
    "Box plot": "boxplot",
    "Circle": "circle",
    "Geo shape": "geoshape",
    "Image": "image",
    "Rect": "rect",
    "Rule": "rule",
    "Square": "square",
    "Text": "text",
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

  line: {
    "Hidden": null,
    "Visible": true,
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

  sort: {
    "None": null,
    "Ascending": "ascending",
    "Descending": "descending",
  },

  bin: {
    "Off": null,
    "On": true,
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
    case "size":
      return isElementOf(markType, ["point", "text", "image"])

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

    case "sort":
    case "type":
      return fieldIsSet

    case "title":
      return fieldIsSet && !isElementOf(channel, ["theta", "theta2", "radius", "radius2"])

    case "aggregate":
      return fieldIsSet && !state.bin

    case "bin":
      return fieldIsSet && state.aggregate == null

    case "binStep":
      return state.bin

    case "stack":
      return fieldIsSet && isElementOf(channel, ["x", "y"])

    case "legend":
      return fieldIsSet && isElementOf(channel, ["color", "size", "opacity"])

    case "timeUnit":
      return fieldIsSet && state.type == "temporal"

    case "sortBy":
      return fieldIsSet && isElementOf(state.type, ["nominal", "ordinal"])

    default:
      return true
  }
}
