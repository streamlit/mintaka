import React, { ReactNode, useEffect, useCallback } from "react"

import {
  BuilderState,
  ColumnTypes,
  NamedMode,
  Preset,
  Presets,
  UIComponents,
  WithCustomState,
} from "../types/index.ts"

import { PRESETS } from "../presets.ts"
import { updateStateFromPreset } from "../presetParser.ts"
import { showSection } from "../modeParser.ts"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes,
  presets: Presets,
  state: BuilderState,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

export function PresetBuilder<S>({
  columnTypes,
  presets,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  if (!presets) presets = PRESETS

  const setPreset = useCallback((preset: Preset) => {
    updateStateFromPreset(state, preset, columnTypes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.mark, state.encoding, columnTypes, /* state */])

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
