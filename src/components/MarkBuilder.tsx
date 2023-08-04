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
  const [uiState, setUIState] = useState(null)

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

  // TODO: Only show "show advanced" button if there *are* advanced options!

  return (
    <ui.MarkContainer
      title={"Mark"}
      setUIState={setUIState}
    >

      {Object.entries(widgets.mark).map(([groupName, groupItems]) => (
        <ui.MarkPropertiesContainer
          groupName={groupName}
          uiState={uiState}
          key={groupName}
        >

          {Object.entries(groupItems)
            .filter(([name, _]) =>
              specConfig.keepMarkProperty(name, state.type, smartHideProperties))
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
                groupName={groupName}
                key={name}
              />
            )
          )}

        </ui.MarkPropertiesContainer>
      ))}

    </ui.MarkContainer>
  )
}
