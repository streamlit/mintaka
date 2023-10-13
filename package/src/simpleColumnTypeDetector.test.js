import { describe, expect, test } from "vitest"

import { simpleColumnTypeDetector } from "./simpleColumnTypeDetector"

describe("simpleColumnTypeDetector", () => {
  test("quantitative columns", () => {
    const inputs = [0, 123, NaN, 10.2]
    inputs.forEach(v => {
      const out = simpleColumnTypeDetector(v)
      expect(out).toEqual("quantitative")
    })
  })

  test("temporal columns", () => {
    const inputs = [new Date()]
    inputs.forEach(v => {
      const out = simpleColumnTypeDetector(v)
      expect(out).toEqual("temporal")
    })
  })

  test("nominal columns", () => {
    const inputs = ["foo", true, false, null, undefined, {foo: 123}, [10, 11]]
    inputs.forEach(v => {
      const out = simpleColumnTypeDetector(v)
      expect(out).toEqual("nominal")
    })
  })
})
