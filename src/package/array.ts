export function isElementOf<T>(el: T, arr: T[]): boolean {
  return arr.indexOf(el) != -1
}

export function haveAnyElementsInCommon(arr1: any[], arr2: any[]): boolean {
  return arr1.some(el1 => isElementOf(el1, arr2))
}
