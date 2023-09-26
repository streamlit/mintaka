import { describe, expect, test } from 'vitest'

import {
  haveAnyElementsInCommon,
  deepClone,
  objectFilter,
  objectFrom,
} from "./collectionUtils"

describe('haveAnyElementsInCommon', () => {
  test('empty vs empty', () => {
    const out = haveAnyElementsInCommon([], [])
    expect(out).toBeFalsy()
  })

  test('empty vs something', () => {
    const out = haveAnyElementsInCommon([], ['a', 'b', 'c'])
    expect(out).toBeFalsy()
  })

  test('something vs empty', () => {
    const out = haveAnyElementsInCommon(['a', 'b', 'c'], [])
    expect(out).toBeFalsy()
  })

  test('no match', () => {
    const out = haveAnyElementsInCommon(['a', 'b', 'c'], ['d', 'e', 'f'])
    expect(out).toBeFalsy()
  })

  test('one match', () => {
    const out = haveAnyElementsInCommon(['a', 'b', 'c'], ['d', 'e', 'a', 'f'])
    expect(out).toBeTruthy()
  })

  test('many matches', () => {
    const out = haveAnyElementsInCommon(['a', 'b', 'c'], ['c', 'd', 'e', 'a', 'f'])
    expect(out).toBeTruthy()
  })
})

describe('objectFrom', () => {
  test('empty', () => {
    const out = objectFrom({})
    expect(out).toEqual({})
  })

  test('clone', () => {
    const out = objectFrom({a: 10, b: 20})
    expect(out).toEqual({a: 10, b: 20})
  })

  test('clone maintains order', () => {
    const obj = {}
    obj['b'] = 20
    obj['a'] = 10

    const out = objectFrom(obj)
    expect(Object.keys(out)).toEqual(['b', 'a'])
  })

  test('transform', () => {
    const out = objectFrom({a: 10, b: 20}, ([k, v]) => [k.toUpperCase(), v + 100])
    expect(out).toEqual({A: 110, B: 120})
  })

  test('transform and discard falsy', () => {
    const out = objectFrom({a: 10, b: 20, c: 30}, ([k, v]) => {
      if (k == 'b') return 0
      return [k.toUpperCase(), v + 100]
    })
    expect(out).toEqual({A: 110, C: 130})
  })
})

describe('objectFilter', () => {
  test('empty', () => {
    const out = objectFilter({}, x => x)
    expect(out).toEqual({})
  })

  test('clone', () => {
    const out = objectFilter({a: 10, b: 20}, x => x)
    expect(out).toEqual({a: 10, b: 20})
  })

  test('clone maintains order', () => {
    const obj = {}
    obj['b'] = 20
    obj['a'] = 10

    const out = objectFilter(obj, x => x)
    expect(Object.keys(out)).toEqual(['b', 'a'])
  })

  test('simple filter', () => {
    const out = objectFilter({a: 10, b: 20}, ([k, v]) => v > 15)
    expect(out).toEqual({b: 20})
  })

  test('filter without match', () => {
    const out = objectFilter({a: 10, b: 20}, ([k, v]) => v > 25)
    expect(out).toEqual({})
  })

  test('filter with all match', () => {
    const out = objectFilter({a: 10, b: 20}, ([k, v]) => v > 5)
    expect(out).toEqual({a: 10, b: 20})
  })
})

describe('deepClone', () => {
  const TESTS = [
    ['null', null],
    ['number', 123],
    ['boolean true', true],
    ['boolean false', false],
    ['string', 'hello world'],
    ['empty obj', {}],
    ['shallow obj', {a: 10, b: 20}],
    ['empty array', []],
    ['shallow array', [100, 300, 200]],
    ['deep obj', {a: {aa: {aaa: 12}, ab: 23}, b: {ba: 34, bb: {bba: 45}}}],
    ['deep array', [1, [21, 22, [231, 232], 24], 3, [41, [422]]]],
    ['mixed obj', {a: [1, '20', null], b: false}],
  ]

  TESTS.forEach(([name, obj]) =>
    test(name, () => {
      const out = deepClone(obj)
      expect(out).toEqual(obj)
    })
  )

  test('clone maintains obj order', () => {
    const obj = {}
    obj['b'] = 20
    obj['a'] = 10

    const out = deepClone(obj)
    expect(Object.keys(out)).toEqual(['b', 'a'])
  })
})
