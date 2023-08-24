import { Grouping, PartialRecord } from "./util"
import { MarkPropName, ChannelName, ChannelPropName, PropertyValues, BuilderState } from "./state"

export interface Mode {
  presets?: boolean,
  mark?: boolean|string[],
  encoding?: boolean|string[],
  channelProperties?: boolean|string[],
  else?: boolean,
}

export interface Config {
  modes: Grouping<Mode>,
  mark: Grouping<PartialRecord<MarkPropName, { label: string }>>,
  encoding: Grouping<PartialRecord<ChannelName, { label: string }>>,
  channelProperties: Grouping<PartialRecord<ChannelPropName, { label: string }>>,
  markPropertyValues: Grouping<PropertyValues>,
  channelPropertyValues: Grouping<PropertyValues>,
  selectMarkProperty: (name: string, state: BuilderState) => boolean,
  selectChannel: (name: string, state: BuilderState) => boolean,
  selectChannelProperty: (name: string, channelName: string, state: BuilderState) => boolean,
}

export type VlFieldType =
  | "quantitative"
  | "ordinal"
  | "nominal"
  | "temporal"
  | "geojson"

export interface ColumnType {
  type: VlFieldType,
  unique?: number|null,
}

export type ColumnTypes = Record<string, ColumnType>
