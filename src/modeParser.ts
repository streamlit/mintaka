import includes from "lodash/includes"

import { Config, NamedMode, PlainRecord } from "./types"
import { objectFilter } from "./collectionUtils"

export function showSection(
  sectionName: string,
  namedMode: NamedMode
): boolean {
  if (!namedMode) return true

  const modeSpec = namedMode[1]
  const sectionMode = modeSpec[sectionName] ?? modeSpec.else != false

  return !!sectionMode
}

type FilterFn = (string) => boolean

export function filterSection(
  sectionName: string,
  configSpec: Config,
  namedMode: NamedMode,
  filterFn: FilterFn,
): PlainRecord<any> {
  let sectionItems
  const currConfig = configSpec[sectionName]

  if (namedMode) {
    const modeSpec = namedMode[1]
    const sectionMode = modeSpec[sectionName] ?? modeSpec.else != false

    if (!sectionMode) return null

    sectionItems = sectionMode instanceof Set
      ? sectionMode
      : new Set(Object.values(currConfig))
  } else {
    sectionItems = new Set(Object.values(currConfig))
  }

  return objectFilter(currConfig, ([label, name]) =>
    sectionItems.has(name) && filterFn(name))
}
