import { Presets } from "./types/index.ts"

export const PRESETS: Presets = {
  "Scatter": {
    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    mark: {
      type: "point",
      tooltip: true,
    },

    encoding: {
      x: { zero: false },
      y: { zero: false },
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

  "Line": {
    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    mark: {
      type: "line",
      tooltip: true,
    },

    encoding: {},

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

  "Bar": {
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
}
