import { isElementOf } from "./array.ts"

export function shouldIncludeSection(sectionName, modeSpec) {
  const include = modeSpec?.include

  if (include) {
    const includeThisSection = isElementOf(sectionName, include)
    return includeThisSection
  }

  const exclude = modeSpec?.exclude

  if (exclude) {
    const excludeThisSection = isElementOf(sectionName, exclude)
    return !excludeThisSection
  }

  return true
}
