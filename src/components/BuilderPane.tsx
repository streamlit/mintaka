import React, { useState, useEffect, useCallback } from "react"

import { CONFIG } from "../config.ts"
import { generateVegaSpec } from "../vegaBuilder.ts"

import { useBuilderState } from "./useBuilderState.ts"
import { BuilderPaneProps } from "./commonTypes.ts"
import { LayerBuilder } from "./LayerBuilder.tsx"
import { PresetBuilder } from "./PresetBuilder.tsx"


export function BuilderPane({
  config,
  columnTypes,
  initialState,
  setGeneratedSpec,
  ui,
  presets,
  smartHideProperties
}: BuilderPaneProps) {
  if (!config) config = CONFIG

  const state = useBuilderState(config, columnTypes, initialState)

  const reset = useCallback(() => {
    state.reset()
  }, [ state ])

  useEffect(() => {
    setGeneratedSpec(
      generateVegaSpec(state, columnTypes, config)
    )
  }, [
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
        ui={ui}
        preset={presets}
        />

      <LayerBuilder
        state={state}
        columnTypes={columnTypes}
        ui={ui}
        config={config}
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
