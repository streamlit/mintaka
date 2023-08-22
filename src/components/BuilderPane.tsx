import React, { useEffect, useCallback, useState } from "react"

import { CONFIG } from "../config.ts"
import { generateVegaSpec } from "../vegaBuilder.ts"
import { updateStateFromPreset } from "../presetParser.ts"

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
  ui,
}: BuilderPaneProps) {
  if (!config) config = CONFIG

  const state = useBuilderState(config, columnTypes, initialState)

  const [ advancedMode, setAdvancedMode ] = useState(false)
  const [ viewMode, setViewMode ] =
    useState(Object.values(config?.modes)?.[0])

  const reset = useCallback(() => {
    state.reset()
    updateStateFromPreset(state, state.preset, columnTypes)
  }, [ columnTypes, state.preset ])

  useEffect(() => {
    const spec = generateVegaSpec(state, columnTypes, config)
    setGeneratedSpec(spec)
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
      <PresetBuilder
        state={state}
        columnTypes={columnTypes}
        ui={ui}
        preset={state.preset}
        presets={presets}
        viewMode={viewMode}
        />

      <LayerBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        ui={ui}
        viewMode={viewMode}
        />

      <ui.ToolbarContainer>
        {config?.modes && (
          <ui.ModePicker
            items={config?.modes}
            value={viewMode}
            setValue={setViewMode}
          />
        )}

        <ui.ResetButton onClick={reset}>
          Reset
        </ui.ResetButton>
      </ui.ToolbarContainer>
    </ui.BuilderContainer>
  )
}
