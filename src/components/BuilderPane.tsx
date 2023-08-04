import React, { useState, useEffect, useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { generateVegaSpec } from "../vegaBuilder.ts"

import { useBuilderState } from "./useBuilderState.ts"
import { BuilderPaneProps } from "./commonTypes.ts"
import { LayerBuilder } from "./LayerBuilder.tsx"
import { PresetBuilder } from "./PresetBuilder.tsx"


export function BuilderPane({
  widgets,
  columnTypes,
  baseSpec,
  setGeneratedSpec,
  ui,
  presets,
  smartHideProperties
}: BuilderPaneProps) {
  if (!widgets) widgets = specConfig.WIDGETS

  const state = useBuilderState(widgets, columnTypes, baseSpec)

  const reset = useCallback(() => {
    state.reset()
  }, [ state ])

  useEffect(() => {
    setGeneratedSpec(
      generateVegaSpec(state, columnTypes, baseSpec)
    )
  }, [
      baseSpec,
      columnTypes,
      setGeneratedSpec,
      // state,
      state.mark,
      state.encoding,
  ])

  return (
    <ui.BuilderContainer>
      <PresetBuilder
        state={state}
        columnTypes={columnTypes}
        baseSpec={baseSpec}
        ui={ui}
        preset={presets}
        />

      <LayerBuilder
        state={state}
        columnTypes={columnTypes}
        ui={ui}
        widgets={widgets}
        smartHideProperties={smartHideProperties}
        />

      <ui.ToolbarContainer>
        <ui.Button onClick={reset}>
          Reset
        </ui.Button>
      </ui.ToolbarContainer>
    </ui.BuilderContainer>
  )
}
