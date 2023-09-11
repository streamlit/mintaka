import includes from "lodash/includes"

import { PlainRecord } from "./types"

export function haveAnyElementsInCommon(arr1: any[], arr2: any[]): boolean {
  return arr1.some(el1 => includes(arr2, el1))
}

type mapFn<T> = ([string, T]) => T
type filterFn<T> = ([string, T]) => boolean

export function objectFrom<T>(
  obj: PlainRecord<T>,
  fn?: mapFn<T>,
): PlainRecord<T> {
  if (!obj) return {}

  // Clone original object while keeping ordering (so can't use spread operator).
  if (!fn) return Object.fromEntries(Object.entries(obj))

  const entries = Object.entries(obj)
      .map(fn)
      .filter(item => !!item)

  return Object.fromEntries(entries as Array<[string, T]>)
}

export function objectFilter<T>(
  obj: PlainRecord<T>,
  fn: filterFn<T>,
): PlainRecord<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(fn)
  )
}
