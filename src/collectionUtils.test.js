import { describe, expect, test } from 'vitest'

import {
  haveAnyElementsInCommon,
  objectFrom,
  objectFilter,
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
    const out = objectFrom({'a': 10, 'b': 20})
    expect(out).toEqual({'a': 10, 'b': 20})
  })

  test('clone maintains order', () => {
    const obj = {}
    obj['b'] = 20
    obj['a'] = 10

    const out = objectFrom(obj)
    expect(Object.keys(out)).toEqual(['b', 'a'])
  })

  test('transform', () => {
    const out = objectFrom({'a': 10, 'b': 20}, ([k, v]) => [k.toUpperCase(), v + 100])
    expect(out).toEqual({'A': 110, 'B': 120})
  })

  test('transform and discard falsy', () => {
    const out = objectFrom({'a': 10, 'b': 20, 'c': 30}, ([k, v]) => {
      if (k == 'b') return 0
      return [k.toUpperCase(), v + 100]
    })
    expect(out).toEqual({'A': 110, 'C': 130})
  })
})

describe('objectFilter', () => {
  test('empty', () => {
    const out = objectFilter({}, x => x)
    expect(out).toEqual({})
  })

  test('clone', () => {
    const out = objectFilter({'a': 10, 'b': 20}, x => x)
    expect(out).toEqual({'a': 10, 'b': 20})
  })

  test('clone maintains order', () => {
    const obj = {}
    obj['b'] = 20
    obj['a'] = 10

    const out = objectFilter(obj, x => x)
    expect(Object.keys(out)).toEqual(['b', 'a'])
  })

  test('simple filter', () => {
    const out = objectFilter({'a': 10, 'b': 20}, ([k, v]) => v > 15)
    expect(out).toEqual({'b': 20})
  })

  test('filter without match', () => {
    const out = objectFilter({'a': 10, 'b': 20}, ([k, v]) => v > 25)
    expect(out).toEqual({})
  })

  test('filter with all match', () => {
    const out = objectFilter({'a': 10, 'b': 20}, ([k, v]) => v > 5)
    expect(out).toEqual({'a': 10, 'b': 20})
  })
})
