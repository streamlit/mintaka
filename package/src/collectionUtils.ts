import includes from "lodash/includes"

import { PlainRecord } from "./types"

export function haveAnyElementsInCommon(arr1: any[], arr2: any[]): boolean {
  return arr1.some(el1 => includes(arr2, el1))
}

type MapFn<T> = ([k, v]: [string, T]) => [string, T]
type FilterFn<T> = ([k, v]: [string, T]) => boolean

export function objectFrom<T>(
  obj?: PlainRecord<T>|null,
  fn?: MapFn<T>,
): PlainRecord<T> {
  if (!obj) return {}

  // Don't use spread operator, to maintain ordering.
  if (!fn) return Object.fromEntries(Object.entries(obj))

  const entries = Object.entries(obj)
    .map(fn)
    .filter(item => !!item)

  return Object.fromEntries(entries as Array<[string, T]>)
}

// This is like lodash's pickBy, but we guarantee original ordering.
export function objectFilter<T>(
  obj: PlainRecord<T>,
  fn: FilterFn<T>,
): PlainRecord<T> {
  // Don't use spread operator, to maintain ordering.
  return Object.fromEntries(
    Object.entries(obj).filter(fn)
  )
}

// Does not support cycles.
export function deepClone<T>(thing: T): T {
  if (Array.isArray(thing)) {
    const arr = thing as Array<any>
    return arr.map(v => deepClone(v)) as T
  }

  // Don't use spread operator, to maintain ordering.
  if (thing instanceof Object) {
    const obj = thing as PlainRecord<any>
    return objectFrom(obj, ([k, v]) => [k, deepClone(v)]) as T
  }

  return thing
}
