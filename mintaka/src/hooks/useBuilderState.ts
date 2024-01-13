import { useEffect, useState, useCallback, Dispatch, SetStateAction, DependencyList } from "react"
import isEmpty from "lodash/isEmpty"

import {
  Config,
  MarkPropertyValueSetter,
  ChannelName,
  ChannelPropertyValueSetter,
  json,
  MarkPropName,
  Preset,
  EncodingState,
  MarkState,
  ChannelPropName,
  Presets,
  ColumnTypes,
  LayerState,
  ChannelState,
  InitialState,
} from "../types/index.ts"

import { parsePreset } from "../presetParser.ts"
import { PRESETS } from "../presets.ts"

export function useBuilderState(
  columnTypes: ColumnTypes,
  config: Config,
  initialState?: InitialState,
  presets?: Presets,
): [number, BuilderStateC] {
  const [changeNum, setChangeNum] = useState(0)

  const [state] = useState(() => new BuilderStateC(
    columnTypes, config, initialState, presets))

  state.onChange = useCallback(() => {
    setChangeNum(changeNum + 1)
  }, [
    setChangeNum,
    changeNum,
  ])

  useEffect(() => {
    state.columnTypes = columnTypes
    state.config = config
    state.initialState = initialState
    state.presets = presets
    state.reset()
  }, [columnTypes, config, initialState, presets])

  return [changeNum, state]
}

function useReactiveState<T>(fn: () => T, deps: DependencyList): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(fn)

  useEffect(() => {
    setState(fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [state, setState]
}

export class BuilderStateC {
  // Just some dummy values so Typescript doesn't complain.
  preset: Preset = {}
  currentLayerIndex: number = 0
  layers: LayerState[] = []
  // This is just the type returned by useState:
  onChange = () => {}

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

    this.#reset()
  }

  #reset(preset?: Preset) {
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
    this.#reset()
    this.onChange()
  }

  setPreset(preset: Preset): void {
    this.#reset(preset)
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