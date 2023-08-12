import { isElementOf } from "./array.ts"

// For these constants, order matters! This is the order they'll appear in the UI.
// (string keys in JS Objects are guaranteed to be ordered by insertion order)

export const RANDOM_FIELD_NAME = "vlcb--random-values"

export const CONFIG = {
  modes: {
    "Basic": {
      exclude: ['mark', 'requiredForSomeMarks', 'advanced', 'faceting'],
    },
    "Advanced": {
      exclude: ['presets'],
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
      theta: { label: "Theta" },
      latitude: { label: "Latitude" },
      longitude: { label: "Longitude" },
      color: { label: "Color" },
    },

    advanced: {
      size: { label: "Size" },
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
      maxBins: { label: "Max bins" },
      sort: { label: "Sort" },
      stack: { label: "Stack" },
      timeUnit: { label: "Time unit"},
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
      "Auto": null,
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

      case "color":
        return (!Array.isArray(state?.encoding?.x?.field) || state?.encoding?.x?.field.length <= 1)
           && (!Array.isArray(state?.encoding?.y?.field) || state?.encoding?.y?.field.length <= 1)

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
        return state.bin == true && !state.maxBins

      case "maxBins":
        return state.bin == true && !state.binStep

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

export const UI_EXTRAS = {
  xOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
  yOffset: {
    extraCols: {"Random jitter": RANDOM_FIELD_NAME},
  },
}
