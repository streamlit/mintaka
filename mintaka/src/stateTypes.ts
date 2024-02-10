import {
  PartialRecord,
  json,
} from "./typeUtil.ts"

import { Preset } from "./presetTypes.ts"

export type MarkPropName =
  | "align"
  | "angle"
  | "color"
  | "dx"
  | "dy"
  | "filled"
  | "interpolate"
  | "line"
  | "opacity"
  | "orient"
  | "point"
  | "radius"
  | "radius2"
  | "shape"
  | "size"
  | "strokeDash"
  | "strokeWidth"
  | "tooltip"
  | "type"

export type ChannelName =
  | "angle"
  | "color"
  | "column"
  | "detail"
  | "facet"
  | "latitude"
  | "latitude2"
  | "longitude"
  | "longitude2"
  | "opacity"
  | "radius"
  | "radius2"
  | "row"
  | "shape"
  | "size"
  | "strokeDash"
  | "strokeWidth"
  | "text"
  | "theta"
  | "theta2"
  | "tooltip"
  | "url"
  | "x"
  | "x2"
  | "xOffset"
  | "y"
  | "y2"
  | "yOffset"

export type ChannelPropName =
  | "aggregate"
  | "bin"
  | "binStep"
  | "datum"
  | "domain"
  | "field"
  | "legend"
  | "maxBins"
  | "range"
  | "scaleType"
  | "scheme"
  | "sort"
  | "stack"
  | "timeUnit"
  | "title"
  | "type"
  | "value"
  | "zero"

export type MarkPropertyValueSetter = (value: json) => void
export type MarkPropertySetter = (propName: MarkPropName) => MarkPropertyValueSetter

export type ChannelPropertyValueSetter = (value: json) => void
export type ChannelPropertySetter = (propName: ChannelPropName) => ChannelPropertyValueSetter
export type EncodingSetter = (channelName: ChannelName) => ChannelPropertySetter

export type MarkState = PartialRecord<MarkPropName, json>
export type EncodingState = PartialRecord<ChannelName, ChannelState>
export type ChannelState = PartialRecord<ChannelPropName, json>

export interface LayerState {
  mark: MarkState,
  encoding: EncodingState,
}

export interface InitialLayerState {
  mark?: MarkState,
  encoding?: EncodingState,
}

export interface InitialState {
  preset?: Preset,
  layers?: InitialLayerState[],
}

export interface StateValue {
  layers: LayerState[],
  currentLayerIndex: number,
  preset: Preset|undefined|null,
}

export type PropertyValues = Record<string, json>