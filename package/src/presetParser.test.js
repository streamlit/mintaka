import { describe, expect, test } from "vitest"

import { updateStateFromPreset } from "./presetParser"

function makeFakeState() {
  const newState = {}

  const state = {
    preset: null,
    mark: {},
    encoding: {},
    setPreset: (v) => newState.preset = v,
    setMark: (v) => newState.mark = v,
    setEncoding: (v) => newState.encoding = v,
  }

  return [ state, newState ]
}

describe("updateStateFromPreset", () => {
  test("null state throws error", () => {
    const state = null
    const preset = {}
    const columnTypes = {}

    expect(() => updateStateFromPreset(state, preset, columnTypes))
      .toThrow()
  })

  test("bad state throws error", () => {
    const state = {}
    const preset = {}
    const columnTypes = {}

    expect(() => updateStateFromPreset(state, preset, columnTypes))
      .toThrow()
  })

  test("null preset", () => {
    const [ state, newState ] = makeFakeState()
    const preset = {}
    const columnTypes = {}

    updateStateFromPreset(state, preset, columnTypes)

    expect(newState).toEqual({
      preset: {},
      mark: {},
      encoding: {},
    })
  })

  test("simple preset", () => {
    const [ state, newState ] = makeFakeState()
    const preset = {
      mark: {
        mk1: "mv1",
        mk2: "mv2",
      },
      encoding: {
        chan1: {
          chan1k1: "chan1v1",
          chan1k2: "chan1v2",
        },
        chan2: {
          chan2k1: "chan2v1",
          chan2k2: "chan2v2",
        },
      },
    }
    const columnTypes = {}

    updateStateFromPreset(state, preset, columnTypes)

    expect(newState).toEqual({
      preset,
      mark: {
        mk1: "mv1",
        mk2: "mv2",
      },
      encoding: {
        chan1: {
          chan1k1: "chan1v1",
          chan1k2: "chan1v2",
        },
        chan2: {
          chan2k1: "chan2v1",
          chan2k2: "chan2v2",
        },
      },
    })
  })

  describe("preset with if condition", () => {
    const [ state, newState ] = makeFakeState()
    const preset = {
      mark: {
        mk1: "mv1",
        mk2: "mv2",
      },
      encoding: {
        chan1: {
          chan1k1: "chan1v1",
          chan1k2: "chan1v2",
        },
        chan2: {
          chan2k1: "chan2v1",
          chan2k2: "chan2v2",
        },
      },
    }

    test("with empty columnTypes", () => {
      const columnTypes = {}

      preset["findColumns"] = {
        A: { type: ["nominal"] },
        B: { type: ["nominal"] },
      }

      preset["ifColumn"] = {
        A: {
          mark: { m1k1: "m1v1--modified" },
          chan1: { field: "A", chan1k2: "chan1v2--modified" },
        },
        B: {
          chan2: { field: "B", chan2k1: "chan2v1--modified" },
        },
      }

      updateStateFromPreset(state, preset, columnTypes)

      expect(newState).toEqual({
        preset,
        mark: {
          mk1: "mv1",
          mk2: "mv2",
        },
        encoding: {
          chan1: {
            chan1k1: "chan1v1",
            chan1k2: "chan1v2",
          },
          chan2: {
            chan2k1: "chan2v1",
            chan2k2: "chan2v2",
          },
        },
      })
    })

    test("with matching columnTypes", () => {
      const columnTypes = {
        col1: { type: "nominal" },
        col2: { type: "nominal" },
      }

      preset["findColumns"] = {
        Z: { type: ["quantitative", "temporal"] },
        A: { type: ["temporal", "nominal"] },
        B: { type: [null] },
      }

      preset["ifColumn"] = {
        A: {
          mark: { mk1: "mv1--modified" },
          encoding: {
            chan1: { field: "A", chan1k2: "chan1v2--modified" },
          },
        },
        B: {
          encoding: {
            chan2: { field: "B", chan2k1: "chan2v1--modified" },
          },
        },
      }

      updateStateFromPreset(state, preset, columnTypes)

      expect(newState).toEqual({
        preset,
        mark: {
          mk1: "mv1--modified",
          mk2: "mv2",
        },
        encoding: {
          chan1: {
            field: "col1",
            chan1k1: "chan1v1",
            chan1k2: "chan1v2--modified",
          },
          chan2: {
            field: "col2",
            chan2k1: "chan2v1--modified",
            chan2k2: "chan2v2",
          },
        },
      })
    })
  })
})
