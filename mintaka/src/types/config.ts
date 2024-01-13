import { Grouping, PlainRecord } from "./util.ts"
import { MarkPropName, ChannelName, ChannelPropName, PropertyValues, LayerState } from "./state.ts"

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
export type SelectMarkPropertyFunc = (name: string, layer: LayerState) => boolean
export type SelectChannelFunc = (name: ChannelName, layer: LayerState) => boolean
export type SelectChannelPropertyFunc = (
  name: ChannelPropName, channelName: ChannelName, layer: LayerState) => boolean

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

export type StructuralKey =
  "modes" | "mark" | "encoding" | "channelProperties" | "markPropertyValues"
export type StructuralConfig =
  ModeConfig | MarkConfig | EncodingConfig | ChannelPropertiesConfig | MarkPropertyValuesConfig

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
