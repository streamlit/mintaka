import { useState, useCallback } from "react"

export function useBuilderState(widgets, columnTypes, fromVlSpec) {
  // TODO: If we want to use the baseSpec here for defaults, then we need
  // to be able to convert it to a format we use for the state. That's complex
  // because specs have several shorthands. For example, mark can be "circle"
  // or {"type": "circle"}.

  const getEmptyMark = () => {
    return Object.fromEntries(
      Object.keys(widgets.mark).map((name) => [
        name,
        fromVlSpec?.mark?.[name] ?? widgets.mark[name]?.default
      ]))
  }

  const getEmptyEncoding = () => {
    return Object.fromEntries(
      Object.entries(widgets.channels).map(([name, propertySpec]) => {
        const defaultColIndex = propertySpec.defaultColIndex
        const defaultColName = Object.keys(columnTypes)[defaultColIndex]

        const propertySpecState = defaultColIndex == null
          ? {}
          : { field: defaultColName }

        return [
          name,
          fromVlSpec?.encoding?.[name] ?? propertySpecState
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
