import React, { useEffect, useCallback, useState } from "react"

import { CONFIG } from "../config.ts"
import { generateVegaSpec } from "../vegaBuilder.ts"

import { useBuilderState } from "./useBuilderState.ts"
import { BuilderPaneProps } from "./commonTypes.ts"
import { LayerBuilder } from "./LayerBuilder.tsx"
import { PresetBuilder } from "./PresetBuilder.tsx"


export function BuilderPane({
  columnTypes,
  config,
  initialState,
  presets,
  setGeneratedSpec,
  smartHideProperties,
  ui,
}: BuilderPaneProps) {
  if (!config) config = CONFIG

  const state = useBuilderState(config, columnTypes, initialState)

  const [ advancedMode, setAdvancedMode ] = useState(false)

  const reset = useCallback(() => {
    state.reset()
  }, [ state ])

  useEffect(() => {
    setGeneratedSpec(
      generateVegaSpec(state, columnTypes, config)
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
      config,
      columnTypes,
      setGeneratedSpec,
      // state,
      state.mark,
      state.encoding,
  ])

  return (
    <ui.BuilderContainer>
      { advancedMode ? null : (
        <PresetBuilder
          state={state}
          columnTypes={columnTypes}
          ui={ui}
          preset={presets}
          />
      )}

      <LayerBuilder
        columnTypes={columnTypes}
        config={config}
        smartHideProperties={smartHideProperties}
        state={state}
        ui={ui}
        advancedMode={advancedMode}
        />

      <ui.ToolbarContainer>
        <ui.Button onClick={reset}>
          Reset
        </ui.Button>

        <ui.Toggle
          label="Advanced"
          items={{off: false, on: true}}
          value={false}
          setValue={setAdvancedMode}
        />

      </ui.ToolbarContainer>
    </ui.BuilderContainer>
  )
}
