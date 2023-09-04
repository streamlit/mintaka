export function isElementOf<T>(el: T, arr: T[]): boolean {
  return arr.indexOf(el) != -1
}

export function haveAnyElementsInCommon(arr1: any[], arr2: any[]): boolean {
  return arr1.some(el1 => isElementOf(el1, arr2))
}

export function objectFrom<T>(
  obj: Record<T>,
  fn?: ([string, T]) => T,
): Record<T> {
  if (!obj) return {}
  if (!fn) return Object.fromEntries(Object.entries(obj))

  return Object.fromEntries(
    Object.entries(obj)
      .map(fn)
      .filter(item => !!item)
  )
}

export function objectFilter<T>(
  obj: Record<T>,
  fn: ([string, T]) => boolean,
): Record<T>|E {
  return Object.fromEntries(
    Object.entries(obj).filter(fn)
  )
}

export function objectIsEmpty(obj: Record): boolean {
  return Object.keys(obj).length == 0
}
