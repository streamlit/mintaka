import { Dispatch, SetStateAction } from "react"

import { PartialRecord, json } from "./util.ts"
import { Preset } from "./presets.ts"

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
export type MarkPropertySetter = (propName: MarkPropName) => MarkPropertyValueSetter

export type ChannelPropertyValueSetter = (value: json) => void
export type ChannelPropertySetter = (propName: ChannelPropName) => ChannelPropertyValueSetter
export type EncodingSetter = (channelName: ChannelName) => ChannelPropertySetter

export type MarkState = PartialRecord<MarkPropName, json>
export type EncodingState = PartialRecord<ChannelName, ChannelState>
export type ChannelState = PartialRecord<ChannelPropName, json>

export interface LayerState {
  mark: MarkState,
  // This is just the type returned by useState.
  setMark: Dispatch<SetStateAction<MarkState>>,

  encoding: EncodingState,
  // This is just the type returned by useState.
  setEncoding: Dispatch<SetStateAction<EncodingState>>,

  getMarkSetter: MarkPropertySetter,
  getEncodingSetter: EncodingSetter,
}

export interface BuilderState {
  reset: () => void,

  setPreset: (preset: Preset) => void,
  preset: Preset,

  currentLayerIndex: number,
  layers: LayerState[],
}

export type PropertyValues = Record<string, json>
