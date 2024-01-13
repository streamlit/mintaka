import { describe, expect, test } from "vitest"

import { generateVegaSpec } from "./vegaBuilder.ts"

const trivialColumnTypes = {}
const trivialConfig = {
  selectMarkProperty: () => true,
  selectChannel: () => true,
  selectChannelProperty: () => true,
}
const trivialBaseSpec = {}

describe("generateVegaSpec", () => {
  test("empty", () => {
    const state = {
      layers: [{
        mark: {},
        encoding: {},
      }],
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        encoding: {},
        mark: {},
      }],
    })
  })

  test("simple state gets converted to vega", () => {
    const state = {
      layers: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
        },
      }],
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
        },
      }],
    })
  })

  test("ability to filter properties", () => {
    const state = {
      layers: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
        },
      }],
    }
    const config = {
      selectMarkProperty: (v) => v != "point",
      selectChannel: (v) => v != "y",
      selectChannelProperty: (v) => v != "type",
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, config, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          type: "area",
        },
        encoding: {
          x: { field: "foo" },
        },
      }],
    })
  })

  test("ability to grab column type from columnTypes", () => {
    const state = {
      layers: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo" },
          y: { field: "bar" },
        },
      }],
    }
    const columnTypes = {
      foo: { type: "temporal" },
      bar: { type: "ordinal" },
    }
    const out = generateVegaSpec(
      state, columnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "temporal" },
          y: { field: "bar", type: "ordinal" },
        },
      }],
    })
  })

  test("ability to provide defaults with baseSpec", () => {
    const state = {
      layers: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
        },
      }],
    }
    const baseSpec = {
      data: {
        name: "baz",
      },
      layer: [{
        mark: {
          point: false,
          tooltip: true,
        },
      }],
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, baseSpec)

    expect(out).toEqual({
      data: {
        name: "baz",
      },
      layer: [{
        mark: {
          type: "area",
          point: true,
          tooltip: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
        },
      }],
    })
  })

  test("ability to fold fields", () => {
    const state = {
      layers: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: ["bar", "baz", "boz"], type: "nominal" },
        },
      }],
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: {
            field: "foo",
            type: "quantitative",
          },
          y: {
            field: "mtk--folded-values-y",
            title: "value",
            type: "nominal",
          },
          color: {
            field: "mtk--folded-keys-y",
            title: "color",
            type: "nominal",
          },
        },
      }],
      transform: [{
        as: ["mtk--folded-keys-y", "mtk--folded-values-y"],
        fold: ["bar", "baz", "boz"],
      }],
    })
  })

  test("ability to stack bar charts side-by-side", () => {
    const state = {
      layers: [{
        mark: {
          type: "bar",
        },
        encoding: {
          x: { field: "foo", type: "nominal" },
          y: { field: "bar", type: "quantitative", stack: "mintaka-dodge" },
          color: { field: "baz", type: "nominal" },
        },
      }],
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          type: "bar",
        },
        encoding: {
          x: {
            field: "foo",
            type: "nominal",
          },
          y: {
            field: "bar",
            type: "quantitative",
            stack: false,
          },
          color: {
            field: "baz",
            type: "nominal",
          },
          xOffset: {
            field: "baz",
          },
        },
      }],
    })
  })

  test("fix chart size if faceting", () => {
    const state = {
      layers: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
          facet: { field: "baz", type: "nominal" },
        },
      }],
    }
    const baseSpec = {
      width: 2000,
      height: 1000,
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, baseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
          facet: { field: "baz", type: "nominal" },
        },
      }],
    })
  })

  test("simple channel properties", () => {
    const state = {
      layers: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
          color: {
            field: "baz",
            datum: "datum123",
            value: "value123",
            type: "quantitative",
            aggregate: "sum",
            stack: "normalized",
            title: "title123",
            legend: false,
            scaleType: "scale123",
            scheme: "scheme123",
            domain: "domain123",
            range: "range123",
            zero: "zero123",
          },
        },
      }],
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
          color: {
            field: "baz",
            datum: "datum123",
            value: "value123",
            type: "quantitative",
            aggregate: "sum",
            stack: "normalized",
            title: "title123",
            legend: false,
            scale: {
              type: "scale123",
              scheme: "scheme123",
              domain: "domain123",
              range: "range123",
              zero: "zero123",
            }
          },
        },
      }],
    })
  })

  describe("binning-related properties", () => {
    test("bin='binned' overrides all other bin options", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
              bin: "binned",
              maxBins: 42,
              binStep: 7,
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
              bin: "binned",
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      })
    })

    test("Binning options require truthy bin parameter", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
              bin: false,
              maxBins: 42,
              binStep: 7,
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      })
    })

    test("able to set bin step, overriding max bins", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
              bin: true,
              maxBins: 42,
              binStep: 7,
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
              bin: { step: 7 },
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      })
    })

    test("able to set max bins", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
              bin: true,
              maxBins: 42,
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: {
              field: "foo",
              type: "quantitative",
              bin: { maxbins: 42 },
            },
            y: { field: "bar", type: "nominal" },
          },
        }],
      })
    })
  })

  describe("sorting-related properties", () => {
    test("works for basic field, ascending", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative" },
            y: {
              field: "bar",
              type: "nominal",
              sortBy: "baz",
              sort: null,
            },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative" },
            y: {
              field: "bar",
              type: "nominal",
              sort: "baz",
            },
          },
        }],
      })
    })

    test("works for basic field, descending", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative" },
            y: {
              field: "bar",
              type: "nominal",
              sortBy: "baz",
              sort: "descending",
            },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative" },
            y: {
              field: "bar",
              type: "nominal",
              sort: "-baz",
            },
          },
        }],
      })
    })

    test("works for basic field with minus sign", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative" },
            y: {
              field: "bar",
              type: "nominal",
              sort: "-baz"
            },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative" },
            y: {
              field: "bar",
              type: "nominal",
              sort: "-baz",
            },
          },
        }],
      })
    })
  })

  describe("time-unit-related properties", () => {
    test("works with temporal field", () => {

      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "temporal", timeUnit: "hours" },
            y: { field: "bar", type: "nominal" },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "temporal", timeUnit: "hours" },
            y: { field: "bar", type: "nominal" },
          },
        }],
      })
    })

    test("is skipped with non-temporal field", () => {
      const state = {
        layers: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative", timeUnit: "hours" },
            y: { field: "bar", type: "nominal" },
          },
        }],
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        layer: [{
          mark: {
            type: "area",
            point: true,
          },
          encoding: {
            x: { field: "foo", type: "quantitative" },
            y: { field: "bar", type: "nominal" },
          },
        }],
      })
    })
  })

  test("all supported properties", () => {
    const state = {
      layers: [{
        mark: {
          angle: 35,
          color: "red",
          dx: 12,
          dy: 34,
          filled: true,
          interpolate: "monotone",
          opacity: 0.8,
          orient: "horizontal",
          point: true,
          radius: 50,
          radius2: 25,
          shape: "square",
          size: 150,
          strokeDash: [2,1],
          strokeWidth: 33,
          tooltip: true,
          type: "area",
        },
        encoding: {
          angle: { field: "bloop", type: "quantitative" },
          color: { field: "bloop", type: "quantitative" },
          column: { field: "bloop", type: "quantitative" },
          detail: { field: "bloop", type: "quantitative" },
          facet: { field: "bloop", type: "quantitative" },
          latitude: { field: "bloop", type: "quantitative" },
          latitude2: { field: "bloop", type: "quantitative" },
          longitude: { field: "bloop", type: "quantitative" },
          longitude2: { field: "bloop", type: "quantitative" },
          opacity: { field: "bloop", type: "quantitative" },
          radius: { field: "bloop", type: "quantitative" },
          radius2: { field: "bloop", type: "quantitative" },
          row: { field: "bloop", type: "quantitative" },
          shape: { field: "bloop", type: "quantitative" },
          size: { field: "bloop", type: "quantitative" },
          strokeDash: { field: "bloop", type: "quantitative" },
          strokeWidth: { field: "bloop", type: "quantitative" },
          text: { field: "bloop", type: "quantitative" },
          theta: { field: "bloop", type: "quantitative" },
          theta2: { field: "bloop", type: "quantitative" },
          url: { field: "bloop", type: "quantitative" },
          x: { field: "bloop", type: "quantitative" },
          x2: { field: "bloop", type: "quantitative" },
          xOffset: { field: "bloop", type: "quantitative" },
          y: { field: "bloop", type: "quantitative" },
          y2: { field: "bloop", type: "quantitative" },
          yOffset: { field: "bloop", type: "quantitative" },
        },
      }]
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      layer: [{
        mark: {
          angle: 35,
          color: "red",
          dx: 12,
          dy: 34,
          filled: true,
          interpolate: "monotone",
          opacity: 0.8,
          orient: "horizontal",
          point: true,
          radius: 50,
          radius2: 25,
          shape: "square",
          size: 150,
          strokeDash: [2,1],
          strokeWidth: 33,
          tooltip: true,
          type: "area",
        },
        encoding: {
          angle: { field: "bloop", type: "quantitative" },
          color: { field: "bloop", type: "quantitative" },
          column: { field: "bloop", type: "quantitative" },
          detail: { field: "bloop", type: "quantitative" },
          facet: { field: "bloop", type: "quantitative" },
          latitude: { field: "bloop", type: "quantitative" },
          latitude2: { field: "bloop", type: "quantitative" },
          longitude: { field: "bloop", type: "quantitative" },
          longitude2: { field: "bloop", type: "quantitative" },
          opacity: { field: "bloop", type: "quantitative" },
          radius: { field: "bloop", type: "quantitative" },
          radius2: { field: "bloop", type: "quantitative" },
          row: { field: "bloop", type: "quantitative" },
          shape: { field: "bloop", type: "quantitative" },
          size: { field: "bloop", type: "quantitative" },
          strokeDash: { field: "bloop", type: "quantitative" },
          strokeWidth: { field: "bloop", type: "quantitative" },
          text: { field: "bloop", type: "quantitative" },
          theta: { field: "bloop", type: "quantitative" },
          theta2: { field: "bloop", type: "quantitative" },
          url: { field: "bloop", type: "quantitative" },
          x: { field: "bloop", type: "quantitative" },
          x2: { field: "bloop", type: "quantitative" },
          xOffset: { field: "bloop", type: "quantitative" },
          y: { field: "bloop", type: "quantitative" },
          y2: { field: "bloop", type: "quantitative" },
          yOffset: { field: "bloop", type: "quantitative" },
        },
      }],
    })
  })
})