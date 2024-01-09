import { useEffect, useState, useCallback, Dispatch, SetStateAction, DependencyList } from "react"
import isEmpty from "lodash/isEmpty"

import {
  BuilderState,
  Config,
  MarkPropertyValueSetter,
  ChannelName,
  ChannelPropertySetter,
  ChannelPropertyValueSetter,
  json,
  MarkPropName,
  Preset,
  EncodingState,
  MarkState,
  ChannelPropName,
  Presets,
  ColumnTypes,
} from "../types/index.ts"

import { parsePreset, ParsedPreset } from "../presetParser.ts"
import { PRESETS } from "../presets.ts"

export function useBuilderState(
  columnTypes: ColumnTypes,
  config: Config,
  initialState?: BuilderState,
  presets?: Presets,
): BuilderState {
  const [preset, setPreset] = useReactiveState<Preset>(() => {
      if (initialState?.preset) return initialState?.preset
      if (presets) return Object.values(presets as Presets)[0]
      return Object.values(PRESETS)[0]
  }, [initialState, presets])

  const [stateFromPreset] = useReactiveState<ParsedPreset>(() => {
    return parsePreset(preset, columnTypes)
  }, [preset, columnTypes])

  const getInitialMark = useCallback((): MarkState => {
    const markSource = (
      !isEmpty(initialState?.mark)
        ? initialState?.mark
        : !isEmpty(stateFromPreset.mark)
          ? stateFromPreset.mark
          : {}
    ) as MarkState

    return Object.fromEntries(
      Object.values(config?.mark ?? {}).map((name: MarkPropName) => [
        name, markSource[name]
      ])) as MarkState
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFromPreset])

  const getInitialEncoding = useCallback((): EncodingState => {
    const encodingSource = (
      !isEmpty(initialState?.encoding)
        ? initialState?.encoding
        : !isEmpty(stateFromPreset.encoding)
          ? stateFromPreset.encoding
          : {}
    ) as EncodingState

    return Object.fromEntries(
      Object.values(config?.encoding ?? {}).map((name: ChannelName) => [
        name, encodingSource[name]
      ])) as EncodingState
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFromPreset])

  const [mark, setMark] = useReactiveState(getInitialMark, [getInitialMark])
  const [encoding, setEncoding] = useReactiveState(getInitialEncoding, [getInitialEncoding])

  const getMarkSetter = useCallback(
    (key: MarkPropName): MarkPropertyValueSetter => (
      (value: json): void => {
        setMark({
          ...mark,
          [key]: value,
        } as MarkState)
      }
    ), [mark, setMark])

  const getEncodingSetter = useCallback(
    (channel: ChannelName): ChannelPropertySetter => (
      (key: ChannelPropName): ChannelPropertyValueSetter => (
        (value: json): void => {
          setEncoding({
            ...encoding,
            [channel]: {
              ...encoding[channel],
              [key]: value,
            }
          } as EncodingState)
        }
      )
    ), [encoding, setEncoding])

  const layer = {
    mark,
    encoding,
    // TODO XXX setters need to set inside the layer AND update state.layers accordingly (immutable).
    setMark,
    setEncoding,
    getMarkSetter,
    getEncodingSetter,
  }

  const reset = useCallback(() => {
    setMark(getInitialMark())
    setEncoding(getInitialEncoding())
  }, [
    getInitialEncoding,
    getInitialMark,
    setEncoding,
    setMark,
  ])

  const state = {
    reset,
    preset,
    setPreset,
    currentLayerIndex: 0,
    layers: [layer],
  }

  return state
}

function useReactiveState<T>(fn: () => T, deps: DependencyList): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(fn)

  useEffect(() => {
    setState(fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [state, setState]
}
