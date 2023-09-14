import { useState, useCallback } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  MarkPropertyValueSetter,
  ChannelPropertySetter,
  ChannelPropertyValueSetter,
  json,
} from "../types"

import { objectFrom } from "../collectionUtils"

export function useBuilderState(
  config: Config,
  columnTypes: ColumnTypes,
  initialState: BuilderState,
): BuilderState {
  const getInitialMark = useCallback(() => {
    const mark = objectFrom(config?.mark, ([label, name]) => [
      name, initialState?.mark?.[name]
    ])

    // Vega requires a type in order to even draw.
    if (!mark.type) mark.type = "point"

    return mark
  }, null)

  const getInitialEncoding = useCallback(() => {
    return objectFrom(config?.encoding, ([label, name]) => [
      name, initialState?.encoding?.[name]
    ])
  }, null)

  const [preset, setPreset] = useState(null)
  const [mark, setMark] = useState(getInitialMark)
  const [encoding, setEncoding] = useState(getInitialEncoding)

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
