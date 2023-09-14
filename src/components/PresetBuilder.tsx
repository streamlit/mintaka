import { ReactNode, useEffect, useCallback } from "react"

import {
  BuilderState,
  ColumnTypes,
  NamedMode,
  Presets,
  UIComponents,
  WithCustomState,
} from "../types"

import { PRESETS } from "../presets"
import { updateStateFromPreset } from "../presetParser"
import { showSection } from "../modeParser"

export interface Props extends WithCustomState {
  columnTypes: ColumnTypes,
  presets: Presets,
  state: BuilderState,
  ui: UIComponents,
  namedViewMode: NamedMode,
}

export function PresetBuilder({
  columnTypes,
  presets,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props): ReactNode {
  if (!presets) presets = PRESETS

  const setPreset = useCallback((preset) => {
    updateStateFromPreset(state, preset, columnTypes)
  }, [state.mark, state.encoding, columnTypes])

  useEffect(() => {
    if (!Object.keys(presets).length) return
    updateStateFromPreset(state, Object.values(presets)[0], columnTypes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets, columnTypes, /* state */])

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
