import { PlainRecord } from "./types"

export function isElementOf<T>(el: T, arr: T[]): boolean {
  return arr.indexOf(el) != -1
}

export function haveAnyElementsInCommon(arr1: any[], arr2: any[]): boolean {
  return arr1.some(el1 => isElementOf(el1, arr2))
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

export function objectIsEmpty<T>(obj: PlainRecord<T>): boolean {
  return Object.keys(obj).length == 0
}
