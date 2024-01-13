import includes from "lodash/includes"
import merge from "lodash/merge"
import cloneDeep from "lodash/cloneDeep"

import { ColumnTypes } from "./configTypes.ts"

import {
  EncodingState,
  MarkPropName,
  MarkState,
} from "./stateTypes.ts"

import {
  FindColumnsSpec,
  Preset,
  PresetColumnFilter,
} from "./presetTypes.ts"

import {
  Grouping,
  PlainRecord,
  json,
} from "./typeUtil.ts"

import { objectFrom, deepClone } from "./collectionUtils.ts"

export interface ParsedPreset {
  mark?: MarkState,
  encoding?: EncodingState,
}

export function parsePreset(
  presetSpec: Preset|null|undefined,
  columnTypes: ColumnTypes,
): ParsedPreset {
  if (presetSpec == null) return {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spec = deepClone(presetSpec as PlainRecord<any>)

  const columns = findColumns(spec.findColumns, columnTypes)
  followIfConditions(spec, columns)

  const mark = spec.mark as Grouping<Record<string, MarkPropName>>
  const encodingState = objectFrom(spec.encoding, ([name, channelSpec]: [string, PlainRecord<json>]) =>
    [name, {...channelSpec, field: columns[channelSpec.field as string]}]
  )

  return {
    mark: {...mark},
    encoding: cloneDeep(encodingState),
  }
}

function findColumns(
  findColsSpec: FindColumnsSpec,
  columnTypes: ColumnTypes,
): PlainRecord<string> {
  if (!findColsSpec) return {}

  const columns: PlainRecord<string> = {}

  for (const [varName, filter] of Object.entries(findColsSpec)) {
    const col = findColumn(
      filter, columnTypes, Object.values(columns))

    if (col) columns[varName] = col
  }

  return columns
}

function findColumn(
  filterSpec: PresetColumnFilter,
  columnTypes: ColumnTypes,
  columnsAlreadyFound: string[],
): string|undefined {
  if (!filterSpec) return

  let candidateColsAndTypes = Object.entries(columnTypes)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, info]) => {
        let keep = true

        if (filterSpec.type) keep = keep && includes(filterSpec.type, info.type)
        if (filterSpec.maxUnique) keep = keep && (info.unique ?? 0) <= filterSpec.maxUnique

        return keep
      })

  if (candidateColsAndTypes.length == 0 && filterSpec.type?.some(x => x == null)) {
    candidateColsAndTypes = Object.entries(columnTypes)
  }

  const candidateCols = candidateColsAndTypes.map(([name]) => name)

  return candidateCols.find(name => !includes(columnsAlreadyFound, name))
}

function followIfConditions(spec: Preset, columns: PlainRecord<string>): void {
  const matchingIfSpecs = Object.entries(spec.ifColumn ?? {})
    .filter(([col]) => columns[col] != null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, spec]) => spec)

  if (matchingIfSpecs) merge(spec, ...matchingIfSpecs)
}
