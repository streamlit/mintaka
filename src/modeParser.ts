import { isElementOf } from "./array.ts"

export function shouldIncludeSection(sectionName, modeSpec) {
  const include = modeSpec?.include
  console.log("shouldIncludeSection", sectionName, modeSpec)

  if (include) {
    const includeThisSection = isElementOf(sectionName, include)
    console.log(includeThisSection)
    return includeThisSection
  }

  const exclude = modeSpec?.exclude

  if (exclude) {
    const excludeThisSection = isElementOf(sectionName, exclude)
    console.log(!excludeThisSection)
    return !excludeThisSection
  }

  console.log(true)
  return true
}
