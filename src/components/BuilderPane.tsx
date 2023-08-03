import React, { useState, useEffect, useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { generateVegaSpec } from "../vegaBuilder.ts"

import { useBuilderState } from "./useBuilderState.ts"
import { BuilderPaneProps } from "./commonTypes.ts"
import { LayerBuilder } from "./LayerBuilder.tsx"
import { PresetBuilder } from "./PresetBuilder.tsx"


export function BuilderPane(props: BuilderPaneProps) {
  const widgets = props.widgets ?? specConfig.WIDGETS
  const builderState = useBuilderState(widgets, props.columnTypes, props.baseSpec)

  const reset = useCallback(() => {
    builderState.reset()
  }, [ builderState ])

  useEffect(() => {
    props.setGeneratedSpec(
      generateVegaSpec(builderState, props.columnTypes, props.baseSpec)
    )
  }, [
      props.baseSpec,
      props.columnTypes,
      props.setGeneratedSpec,
      // builderState,
      builderState.mark,
      builderState.encoding,
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
