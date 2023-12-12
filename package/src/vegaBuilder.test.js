import { describe, expect, test } from "vitest"

import {
  selectMarkProperty,
  selectChannel,
  selectChannelProperty,
} from "./config.ts"

import {
  haveAnyElementsInCommon,
  deepClone,
  objectFilter,
  objectFrom,
} from "./collectionUtils.ts"

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
      mark: {},
      encoding: {},
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      encoding: {},
      mark: {},
    })
  })

  test("simple state gets converted to vega", () => {
    const state = {
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: "bar", type: "nominal" },
      },
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: "bar", type: "nominal" },
      },
    })
  })

  test("ability to filter properties", () => {
    const state = {
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: "bar", type: "nominal" },
      },
    }
    const config = {
      selectMarkProperty: (v) => v != "point",
      selectChannel: (v) => v != "y",
      selectChannelProperty: (v) => v != "type",
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, config, trivialBaseSpec)

    expect(out).toEqual({
      mark: {
        type: "area",
      },
      encoding: {
        x: { field: "foo" },
      },
    })
  })

  test("ability to grab column type from columnTypes", () => {
    const state = {
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo" },
        y: { field: "bar" },
      },
    }
    const columnTypes = {
      foo: { type: "temporal" },
      bar: { type: "ordinal" },
    }
    const out = generateVegaSpec(
      state, columnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "temporal" },
        y: { field: "bar", type: "ordinal" },
      },
    })
  })

  test("ability to provide defaults with baseSpec", () => {
    const state = {
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: "bar", type: "nominal" },
      },
    }
    const baseSpec = {
      mark: {
        point: false,
        tooltip: true,
      },
      data: {
        name: "baz",
      },
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, baseSpec)

    expect(out).toEqual({
      mark: {
        type: "area",
        point: true,
        tooltip: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: "bar", type: "nominal" },
      },
      data: {
        name: "baz",
      },
    })
  })

  test("ability to fold fields", () => {
    const state = {
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: ["bar", "baz", "boz"], type: "nominal" },
      },
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
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
      transform: [{
          as: [ "mtk--folded-keys-y", "mtk--folded-values-y" ],
          fold: [ "bar", "baz", "boz" ],
      }],
    })
  })

  test("ability to stack bar charts side-by-side", () => {
    const state = {
      mark: {
        type: "bar",
      },
      encoding: {
        x: { field: "foo", type: "nominal" },
        y: { field: "bar", type: "quantitative", stack: false },
        color: { field: "baz", type: "nominal" },
      },
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
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
    })
  })

  test("don't fix stacking if mark type is not bar", () => {
    const state = {
      mark: {
        type: "point",
      },
      encoding: {
        x: { field: "foo", type: "nominal" },
        y: { field: "bar", type: "quantitative", stack: false },
        color: { field: "baz", type: "nominal" },
      },
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      mark: {
        type: "point",
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
      },
    })
  })

  test("fix chart size if faceting", () => {
    const state = {
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: "bar", type: "nominal" },
        facet: { field: "baz", type: "nominal" },
      },
    }
    const baseSpec = {
      width: 2000,
      height: 1000,
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, baseSpec)

    expect(out).toEqual({
      mark: {
        type: "area",
        point: true,
      },
      encoding: {
        x: { field: "foo", type: "quantitative" },
        y: { field: "bar", type: "nominal" },
        facet: { field: "baz", type: "nominal" },
      },
    })
  })

  test("simple channel properties", () => {
    const state = {
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
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
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
    })
  })

  describe("binning-related properties", () => {
    test("bin='binned' overrides all other bin options", () => {
      const state = {
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
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
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
      })
    })

    test("Binning options require truthy bin parameter", () => {
      const state = {
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
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
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
      })
    })

    test("able to set bin step, overriding max bins", () => {
      const state = {
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
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
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
      })
    })

    test("able to set max bins", () => {
      const state = {
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
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
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
      })
    })
  })

  describe("sorting-related properties", () => {
    test("works for basic field, ascending", () => {
      const state = {
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
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
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
      })
    })

    test("works for basic field, descending", () => {
      const state = {
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
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
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
      })
    })

    test("works for basic field with minus sign", () => {
      const state = {
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
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
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
      })
    })
  })

  describe("time-unit-related properties", () => {
    test("works with temporal field", () => {

      const state = {
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "temporal", timeUnit: "hours" },
          y: { field: "bar", type: "nominal" },
        },
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "temporal", timeUnit: "hours" },
          y: { field: "bar", type: "nominal" },
        },
      })
    })

    test("is skipped with non-temporal field", () => {
      const state = {
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative", timeUnit: "hours" },
          y: { field: "bar", type: "nominal" },
        },
      }
      const out = generateVegaSpec(
        state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

      expect(out).toEqual({
        mark: {
          type: "area",
          point: true,
        },
        encoding: {
          x: { field: "foo", type: "quantitative" },
          y: { field: "bar", type: "nominal" },
        },
      })
    })
  })

  test("all supported properties", () => {
    const state = {
      mark: {
        type: "area",
        shape: "square",
        filled: true,
        point: true,
        interpolate: "monotone",
        angle: 35,
        orient: "horizontal",
        radius: 50,
        radius2: 25,
        size: 150,
        opacity: 0.8,
        tooltip: true,
      },
      encoding: {
        x: { field: "bloop", type: "quantitative" },
        y: { field: "bloop", type: "quantitative" },
        text: { field: "bloop", type: "quantitative" },
        url: { field: "bloop", type: "quantitative" },
        theta: { field: "bloop", type: "quantitative" },
        latitude: { field: "bloop", type: "quantitative" },
        longitude: { field: "bloop", type: "quantitative" },
        color: { field: "bloop", type: "quantitative" },
        size: { field: "bloop", type: "quantitative" },
        opacity: { field: "bloop", type: "quantitative" },
        shape: { field: "bloop", type: "quantitative" },
        strokeDash: { field: "bloop", type: "quantitative" },
        angle: { field: "bloop", type: "quantitative" },
        x2: { field: "bloop", type: "quantitative" },
        y2: { field: "bloop", type: "quantitative" },
        latitude2: { field: "bloop", type: "quantitative" },
        longitude2: { field: "bloop", type: "quantitative" },
        radius: { field: "bloop", type: "quantitative" },
        radius2: { field: "bloop", type: "quantitative" },
        theta2: { field: "bloop", type: "quantitative" },
        xOffset: { field: "bloop", type: "quantitative" },
        yOffset: { field: "bloop", type: "quantitative" },
        facet: { field: "bloop", type: "quantitative" },
        column: { field: "bloop", type: "quantitative" },
        row: { field: "bloop", type: "quantitative" },
      },
    }
    const out = generateVegaSpec(
      state, trivialColumnTypes, trivialConfig, trivialBaseSpec)

    expect(out).toEqual({
      mark: {
        type: "area",
        shape: "square",
        filled: true,
        point: true,
        interpolate: "monotone",
        angle: 35,
        orient: "horizontal",
        radius: 50,
        radius2: 25,
        size: 150,
        opacity: 0.8,
        tooltip: true,
      },
      encoding: {
        x: { field: "bloop", type: "quantitative" },
        y: { field: "bloop", type: "quantitative" },
        text: { field: "bloop", type: "quantitative" },
        url: { field: "bloop", type: "quantitative" },
        theta: { field: "bloop", type: "quantitative" },
        latitude: { field: "bloop", type: "quantitative" },
        longitude: { field: "bloop", type: "quantitative" },
        color: { field: "bloop", type: "quantitative" },
        size: { field: "bloop", type: "quantitative" },
        opacity: { field: "bloop", type: "quantitative" },
        shape: { field: "bloop", type: "quantitative" },
        strokeDash: { field: "bloop", type: "quantitative" },
        angle: { field: "bloop", type: "quantitative" },
        x2: { field: "bloop", type: "quantitative" },
        y2: { field: "bloop", type: "quantitative" },
        latitude2: { field: "bloop", type: "quantitative" },
        longitude2: { field: "bloop", type: "quantitative" },
        radius: { field: "bloop", type: "quantitative" },
        radius2: { field: "bloop", type: "quantitative" },
        theta2: { field: "bloop", type: "quantitative" },
        xOffset: { field: "bloop", type: "quantitative" },
        yOffset: { field: "bloop", type: "quantitative" },
        facet: { field: "bloop", type: "quantitative" },
        column: { field: "bloop", type: "quantitative" },
        row: { field: "bloop", type: "quantitative" },
      },
    })
  })
})
