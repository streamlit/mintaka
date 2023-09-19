import { useState, useCallback } from "react"

import {
  BuilderState,
  Config,
  MarkPropertyValueSetter,
  ChannelPropertySetter,
  ChannelPropertyValueSetter,
  json,
  MarkConfig,
  EncodingConfig,
  Preset,
} from "../types"

import { objectFrom } from "../collectionUtils"

export function useBuilderState(
  config: Config,
  initialState: BuilderState,
): BuilderState {
  const getInitialMark = useCallback((): MarkConfig => {
    const mark = objectFrom(config?.mark, ([label, name]: [string, string]) => [
      name, initialState?.mark?.[name]
    ])

    // Vega requires a type in order to even draw.
    if (!mark.type) mark.type = "point"

    return mark
  }, [])

  const getInitialEncoding = useCallback((): EncodingConfig => {
    return objectFrom(config?.encoding, ([label, name]: [string, string]) => [
      name, initialState?.encoding?.[name]
    ])
  }, [])

  const [preset, setPreset] = useState<Preset>({})
  const [mark, setMark] = useState<MarkConfig>(getInitialMark)
  const [encoding, setEncoding] = useState<EncodingConfig>(getInitialEncoding)

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
    (key: string): MarkPropertyValueSetter => (
      (value: json): void => {
        setMark({
          ...mark,
          [key]: value,
        })
      }
    ), [mark, setMark])

  const getEncodingSetter = useCallback(
    (channel: string): ChannelPropertySetter => (
      (key: string): ChannelPropertyValueSetter => (
        (value: json): void => {
          setEncoding({
            ...encoding,
            [channel]: {
              ...encoding[channel],
              [key]: value,
            }
          })
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
