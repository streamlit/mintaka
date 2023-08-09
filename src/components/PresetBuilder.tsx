import React, { useEffect, useCallback } from "react"

import { PRESETS } from "../config.ts"
import { updateStateFromPreset } from "../presetParser.ts"


export function PresetBuilder({
  columnTypes,
  presets,
  state,
  ui,
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

  return (presets && Object.keys(presets).length) ? (
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
  ) : null
}
