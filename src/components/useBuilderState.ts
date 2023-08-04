import { useState, useCallback } from "react"

export function useBuilderState(widgets, columnTypes, baseSpec) {
  // TODO: If we want to use the baseSpec here for defaults, then we need
  // to be able to convert it to a format we use for the state. That's complex
  // because specs have several shorthands. For example, mark can be "circle"
  // or {"type": "circle"}.

  const getEmptyMark = () => {
    // Flatten widgets.mark
    const allMarks = Object.values(widgets.mark)
      .reduce((obj, markGroup) => {
        Object.assign(obj, markGroup)
        return obj
      }, {})

    const marks = Object.fromEntries(
      Object.keys(allMarks).map((name) => [
        name, baseSpec?.mark?.[name]
      ])
    )

    // Vega requirest a type in order to even draw.
    if (!marks.type) marks.type = "point"

    return marks
  }

  const getEmptyEncoding = () => {
    // Flatten widgets.encoding
    const allChannels = Object.values(widgets.encoding)
      .reduce((obj, channelGroup) => {
        Object.assign(obj, channelGroup)
        return obj
      }, {})

    return Object.fromEntries(
      Object.entries(allChannels).map(([name, propertySpec]) => {
        const defaultColIndex = propertySpec.defaultColIndex
        const defaultColName = Object.keys(columnTypes)[defaultColIndex]

        const propertySpecState = defaultColIndex == null
          ? {}
          : { field: defaultColName }

        return [
          name,
          baseSpec?.encoding?.[name] ?? propertySpecState
        ]
      })
    )
  }

  const [mark, setMark] = useState(getEmptyMark)
  const [encoding, setEncoding] = useState(getEmptyEncoding)

  const reset = useCallback(() => {
    setMark(getEmptyMark())
    setEncoding(getEmptyEncoding())
  })

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
    mark,
    encoding,
    reset,
    setMark,
    setEncoding,
    getMarkSetter,
    getEncodingSetter,
  }
}
