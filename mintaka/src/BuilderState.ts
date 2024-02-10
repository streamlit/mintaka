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
  StateValue,
  InitialState,
  LayerState,
  MarkPropName,
  MarkPropertyValueSetter,
  MarkState,
} from "./stateTypes.ts"

import { parsePreset } from "./presetParser.ts"
import { Presets, Preset } from "./presetTypes.ts"
import { json } from "./typeUtil.ts"
import { PRESETS } from "./presetDefaults.ts"

function emptyValue(): StateValue {
  return {
    preset: null,
    currentLayerIndex: 0,
    layers: [{ mark: {}, encoding: {} }],
  }
}

export class BuilderState {
  // Just some dummy values so Typescript doesn't complain.
  value: StateValue = emptyValue()

  _columnTypes: ColumnTypes
  _config: Config
  _initialState: InitialState | undefined | null
  _presets: Presets | undefined | null
  _onChange: (v: StateValue) => void = () => undefined

  constructor(
    columnTypes: ColumnTypes,
    config: Config,
    initialState: InitialState | undefined | null,
    presets: Presets | undefined | null,
    onChange: (v: StateValue) => void,
  ) {
    this._columnTypes = columnTypes
    this._config = config
    this._initialState = initialState
    this._presets = presets
    this._onChange = onChange

    this.reset()
  }

  _resetRaw(preset?: Preset | null): StateValue {
    if (!preset) {
      if (this._initialState?.preset) preset = this._initialState?.preset
      else if (this._presets) preset = Object.values(this._presets as Presets)[0]
      else preset = Object.values(PRESETS)[0]
    }

    const stateFromPreset = parsePreset(preset, this._columnTypes)

    const markSource = (
      !isEmpty(this._initialState?.layers?.[0]?.mark)
        ? this._initialState?.layers?.[0]?.mark
        : !isEmpty(stateFromPreset.mark)
          ? stateFromPreset.mark
          : {}
    ) as MarkState

    const mark = Object.fromEntries(
      Object.values(this._config?.mark ?? {}).map((name: MarkPropName) => [
        name, markSource[name]
      ])) as MarkState

    const encodingSource = (
      !isEmpty(this._initialState?.layers?.[0]?.encoding)
        ? this._initialState?.layers?.[0]?.encoding
        : !isEmpty(stateFromPreset.encoding)
          ? stateFromPreset.encoding
          : {}
    ) as EncodingState

    const encoding = Object.fromEntries(
      Object.values(this._config?.encoding ?? {}).map((name: ChannelName) => [
        name, encodingSource[name]
      ])) as EncodingState

    const currentLayer = { mark, encoding }

    return {
      preset,
      currentLayerIndex: 0,
      layers: [currentLayer],
    }
  }

  reset(): void {
    this.value = this._resetRaw(this.value.preset)
    this._onChange(this.value)
  }

  setPreset(preset: Preset): void {
    this.value = this._resetRaw(preset)
    this._onChange(this.value)
  }

  getCurrentLayer(): LayerState {
    return this.value.layers[this.value.currentLayerIndex]
  }

  selectLayer(i: number): void {
    if (i < 0) i = this.value.layers.length + i

    this.value = {
      ...this.value,
      currentLayerIndex: i
    }

    this._onChange(this.value)
  }

  setCurrentLayer(newLayer: LayerState): void {
    const i = this.value.currentLayerIndex

    const before = this.value.layers.slice(0, i)
    const after = this.value.layers.slice(i + 1)

    this.value = {
      ...this.value,
      layers: [...before, newLayer, ...after]
    }

    this._onChange(this.value)
  }

  removeCurrentLayer(): void {
    if (this.value.layers.length == 1) return
    const i = this.value.currentLayerIndex

    const before = this.value.layers.slice(0, i)
    const after = this.value.layers.slice(i + 1)

    const newIndex = i >= this.value.layers.length - 1
      ? this.value.layers.length - 2
      : i

    this.value = {
      ...this.value,
      layers: [...before, ...after],
      currentLayerIndex: newIndex,
    }

    this._onChange(this.value)
  }

  moveCurrentLayer(newIndex: number): void {
    if (newIndex >= this.value.layers.length) return
    const i = this.value.currentLayerIndex

    let before = this.value.layers.slice(0, i)
    let after = this.value.layers.slice(i + 1)
    const layer = this.value.layers[i]

    const tempLayers = [...before, ...after]

    const j = newIndex
    before = tempLayers.slice(0, j)
    after = tempLayers.slice(i + 1)

    this.value = {
      ...this.value,
      layers: [...before, layer, ...after],
      currentLayerIndex: j,
    }

    this._onChange(this.value)
  }

  createNewLayerAndSetAsCurrent(): void {
    const currLayer = this.getCurrentLayer()
    const newLayer = { ...currLayer }

    this.value = {
      ...this.value,
      layers: [...this.value.layers, newLayer],
      currentLayerIndex: this.value.layers.length,
    }

    this._onChange(this.value)
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
