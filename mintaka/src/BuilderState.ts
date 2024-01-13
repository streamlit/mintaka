import isEmpty from "lodash/isEmpty"

import {
  Config,
  ColumnTypes,
} from "./configTypes.ts"

import {
    ChannelName,
    ChannelPropName,
    ChannelPropertyValueSetter,
    ChannelState,
    EncodingState,
    InitialState,
    LayerState,
    MarkPropName,
    MarkPropertyValueSetter,
    MarkState,
} from "./stateTypes.ts"

import { parsePreset } from "./presetParser.ts"
import { PRESETS } from "./presetDefaults.ts"
import { Presets, Preset } from "./presetTypes.ts"
import { json } from "./typeUtil.ts"

export class BuilderState {
  // Just some dummy values so Typescript doesn't complain.
  preset: Preset = {}
  currentLayerIndex = 0
  layers: LayerState[] = []
  // This is just the type returned by useState:
  onChange = () => undefined

  columnTypes: ColumnTypes
  config: Config
  initialState: InitialState|undefined
  presets: Presets|undefined

  constructor(
    columnTypes: ColumnTypes,
    config: Config,
    initialState: InitialState|undefined,
    presets: Presets|undefined,
  ) {
    this.columnTypes = columnTypes
    this.config = config
    this.initialState = initialState
    this.presets = presets

    this._resetRaw()
  }

  _resetRaw(preset?: Preset) {
    if (preset) {
      this.preset = preset
    } else {
      if (this.initialState?.preset) this.preset = this.initialState?.preset
      else if (this.presets) this.preset = Object.values(this.presets as Presets)[0]
      else this.preset = Object.values(PRESETS)[0]
    }

    const stateFromPreset = parsePreset(this.preset, this.columnTypes)

    const markSource = (
      !isEmpty(this.initialState?.layers?.[0]?.mark)
        ? this.initialState?.layers?.[0]?.mark
        : !isEmpty(stateFromPreset.mark)
          ? stateFromPreset.mark
          : {}
    ) as MarkState

    const mark = Object.fromEntries(
      Object.values(this.config?.mark ?? {}).map((name: MarkPropName) => [
        name, markSource[name]
      ])) as MarkState

    const encodingSource = (
      !isEmpty(this.initialState?.layers?.[0]?.encoding)
        ? this.initialState?.layers?.[0]?.encoding
        : !isEmpty(stateFromPreset.encoding)
          ? stateFromPreset.encoding
          : {}
    ) as EncodingState

    const encoding = Object.fromEntries(
      Object.values(this.config?.encoding ?? {}).map((name: ChannelName) => [
        name, encodingSource[name]
      ])) as EncodingState

    const layer = { mark, encoding }
    this.layers = [layer]
    this.currentLayerIndex = 0
  }

  reset(): void {
    this._resetRaw(this.preset)
    this.onChange()
  }

  setPreset(preset: Preset): void {
    this._resetRaw(preset)
    this.onChange()
  }

  getCurrentLayer(): LayerState {
    return this.layers[this.currentLayerIndex]
  }

  selectLayer(i: number): void {
    if (i < 0) i = this.layers.length + i
    this.currentLayerIndex = i

    this.onChange()
  }

  setCurrentLayer(newLayer: LayerState): void {
    const i = this.currentLayerIndex

    const before = this.layers.slice(0, i)
    const after = this.layers.slice(i + 1)

    this.layers = [...before, newLayer, ...after]

    this.onChange()
  }

  removeCurrentLayer(): void {
    if (this.layers.length == 1) return
    const i = this.currentLayerIndex

    const before = this.layers.slice(0, i)
    const after = this.layers.slice(i + 1)

    this.layers = [...before, ...after]
    this.currentLayerIndex = i >= this.layers.length ? this.layers.length - 1 : i

    this.onChange()
  }

  moveCurrentLayer(newIndex: number): void {
    if (newIndex >= this.layers.length) return
    const i = this.currentLayerIndex

    let before = this.layers.slice(0, i)
    let after = this.layers.slice(i + 1)
    const layer = this.layers[i]

    const tempLayers = [...before, ...after]

    const j = newIndex
    before = tempLayers.slice(0, j)
    after = tempLayers.slice(i + 1)

    this.layers = [...before, layer, ...after]
    this.currentLayerIndex = j

    this.onChange()
  }

  createNewLayer(): void {
    const currLayer = this.getCurrentLayer()
    const newLayer = {...currLayer}

    this.layers = [...this.layers, newLayer]
    this.currentLayerIndex = this.layers.length - 1

    this.onChange()
  }

  setMarkProp(markPropName: MarkPropName, markPropValue: json): void {
    const layer = this.getCurrentLayer()

    const mark = {
      ...layer.mark,
      [markPropName]: markPropValue,
    }

    this.setCurrentLayer({
      ...layer,
      mark
    })
  }

  setChannel(channelName: ChannelName, channelState: ChannelState): void {
    const layer = this.getCurrentLayer()

    const encoding = {
      ...layer.encoding,
      [channelName]: channelState,
    }

    this.setCurrentLayer({
      ...layer,
    encoding 
    })
  }

  setChannelProp(
    channelName: ChannelName, 
    channelPropName: ChannelPropName,
    channelPropValue: json,
  ): void {
    const layer = this.getCurrentLayer()
    const channel = layer.encoding[channelName]

    const newChannel = {
      ...channel,
      [channelPropName]: channelPropValue,
    }

    this.setChannel(channelName, newChannel)
  }

  getMarkSetter(key: MarkPropName): MarkPropertyValueSetter {
    return (value: json): void => {
      this.setMarkProp(key, value)
    }
  }

  getChannelPropSetter(channel: ChannelName, key: ChannelPropName): ChannelPropertyValueSetter {
    return (value: json): void => {
      this.setChannelProp(channel, key, value)
    }
  }
}
