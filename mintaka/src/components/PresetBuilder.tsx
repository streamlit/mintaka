import { ReactNode, useCallback } from "react"

import {
  Preset,
  Presets,
} from "../presetTypes.ts"

import {
  UIComponents,
  WithCustomState,
} from "../uiTypes.ts"

import { NamedMode } from "../configTypes.ts"

import { PRESETS } from "../presetDefaults.ts"
import { showSection } from "../modeParser.ts"
import { BuilderState } from "../hooks/useBuilderState.ts"

export interface Props<S> extends WithCustomState<S> {
  presets?: Presets,
  state: BuilderState,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

export function PresetBuilder<S>({
  presets,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  if (!presets) presets = PRESETS

  const setPreset = useCallback((preset: Preset) => {
    state.setPreset(preset)
  }, [state])

  if (!presets
      || Object.keys(presets).length == 0
      || !showSection('presets', namedViewMode)) {
    return null
  }

  const statePath = ["presets"]

  return (
    <ui.PresetsContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >
      <ui.GenericPickerWidget
        statePath={statePath}
        widgetHint={"select"}
        label={"Preset"}
        value={state.preset}
        setValue={setPreset}
        items={presets}
        viewMode={namedViewMode?.[0]}
        customState={customState}
        setCustomState={setCustomState}
      />
    </ui.PresetsContainer>
  )
}
