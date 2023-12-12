import {
  Config,
  StructuralConfig,
  StructuralKey,
  Mode,
  NamedMode,
  PlainRecord,
} from "./types/index.ts"
import { objectFilter } from "./collectionUtils.ts"

export function showSection(
  sectionName: keyof Mode,
  namedMode: NamedMode
): boolean {
  if (!namedMode) return true

  const modeSpec = namedMode[1]
  const sectionMode = modeSpec[sectionName] ?? modeSpec.else != false

  return !!sectionMode
}

type FilterFn = (str: string) => boolean

export function filterSection(
  sectionName: StructuralKey,
  configSpec: Config,
  namedMode: NamedMode,
  filterFn: FilterFn,
): StructuralConfig|null {
  let sectionItems: Set<string>
  const currConfig: StructuralConfig = configSpec[sectionName]

  if (namedMode) {
    const modeSpec = namedMode[1]
    const sectionMode =
      modeSpec[sectionName as keyof Mode]
      ?? modeSpec.else != false

    if (!sectionMode) return null

    sectionItems = sectionMode instanceof Set
      ? sectionMode
      : new Set(Object.values(currConfig))
  } else {
    sectionItems = new Set(Object.values(currConfig))
  }

  return objectFilter(
    currConfig as PlainRecord<string>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, name]: [string, string]) => sectionItems.has(name) && filterFn(name)
  ) as StructuralConfig
}
