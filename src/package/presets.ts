import { Presets } from "./types"

export const PRESETS: Presets = {
  "Scatter plot": {
    mark: {
      type: "point",
      filled: true,
      tooltip: true,
      size: 100,
      opacity: 0.5,
    },
    findColumns: {
      A: { type: ["quantitative", null] },
      B: { type: ["quantitative", null] },
      C1: { type: ["nominal", "ordinal"], maxUnique: 10 },
      C2: { type: ["quantitative", null] },
    },
    encoding: {
      x: { field: "A", scale: { zero: false } },
      y: { field: "B", scale: { zero: false } },
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
    }
  },

  "Line chart": {
    mark: {
      type: "line",
      tooltip: true,
    },
    findColumns: {
      A: { type: ["quantitative", "temporal", null] },
      B: { type: ["quantitative", null] },
      C: { type: ["nominal", "ordinal"], maxUnique: 10 },
    },
    encoding: {
      x: { field: "A" },
      y: { field: "B" },
      color: { field: "C" },
    },
  },

  "Area chart": {
    mark: {
      type: "area",
      tooltip: true,
    },
    findColumns: {
      A: { type: ["quantitative", null] },
      B: { type: ["quantitative", null] },
      C: { type: ["nominal", "ordinal"], maxUnique: 10 },
    },
    encoding: {
      x: { field: "A" },
      y: { field: "B", stack: false },
      color: { field: "C" },
      opacity: { value: 0.75 },
    },
  },

  "Stacked area chart": {
    mark: {
      type: "area",
      tooltip: true,
    },
    findColumns: {
      A: { type: ["quantitative", null] },
      B: { type: ["quantitative", null] },
      C: { type: ["nominal", "ordinal"], maxUnique: 10 },
    },
    encoding: {
      x: { field: "A" },
      y: { field: "B", aggregate: "max", stack: true },
      color: { field: "C" },
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
        },
      },
      C2: {
        encoding: {
          color: { field: "C2", bin: true },
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
      C: { type: ["quantitative"] },
    },
    encoding: {
      x: { field: "A", bin: true },
      y: { field: "B" , bin: true },
      color: { field: "A" , aggregate: "count" },
    },
    ifColumn: {
      C: {
        encoding: { color: { field: "C", aggregate: "sum" } },
      },
    },
  },
}


