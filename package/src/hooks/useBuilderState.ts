import { useState, useCallback } from "react"

import {
  BuilderState,
  Config,
  MarkPropertyValueSetter,
  ChannelName,
  ChannelPropertySetter,
  ChannelPropertyValueSetter,
  json,
  MarkConfig,
  MarkPropName,
  EncodingConfig,
  Preset,
  EncodingState,
  MarkState,
  ChannelPropName,
} from "../types/index.ts"

import { objectFrom } from "../collectionUtils.ts"

export function useBuilderState(
  config: Config,
  initialState?: BuilderState,
): BuilderState {
  const getInitialMark = useCallback((): MarkConfig => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mark = objectFrom(config?.mark, ([_, name]: [string, string]) => [
      name, initialState?.mark?.[name as MarkPropName] as string
    ]) as MarkConfig

    // Vega requires a type in order to even draw.
    if (!mark.type) mark.type = "point"

    return mark
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getInitialEncoding = useCallback((): EncodingConfig => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return objectFrom(config?.encoding, ([_, name]: [string, string]) => [
      name, initialState?.encoding?.[name as ChannelName] as string
    ]) as EncodingConfig
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [preset, setPreset] = useState<Preset>({})
  const [mark, setMark] = useState<MarkState>(getInitialMark)
  const [encoding, setEncoding] = useState<EncodingState>(getInitialEncoding)

  const reset = useCallback(() => {
    setMark(getInitialMark())
    setEncoding(getInitialEncoding())
  }, [
    getInitialEncoding,
    getInitialMark,
    setEncoding,
    setMark,
  ])

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

  return {
    reset,
    preset,
    setPreset,
    mark,
    encoding,
    setMark,
    setEncoding,
    getMarkSetter,
    getEncodingSetter,
  }
}
