import { useState } from "react"

export function useBuilderState(columnTypes, widgets, fromVlSpec) {
  // TODO: If we want to use the baseSpec here for defaults, then we need
  // to be able to convert it to a format we use for the state. That's complex
  // because specs have several shorthands. For example, mark can be "circle"
  // or {"type": "circle"}.

  const [markState, setMarkState] = useState(
    Object.fromEntries(
      Object.keys(widgets.mark).map((name) => [
        name,
        fromVlSpec?.mark?.[name] ?? widgets.mark[name]?.default
      ])))

  const [encodingState, setEncodingState] = useState(
    Object.fromEntries(
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
  )

  return {
    mark: {
      state: markState,
      setState: setMarkState,
      setProperty: (property: str, newValue: any) => {
        setMarkState({
          ...markState,
          [property]: newValue,
        })
      },
    },

    encoding: {
      states: encodingState,
      setState: setEncodingState,
      setProperty: (channel: str) => (property: str, newValue: any) => {
        setEncodingState({
          ...encodingState,
          [channel]: {
            ...encodingState[channel],
            [property]: newValue,
          }
        })
      },
    }
  }
}

