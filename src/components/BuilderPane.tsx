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
  const [customState, setCustomState] = useState({})

  const [ advancedMode, setAdvancedMode ] = useState(false)
  const [ namedViewMode, setNamedViewMode ] =
    useState(Object.entries(config?.modes ?? {})?.[0])

  const setViewMode = useCallback((name) => {
    setNamedViewMode([name, config?.modes?.[name]])
  }, [ config?.modes ])

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
      state.mark,
      state.encoding,
      // Not including:
      // state,
  ])

  return (
    <ui.BuilderContainer>
      <PresetBuilder
        state={state}
        columnTypes={columnTypes}
        ui={ui}
        presets={presets}
        namedViewMode={namedViewMode}
        customState={customState}
        setCustomState={setCustomState}
        />

      <LayerBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        ui={ui}
        namedViewMode={namedViewMode}
        customState={customState}
        setCustomState={setCustomState}
        />

      <ui.ToolbarContainer>
        {config?.modes && (
          <ui.ModePicker
            items={Object.keys(config?.modes)}
            value={namedViewMode[0]}
            setValue={setViewMode}
          />
        )}

        <ui.ResetButton onClick={reset} />
      </ui.ToolbarContainer>
    </ui.BuilderContainer>
  )
}
