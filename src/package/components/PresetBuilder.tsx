import { ReactNode, useEffect, useCallback } from "react"

import {
  BuilderState,
  ColumnTypes,
  Mode,
  Presets,
} from "../types"

import { PRESETS } from "../presets"
import { updateStateFromPreset } from "../presetParser"
import { shouldIncludeGroup } from "../modeParser"

export interface Props {
  columnTypes: ColumnTypes,
  presets: Presets,
  state: BuilderState,
  ui: UIComponents,
  viewMode: Mode,
}

export function PresetBuilder({
  columnTypes,
  presets,
  state,
  ui,
  viewMode,
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
      || !shouldIncludeGroup('presets', null, viewMode)) {
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
