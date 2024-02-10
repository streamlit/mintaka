import { ReactNode, memo, useCallback } from "react"

import {
  Preset,
  Presets,
} from "../presetTypes.ts"

import {
  UIComponents,
  WithCustomState,
} from "../uiTypes.ts"

import { NamedMode } from "../configTypes.ts"

import { showSection } from "../modeParser.ts"
import { BuilderState } from "../BuilderState.ts"

export interface Props<S> extends WithCustomState<S> {
  state: BuilderState,
  presets?: Presets,
  preset?: Preset | null,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

function PresetPickerRaw<S>({
  state,
  presets,
  preset,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const setPreset = useCallback((newPreset: Preset) => {
    state.setPreset(newPreset)
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
        value={preset}
        setValue={setPreset}
        items={presets}
        viewMode={namedViewMode?.[0]}
        customState={customState}
        setCustomState={setCustomState}
      />
    </ui.PresetsContainer>
  )
}

export const PresetPicker = memo(PresetPickerRaw) as typeof PresetPickerRaw
