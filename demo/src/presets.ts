import { Presets } from "mintaka";

export const PRESETS: Presets = {
  "Scatter plot": {
    mark: {
      type: "point",
      filled: true,
      tooltip: true,
      size: 100,
      opacity: 0.5,
    },

    encoding: {
      x: { zero: false },
      y: { zero: false },
    },

    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    ifColumn: {
      xCol: {
        encoding: { x: { field: "xCol" } }
      },
      yCol: {
        encoding: { y: { field: "yCol" } }
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    },
  },

  "Line chart": {
    mark: {
      type: "line",
      tooltip: true,
    },

    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    ifColumn: {
      xCol: {
        encoding: { x: { field: "xCol" } }
      },
      yCol: {
        encoding: { y: { field: "yCol" } }
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    },
  },

  "Area chart": {
    mark: {
      type: "area",
      tooltip: true,
    },

    encoding: {
      y: { stack: false },
    },

    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    ifColumn: {
      xCol: {
        encoding: { x: { field: "xCol" } }
      },
      yCol: {
        encoding: { y: { field: "yCol" } }
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    },
  },

  "Stacked area chart": {
    mark: {
      type: "area",
      tooltip: true,
    },

    encoding: {
      y: { stack: true },
    },

    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    ifColumn: {
      xCol: {
        encoding: { x: { field: "xCol" } }
      },
      yCol: {
        encoding: { y: { field: "yCol" } }
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    },
  },

  "Bar chart": {
    findColumns: {
      xNom: { type: ["nominal", "ordinal"] },
      xQuant: { type: ["quantitative"] },
      colorCol: { type: ["nominal", "ordinal"], maxUnique: 20 },
    },

    mark: {
      type: "bar",
      tooltip: true,
    },

    encoding: {
      y: { stack: false },
    },

    ifColumn: {
      xQuant: {
        encoding: {
          x: { field: "xQuant" },
          y: { field: "xQuant", aggregate: "sum" },
        },
      },
      xNom: {
        encoding: {
          x: { field: "xNom" },
          y: { field: "xNom", aggregate: "count" },
        },
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    }
  },

  "Horizontal bar chart": {
    findColumns: {
      yNom: { type: ["nominal", "ordinal"] },
      yQuant: { type: ["quantitative"] },
      colorCol: { type: ["nominal", "ordinal"], maxUnique: 20 },
    },

    mark: {
      type: "bar",
      tooltip: true,
    },

    encoding: {
      x: { stack: false },
    },

    ifColumn: {
      yQuant: {
        encoding: {
          y: { field: "yQuant" },
          x: { field: "yQuant", aggregate: "sum" },
        },
      },
      yNom: {
        encoding: {
          y: { field: "yNom" },
          x: { field: "yNom", aggregate: "count" },
        },
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    }
  },

  "Stacked bar chart": {
    findColumns: {
      xNom: { type: ["nominal", "ordinal"] },
      xQuant: { type: ["quantitative"] },
      colorCol: { type: ["nominal", "ordinal"], maxUnique: 20 },
    },

    mark: {
      type: "bar",
      tooltip: true,
    },

    encoding: {
      y: { stack: true },
    },

    ifColumn: {
      xQuant: {
        encoding: {
          x: { field: "xQuant" },
          y: { field: "xQuant", aggregate: "sum" },
        },
      },
      xNom: {
        encoding: {
          x: { field: "xNom" },
          y: { field: "xNom", aggregate: "count" },
        },
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    }
  },

  "Pie chart": {
    mark: {
      type: "arc",
      tooltip: true,
    },

    encoding: {},

    findColumns: {
      thetaQuant: { type: ["quantitative"] },
      colorNom: { type: ["nominal", "ordinal"], maxUnique: 20 },
      thetaNom: { type: ["nominal", "ordinal"] },
      colorQuant: { type: ["quantitative"] },
    },

    ifColumn: {
      thetaNom: {
        encoding: {
          theta: { field: "thetaNom", aggregate: "count" },
        }
      },
      colorQuant: {
        encoding: {
          color: { field: "colorQuant", bin: true },
        }
      },
      thetaQuant: {
        encoding: {
          theta: { field: "thetaQuant", aggregate: "sum" },
        }
      },
      colorNom: {
        encoding: {
          color: { field: "colorNom", bin: null },
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

    encoding: {},

    findColumns: {
      thetaQuant: { type: ["quantitative"] },
      colorNom: { type: ["nominal", "ordinal"], maxUnique: 20 },
      thetaNom: { type: ["nominal", "ordinal"] },
      colorQuant: { type: ["quantitative"] },
    },

    ifColumn: {
      thetaNom: {
        encoding: {
          theta: { field: "thetaNom", aggregate: "count" },
        }
      },
      colorQuant: {
        encoding: {
          color: { field: "colorQuant", bin: true },
        }
      },
      thetaQuant: {
        encoding: {
          theta: { field: "thetaQuant", aggregate: "sum" },
        }
      },
      colorNom: {
        encoding: {
          color: { field: "colorNom", bin: null },
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
      xNom: { type: ["nominal", "ordinal"] },
      yNom: { type: ["nominal", "ordinal"] },
      xAny: {},
      yAny: {},
      colorCol: { type: ["quantitative"] },
    },

    encoding: {},

    ifColumn: {
      xAny: {
        encoding: {
          x: { field: "xAny", bin: true },
          color: { field: "xAny" , aggregate: "count" },
        },
      },

      yAny: {
        encoding: {
          y: { field: "yAny" , bin: true },
        },
      },

      xNom: {
        encoding: {
          x: { field: "xNom", bin: null },
          color: { field: "xNom", aggregate: "count" },
        },
      },

      yNom: {
        encoding: { y: { field: "yNom", bin: null } }
      },

      colorCol: {
        encoding: { color: { field: "colorCol", aggregate: "sum" } },
      },
    },
  },
}
