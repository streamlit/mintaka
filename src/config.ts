import { isElementOf } from "./array.ts"

// For these constants, order matters! This is the order they'll appear in the UI.
// (string keys in JS Objects are guaranteed to be ordered by insertion order)

export const PRESETS = {
  "Scatter plot": {
    mark: {
      type: "point",
      filled: true,
      tooltip: true,
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
    },
    ifColumn: {
      C1: {
        encoding: {
          color: { field: "C1" },
          size: { field: "C2" },
        }
      },
      C2: {
        encoding: {
          color: { field: "C2" },
          size: { field: "D" },
        }
      },
    }
  },

  "Line chart": {
    mark: {
      type: "line",
      tooltip: true,
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
      tooltip: true,
    },
    findColumns: {
      A: { type: ["quantitative", null] },
      B1: { type: ["quantitative"] },
      B2: { type: [null] },
      C: { type: ["nominal", "ordinal"], maxUnique: 10 },
    },
    encoding: {
      x: { field: "A" },
      opacity: { value: 0.75 },
    },
    ifColumn: {
      B1: { encoding: { y: { field: "B1", aggregate: "mean", stack: false } } },
      B2: { encoding: { y: { field: "B2", stack: false } } },
      C: { encoding: { color: { field: "C" } } },
    },
  },

  "Stacked area chart": {
    mark: {
      type: "area",
      tooltip: true,
    },
    findColumns: {
      A: { type: ["quantitative", null] },
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

  "Bar chart": {
    mark: {
      type: "bar",
      tooltip: true,
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

  "Horizontal bar chart": {
    mark: {
      type: "bar",
      tooltip: true,
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
          x: { field: "A1", aggregate: "count", stack: false },
          y: { field: "A1", bin: true },
        },
      },
      A2: {
        encoding: {
          x: { field: "A2", aggregate: "count", stack: false },
          y: { field: "A2", type: "nominal", sort: "ascending" },
        },
      },
      C1: {
        encoding: {
          color: { field: "C1", bin: null },
          yOffset: { field: "C1", bin: null },
        },
      },
      C2: {
        encoding: {
          color: { field: "C2", bin: true },
          yOffset: { field: "C2", bin: true }
        },
      },
    }
  },

  "Stacked bar chart": {
    mark: {
      type: "bar",
      tooltip: true,
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
      tooltip: true,
    },
    findColumns: {
      A1: { type: ["quantitative", null] },
      B1: { type: ["nominal", "ordinal"], maxUnique: 20 },
      A2: {},
      B2: {},
    },
    ifColumn: {
      A1: {
        encoding: {
          theta: { field: "A1", aggregate: "sum" },
        }
      },
      B1: {
        encoding: {
          color: { field: "B1", bin: null },
        }
      },
      A2: {
        encoding: {
          theta: { field: "A2", aggregate: "count" },
        }
      },
      B2: {
        encoding: {
          color: { field: "B2", bin: true },
        }
      },
    }
  },

  "Ring chart": {
    mark: {
      type: "arc",
      radius2: { expr: "min(containerSize()[0], containerSize()[1]) / 3" },
      tooltip: true,
    },
    findColumns: {
      A1: { type: ["quantitative", null] },
      B1: { type: ["nominal", "ordinal"], maxUnique: 20 },
      A2: {},
      B2: {},
    },
    ifColumn: {
      A1: {
        encoding: {
          theta: { field: "A1", aggregate: "sum" },
        }
      },
      B1: {
        encoding: {
          color: { field: "B1", bin: null },
        }
      },
      A2: {
        encoding: {
          theta: { field: "A2", aggregate: "count" },
        }
      },
      B2: {
        encoding: {
          color: { field: "B2", bin: true },
        }
      },
    }
  },

  "Heat map": {
    mark: {
      type: "rect",
      tooltip: true,
    },
    findColumns: {
      A: {},
      B: {},
    },
    encoding: {
      x: { field: "A", bin: true },
      y: { field: "B" , bin: true },
      color: { field: "A" , aggregate: "count" },
    },
  },
}

export const AUTO_FIELD = Symbol("AUTO_FIELD")

export const CONFIG = {
  mark: {
    // Format:
    //   [groupName]: {
    //     [propertyName]: { label: propertyLabel },
    //   }

    basic: {
      type: { label: "Type" },
    },

    advanced: {
      angle: { label: "Angle" },
      filled: { label: "Filled" },
      interpolate: { label: "Interpolate" },
      line: { label: "Line" },
      orient: { label: "Orient" },
      point: { label: "Point" },
      radius2: { label: "Inner radius" },
      radius: { label: "Radius" },
      shape: { label: "Shape" },
      size: { label: "Size" },
      tooltip: { label: "Tooltip" },
    },
  },

  encoding: {
    // Format:
    //   [groupName]: {
    //     [propertyName]: { label: propertyLabel },
    //   }

    basic: {
      text: { label: "Text" },
      url: { label: "URL" },
      x: { label: "X" },
      y: { label: "Y" },
      theta: { label: "Theta" },
      latitude: { label: "Latitude" },
      longitude: { label: "Longitude" },
      color: { label: "Color" },
      size: { label: "Size" },
    },

    advanced: {
      opacity: { label: "Opacity" },
      shape: { label: "Shape" },
      angle: { label: "Angle" },
      x2: { label: "X2" },
      y2: { label: "Y2" },
      latitude2: { label: "Latitude2" },
      longitude2: { label: "Longitude2" },
      radius: { label: "Radius" },
      radius2: { label: "Radius2" },
      theta2: { label: "Theta2" },
      xOffset: { label: "X offset" },
      yOffset: { label: "Y offset" },
      // angle
      // strokeWidth, strokeDash
      // shape
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
      field: {
        label: "Field",
        widgetHint({ parentName }) {
          if (parentName == "y") return "multiselect"
          return "select"
        },
      },
    },

    advanced: {
      value: { label: "Value" },
      type: { label: "Type" },
      aggregate: { label: "Aggregate" },
      bin: { label: "Bin" },
      binStep: { label: "Bin size" },
      legend: { label: "Legend" },
      sort: { label: "Sort" },
      stack: { label: "Stack" },
      timeUnit: { label: "Time unit"},
      title: { label: "Title" },
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
      "Geo shape": "geoshape",
      "Image": "image",
      "Rect": "rect",
      "Rule": "rule",
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
      "Auto": AUTO_FIELD,
      "Nominal": "nominal",
      "Ordinal": "ordinal",
      "Quantitative": "quantitative",
      "Temporal": "temporal",
      "GeoJSON": "geojson",
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
      "": null,
      "Ascending": "ascending",
      "Descending": "descending",
    },

    bin: {
      "Off": null,
      "On": true,
    },
  },

  selectMarkProperty(name, state) {
    const markType = state.mark.type

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

      case "angle":
        return isElementOf(markType, ["text", "image", "point"])

      default:
        return true
    }
  },

  selectChannelProperty(name, channel, state): boolean
  {
    const fieldIsSet = Array.isArray(state.field)
      ? state.field.length > 0
      : state.field != null

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
  },
}

export const RANDOM_FIELD_NAME = "vlcb--random-values"

export const UI_EXTRAS = {
  xOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
  yOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
}

