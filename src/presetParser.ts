import merge from "lodash/merge"

import { isElementOf } from "./array.ts"

export function updateStateFromPreset(
  state, presetSpec, columnTypes
) {
  if (presetSpec == null) return null

  // Using fromEntries/entries rather than the spread operator to
  // keep the ordering intact.
  const spec = Object.fromEntries(Object.entries(presetSpec))

  const columns = findColumns(spec.findColumns, columnTypes)
  followIfConditions(spec, columns)

  const encodingState = Object.fromEntries(
    Object.entries(spec.encoding).map(([name, channelSpec]) => [
      name,
      {...channelSpec, field: columns[channelSpec.field]}
    ]))

  state.setPreset(presetSpec)
  state.setMark({ ...spec.mark })
  state.setEncoding({ ...encodingState })
}

function findColumns(findColsSpec, columnTypes) {
  if (!findColsSpec) return {}

  const columns = {}

  for (const [varName, filter] of Object.entries(findColsSpec)) {
    const col = findColumn(
      filter, columnTypes, Object.values(columns))

    if (col) columns[varName] = col
  }

  return columns
}

function findColumn(filterSpec, columnTypes, columnsAlreadyFound) {
  if (!filterSpec) return

  let candidateColsAndTypes = Object.entries(columnTypes)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, info]) => {
        let keep = true

        if (filterSpec.type) keep &= isElementOf(info.type, filterSpec.type)
        if (filterSpec.maxUnique) keep &= (info.unique ?? 0) <= filterSpec.maxUnique

        return keep
      })

  if (candidateColsAndTypes.lenth == 0 && filterSpec.type?.some(x => x == null)) {
    candidateColsAndTypes = Object.entries(columnTypes)
  }

  const candidateCols = candidateColsAndTypes.map(([name]) => name)

  return candidateCols.find(name => !isElementOf(name, columnsAlreadyFound))
}

function followIfConditions(spec, columns) {
  const matchingIfSpecs = Object.entries(spec.ifColumn ?? {})
    .filter(([col]) => columns[col] != null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, spec]) => spec)

  if (matchingIfSpecs) merge(spec, ...matchingIfSpecs.reverse())
}
