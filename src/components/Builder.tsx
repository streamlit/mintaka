import React, { useState, useEffect, useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { buildVegaSpec } from "../vegaBuilder.ts"

import { useBuilderState } from "./useBuilderState.ts"
import { BuilderPaneProps } from "./commonTypes.ts"
import { LayerBuilder } from "./LayerBuilder.tsx"
import { PresetBuilder } from "./PresetBuilder.tsx"


export function BuilderPane(props: BuilderPaneProps) {
  const widgets = props.widgets ?? specConfig.WIDGETS

  const [key, setKey] = useState(0)
  const builderState = useBuilderState(props.columnTypes, widgets, props.baseSpec)

  const reset = useCallback(() => {
    setKey(key + 1)
  }, [ setKey, key ])

  useEffect(() => {
    props.state.setSpec(
      buildVegaSpec(builderState, props.columnTypes, props.baseSpec)
    )
  }, [
      props.baseSpec,
      props.columnTypes,
      // props.state,
      props.state.setSpec,
      // builderState,
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
