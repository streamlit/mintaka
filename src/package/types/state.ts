import { PartialRecord, Grouping, json } from "./util"
import { Preset } from "./presets"

export type MarkPropName =
  | "angle"
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
  | "tooltip"
  | "type"

export type ChannelName =
  | "angle"
  | "color"
  | "column"
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
  | "text"
  | "theta"
  | "theta2"
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
export type MarkPropertySetter = (propName: string) => MarkPropertyValueSetter

export type ChannelPropertyValueSetter = (value: json) => void
export type ChannelPropertySetter = (propName: string) => ChannelPropertyValueSetter
export type EncodingSetter = (channelName: string) => ChannelPropertySetter

export type MarkState = PartialRecord<MarkPropName, json>
export type EncodingState = PartialRecord<ChannelName, ChannelState>
export type ChannelState = PartialRecord<ChannelPropName, json>

export interface BuilderState {
  reset: () => void,

  setPreset: (preset: Preset) => void,
  preset: Preset,

  mark: MarkState,
  setMark: (mark: MarkState) => void,

  encoding: EncodingState,
  setEncoding: (enc: EncodingState) => void,

  getMarkSetter: (key: string) => MarkPropertySetter,
  getEncodingSetter: (channel: string) => EncodingSetter,
}

export type PropertyValues = Record<string, json>
