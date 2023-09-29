import { Presets } from "./types"

export const PRESETS: Presets = {
  "Scatter": {
    mark: {
      type: "point",
      tooltip: true,
    },
    findColumns: {
      A: {},
      B: {},
      C: {},
    },
    encoding: {
      x: { field: "A" },
      y: { field: "B" },
      color: { field: "C" },
    },
  },

  "Line": {
    mark: {
      type: "line",
      tooltip: true,
    },
    findColumns: {
      A: {},
      B: {},
    },
    encoding: {
      x: { field: "A" },
      y: { field: "B" },
    },
  },

  "Bar": {
    mark: {
      type: "bar",
      tooltip: true,
    },
    findColumns: {
      A: {},
      B: { type: [ 'nominal'] },
    },
    encoding: {
      x: { field: "A" },
      y: { field: "A", aggregate: "count", stack: false },
    },
    ifColumn: {
      "B": {
        encoding: { color: { field: "B" } },
      },
    }
  },
}
