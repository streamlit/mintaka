import React, { useState, useCallback } from "react"

import * as specConfig from "../specConfig.ts"

export function MarkBuilder({ widgets, ui, markState, smartHideProperties }) {
  const [advancedShown, showAdvanced] = useState(false)

  const { state, setProperty } = markState
  const validValues = specConfig.MARK_PROPERTY_VALUES

  const makeSetter = (key: str) => {
    return (newValue: any) => setProperty(key, newValue)
  }

  const uiParams = {
    type: { widgetHint: "select" },
    line: { widgetHint: "toggle" },
    point: { widgetHint: "toggle" },
    interpolate: { widgetHint: "select" },
    orient: { widgetHint: "select" },
    shape: { widgetHint: "select" },
    filled: { widgetHint: "toggle" },
    // size: { label: "Size" },
    // width: { label: "Width" },
    // height: { label: "Height" },
    // baseline: { label: "Baseline" },
    // angle: { label: "Angle" },
    // strokeWidth: { label: "strokeWidth" },
    // strokeDash: { label: "strokeDash" },
  }

  const markProperties = Object.entries(widgets.mark)
    .filter(([name, propSpec]) =>
      specConfig.keepMarkProperty(name, state.type, smartHideProperties))

  // TODO: Only show "show advanced" button if there *are* advanced options!

  return (
    <ui.MarkContainer title={"Mark"} showAdvanced={showAdvanced}>
      <ui.BasicMarkPropertiesContainer>
        {markProperties
          .filter(([name, propSpec]) => !propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="mark-property"
              vlPropName={name}
              widgetHint={uiParams[name]?.widgetHint ?? "json"}
              label={propSpec.label}
              value={state[name]}
              setValue={makeSetter(name)}
              items={uiParams[name]?.validValues ?? validValues[name]}
              placeholder={uiParams[name]?.placeholder ?? "Default"}
              advanced={false}
              key={name}
            />
          )
        )}
      </ui.BasicMarkPropertiesContainer>

      <ui.AdvancedMarkPropertiesContainer visible={advancedShown}>
        {markProperties
          .filter(([name, propSpec]) => propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="mark-property"
              vlPropName={name}
              widgetHint={uiParams[name]?.widgetHint ?? "json"}
              label={propSpec.label}
              value={state[name]}
              setValue={makeSetter(name)}
              items={uiParams[name]?.validValues ?? validValues[name]}
              placeholder={uiParams[name]?.placeholder ?? "Default"}
              advanced={false}
              key={name}
            />
          )
        )}
      </ui.AdvancedMarkPropertiesContainer>

    </ui.MarkContainer>
  )
}
