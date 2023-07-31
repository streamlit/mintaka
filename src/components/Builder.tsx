import React, { useState, useEffect, useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { buildVegaSpec } from "../vegaBuilder.ts"

import { BuilderPaneProps } from "./commonTypes.ts"
import { LayerBuilder } from "./LayerBuilder.tsx"
import { PresetBuilder } from "./PresetBuilder.tsx"


export function BuilderPane(props: BuilderPaneProps) {
  const widgets = props.widgets ?? specConfig.WIDGETS

  const [key, setKey] = useState(0)
  const builderState = useBuilderState(props.columnTypes, widgets, props.baseSpec)

  const reset = useCallback(() => {
    setKey(key + 1)
  }, [setKey])

  useEffect(() => {
    props.state.setSpec(
      buildVegaSpec(builderState, props.columnTypes, props.baseSpec)
    )
  }, [
      props.baseSpec,
      props.columnTypes,
      builderState.mark.state,
      builderState.encoding.states,
  ])

  return (
    <props.ui.BuilderContainer>
      <PresetBuilder
        builderState={builderState}
        columnTypes={props.columnTypes}
        baseSpec={props.baseSpec}
        ui={props.ui}
        preset={props.presets}
        />

      <LayerBuilder
        key={`builder-${key}`}
        layerState={builderState}
        columnTypes={props.columnTypes}
        ui={props.ui}
        widgets={widgets}
        smartHideProperties={props.smartHideProperties}
        />

      <props.ui.ToolbarContainer>
        <props.ui.Button onClick={reset}>
          Reset
        </props.ui.Button>
      </props.ui.ToolbarContainer>
    </props.ui.BuilderContainer>
  )
}

export function useSpecState(baseSpec) {
  const [spec, setSpec] = useState(baseSpec)
  return { spec, setSpec }
}

function useBuilderState(columnTypes, widgets, fromVlSpec) {
  // TODO: If we want to use the baseSpec here for defaults, then we need
  // to be able to convert it to a format we use for the state. That's complex
  // because specs have several shorthands. For example, mark can be "circle"
  // or {"type": "circle"}.

  const markValues = specConfig.MARK_VALUES
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
