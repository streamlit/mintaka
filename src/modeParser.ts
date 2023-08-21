import { isElementOf } from "./array.ts"

export function shouldIncludeGroup(sectionName, groupName, modeSpec) {
  const sectionSettings = modeSpec?.[sectionName]

  if (sectionSettings == false) return false
  if (sectionSettings == true) return true

  if (Array.isArray(sectionSettings)) {
    if (groupName == null) {
      // Called is trying to check whether the entire section should be shown.
      // If the person who configured the modes didn't want to show this section,
      // they're have set it to false rather than use an array. So we'll return
      // True instead.
      return true
    } else {
      return isElementOf(groupName, sectionSettings)
    }
  }

  return !!modeSpec?.else
}
