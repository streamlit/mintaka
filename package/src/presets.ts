import { Presets } from "./types"

export const PRESETS: Presets = {
  "Default": {
    mark: {
      type: "point",
      tooltip: true,
    },
    findColumns: {
      A: { type: [null] },
      B: { type: [null] },
      C1: { type: ["nominal", "ordinal"], maxUnique: 10 },
      C2: { type: ["quantitative", null] },
    },
    encoding: {
      x: { field: "A", zero: false },
      y: { field: "B", zero: false },
    },
    ifColumn: {
      C1: {
        encoding: {
          color: { field: "C1" },
        }
      },
      C2: {
        encoding: {
          color: { field: "C2" },
        }
      },
    },
  },
}
