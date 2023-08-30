import { ReactNode, useEffect, useCallback, useState } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  Presets,
  UIComponents,
} from "../types"

import { CONFIG } from "../config"
import { generateVegaSpec } from "../vegaBuilder"
import { updateStateFromPreset } from "../presetParser"

import { useBuilderState } from "./useBuilderState"
import { LayerBuilder } from "./LayerBuilder"
import { PresetBuilder } from "./PresetBuilder"

export interface Props {
  columnTypes: ColumnTypes,
  config: Config,
  initialState: BuilderState, // TODO: Use VL Spec here.
  presets: Presets,
  setGeneratedSpec: (VLSpec) => void,
  ui: UIComponents,
}

export function BuilderPane({
  columnTypes,
  config,
  initialState,
  presets,
  setGeneratedSpec,
  ui,
}: Props): ReactNode {
  if (!config) config = CONFIG

  const state = useBuilderState(config, columnTypes, initialState)

  // Some state for the developer to use however they want.
  const [customState, setCustomState] = useState(null)

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
        presets={presets}
        viewMode={viewMode}
        />

      <LayerBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        ui={ui}
        viewMode={viewMode}
        customState={customState}
        setCustomState={setCustomState}
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
