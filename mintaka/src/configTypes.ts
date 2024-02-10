import { Grouping, PlainRecord } from "./typeUtil.ts"
import { MarkPropName, ChannelName, ChannelPropName, PropertyValues, LayerState, StateValue } from "./stateTypes.ts"

export interface Mode {
  presets?: boolean,
  layers?: boolean,
  //coordinateSystem?: boolean,  // TODO
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

export type SelectMarkPropertyFunc = (
  name: string,
  layer: LayerState,
  stateValue: StateValue,
) => boolean

export type SelectChannelFunc = (
  name: ChannelName,
  layer: LayerState,
  stateValue: StateValue,
) => boolean

export type SelectChannelPropertyFunc = (
  name: ChannelPropName,
  channelName: ChannelName,
  layer: LayerState,
  stateValue: StateValue,
) => boolean

export interface Config {
  modes: ModeConfig,
  mark: MarkConfig,
  encoding: EncodingConfig,
  markPropertyValues: MarkPropertyValuesConfig,
  channelProperties: ChannelPropertiesConfig,
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