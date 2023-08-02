import React, { useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { setBuilderStateFromPreset } from "../presetParser.ts"


export function PresetBuilder(props) {
  const presets = props.presets ?? specConfig.PRESETS

  const setPreset = useCallback((preset) => {
    setBuilderStateFromPreset(
      props.builderState, preset, props.columnTypes)
  }, [props.builderState, props.columnTypes])

  return (
    <props.ui.PresetsContainer title="Chart type">
      <props.ui.GenericPickerWidget
        propType="chartType"
        propName="preset"
        widgetHint={"select"}
        label={"Preset"}
        value={null}
        setValue={setPreset}
        items={presets}
        advanced={false}
      />
    </props.ui.PresetsContainer>
  )
}
