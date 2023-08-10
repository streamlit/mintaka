import React, { useEffect, useCallback } from "react"

import { PRESETS } from "../presets.ts"
import { updateStateFromPreset } from "../presetParser.ts"
import { shouldIncludeSection } from "../modeParser.ts"


export function PresetBuilder({
  columnTypes,
  presets,
  state,
  ui,
  viewMode,
}) {
  if (!presets) presets = PRESETS

  const setPreset = useCallback((preset) => {
    updateStateFromPreset(state, preset, columnTypes)
  }, [state, columnTypes])

  useEffect(() => {
    if (!Object.keys(presets).length) return
    updateStateFromPreset(state, Object.values(presets)[0], columnTypes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets, columnTypes, /* state */])

  if (!presets
      || Object.keys(presets).length == 0
      || !shouldIncludeSection('presets', viewMode)) {
    return null
  }

  return (
    <ui.PresetsContainer title="Chart type">
      <ui.GenericPickerWidget
        propType="preset-property"
        parentName={null}
        propName="preset"
        groupName={null}
        widgetHint={"select"}
        label={"Preset"}
        value={null}
        setValue={setPreset}
        items={presets}
        advanced={false}
      />
    </ui.PresetsContainer>
  )
}
