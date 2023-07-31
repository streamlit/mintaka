import React, { useState, useEffect, useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { setBuilderStateFromPreset } from "../presetParser.ts"

import { BuilderPaneProps } from "./commonTypes.ts"
import { BuilderPane } from "./Builder.tsx"


export function PresetBuilder(props) {
  const presets = props.presets ?? specConfig.PRESETS

  const [spec, setSpec] = useState(
    setBuilderStateFromPreset(
      props.builderState,
      Object.values(presets)[0],
      props.columnTypes))

  const setPreset = useCallback((preset) => {
    setBuilderStateFromPreset(
      props.builderState, preset, props.columnTypes)
  })

  return (
    <props.ui.PresetsContainer title="Chart type">
      <props.ui.GenericPickerWidget
        propType="chartType"
        propName="preset"
        widgetHint={"select"}
        label={"Preset"}
        value={null}
        setValue={setPreset}
        items={specConfig.PRESETS}
        advanced={false}
      />
    </props.ui.PresetsContainer>
  )
}
