import { useState, useCallback } from "react"

export function useBuilderState(widgets, columnTypes, initialState) {
  const getInitialMark = useCallback(() => {
    // Flatten widgets.mark
    const flatMark = Object.values(widgets.mark)
      .reduce((obj, markGroup) => {
        Object.assign(obj, markGroup)
        return obj
      }, {})

    const mark = Object.fromEntries(
      Object.keys(flatMark).map(name => [
        name, initialState?.mark?.[name]
      ])
    )

    // Vega requirest a type in order to even draw.
    if (!mark.type) mark.type = "point"

    return mark
  })

  const getInitialEncoding = useCallback(() => {
    // Flatten widgets.encoding
    const flatEncoding = Object.values(widgets.encoding)
      .reduce((obj, channelGroup) => {
        Object.assign(obj, channelGroup)
        return obj
      }, {})

    return Object.fromEntries(
      Object.keys(flatEncoding).map(name => [
        name, initialState?.encoding?.[name]
      ])
    )
  })

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

  const getMarkSetter = useCallback(key => {
    return value => {
      setMark({
        ...mark,
        [key]: value,
      })
    }
  }, [mark, setMark])

  const getEncodingSetter = useCallback(channel => {
    return key => value => {
      setEncoding({
        ...encoding,
        [channel]: {
          ...encoding[channel],
          [key]: value,
        }
      })
    }
  }, [encoding, setEncoding])

  return {
    preset,
    setPreset,
    mark,
    encoding,
    reset,
    setMark,
    setEncoding,
    getMarkSetter,
    getEncodingSetter,
  }
}
