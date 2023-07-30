import React, { useState, useCallback } from "react"

import * as specConfig from "../specConfig.ts"

export function MarkBuilder({ mark, ui, markState }) {
  const [advancedShown, showAdvanced] = useState(false)

  const { state, setProperty } = markState
  const validValues = specConfig.MARK_VALUES

  const makeSetter = (key: str) => {
    return (newValue: any) => setProperty(key, newValue)
  }

  const propertyUIParams = {
    type: { widgetHint: "select" },
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

  const markProperties = Object.entries(mark)
    .filter(([name, propSpec]) =>
      specConfig.shouldIncludeProperty(name, state.type))

  // TODO: Only show "show advanced" button if there *are* advanced options!

  return (
    <ui.MarkContainer title={"Mark"} showAdvanced={showAdvanced}>
      <ui.BasicFieldsContainer>
        {markProperties
          .filter(([name, propSpec]) => !propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="mark"
              vlPropName={name}
              widgetHint={propertyUIParams[name]?.widgetHint ?? "json"}
              label={propSpec.label}
              value={state[name]}
              setValue={makeSetter(name)}
              items={validValues[name]}
              placeholder={propertyUIParams[name]?.placeholder ?? "Default"}
              advanced={false}
              key={name}
            />
          )
        )}
      </ui.BasicFieldsContainer>

      <ui.AdvancedFieldsContainer visible={advancedShown}>
        {markProperties
          .filter(([name, propSpec]) => propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="mark"
              vlPropName={name}
              widgetHint={propertyUIParams[name]?.widgetHint ?? "json"}
              label={propSpec.label}
              value={state[name]}
              setValue={makeSetter(name)}
              items={validValues[name]}
              placeholder={propertyUIParams[name]?.placeholder ?? "Default"}
              advanced={false}
              key={name}
            />
          )
        )}
      </ui.AdvancedFieldsContainer>

    </ui.MarkContainer>
  )
}
