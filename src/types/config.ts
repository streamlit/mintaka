import { Grouping, PlainRecord } from "./util"
import { MarkPropName, ChannelName, ChannelPropName, PropertyValues, BuilderState } from "./state"

export interface Mode {
  presets?: boolean,
  mark?: boolean|Set<string>,
  encoding?: boolean|Set<string>,
  channelProperties?: boolean|Set<string>,
  else?: boolean,
}

export type NamedMode = [string, Mode]

export type MarkConfig = PlainRecord<MarkPropName>
export type EncodingConfig = PlainRecord<ChannelName>
export type ChannelConfig = PlainRecord<ChannelPropName>

export interface Config {
  modes: Grouping<Mode>,
  mark: MarkConfig,
  encoding: EncodingConfig,
  channelProperties: ChannelConfig,
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

export type ColumnTypes = PlainRecord<ColumnType>
