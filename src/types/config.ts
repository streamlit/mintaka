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

export type ModeConfig = Grouping<Mode>
export type MarkConfig = PlainRecord<MarkPropName>
export type EncodingConfig = PlainRecord<ChannelName>
export type ChannelPropertiesConfig = PlainRecord<ChannelPropName>
export type MarkPropertyValuesConfig = Grouping<PropertyValues>
export type ChannelPropertyValuesConfig = Grouping<PropertyValues>
export type SelectMarkPropertyFunc = (name: string, state: BuilderState) => boolean
export type SelectChannelFunc = (name: string, state: BuilderState) => boolean
export type SelectChannelPropertyFunc = (name: string, channelName: string, state: BuilderState) => boolean

export interface Config {
  modes: ModeConfig,
  mark: MarkConfig,
  encoding: EncodingConfig,
  channelProperties: ChannelPropertiesConfig,
  markPropertyValues: MarkPropertyValuesConfig,
  channelPropertyValues: ChannelPropertyValuesConfig,
  selectMarkProperty: SelectMarkPropertyFunc,
  selectChannel: SelectChannelFunc,
  selectChannelProperty: SelectChannelPropertyFunc,
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
