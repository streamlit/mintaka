import React, { useState } from "react"

import * as specConfig from "../specConfig.ts"

export function MarkBuilder({
  widgets,
  ui,
  state,
  makeSetter,
  //setProperty,
  smartHideProperties,
}) {
  const [advancedShown, showAdvanced] = useState(false)

  // TODO: Figure out better solution
  //const { state, setProperty } = markState
  const validValues = specConfig.MARK_PROPERTY_VALUES

  const uiParams = {
    align: { widgetHint: "select" },
    baseline: { widgetHint: "select" },
    filled: { widgetHint: "toggle" },
    interpolate: { widgetHint: "select" },
    line: { widgetHint: "toggle" },
    orient: { widgetHint: "select" },
    point: { widgetHint: "toggle" },
    shape: { widgetHint: "select" },
    type: { widgetHint: "select" },
    // strokeWidth: { label: "strokeWidth" },
    // strokeDash: { label: "strokeDash" },
  }

  const markProperties = Object.entries(widgets.mark)
    .filter(([name, _]) =>
      specConfig.keepMarkProperty(name, state.type, smartHideProperties))

  // TODO: Only show "show advanced" button if there *are* advanced options!

  return (
    <ui.MarkContainer title={"Mark"} showAdvanced={showAdvanced}>
      <ui.BasicMarkPropertiesContainer>
        {markProperties
          .filter(([_, propSpec]) => !propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              propType="mark-property"
              propName={name}
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
          .filter(([_, propSpec]) => propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              propType="mark-property"
              propName={name}
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
