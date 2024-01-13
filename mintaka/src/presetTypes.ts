import { Grouping, json } from "./typeUtil.ts"

export interface PresetColumnFilter {
  type?: Array<string | null>,
  maxUnique?: number,
}

export type FindColumnsSpec = Grouping<PresetColumnFilter>
export type IfColumnsSpec = Grouping<json>

export interface Preset {
  mark?: json,
  encoding?: json,
  findColumns?: FindColumnsSpec,
  ifColumn?: IfColumnsSpec,
}

export type Presets = Grouping<Preset>
