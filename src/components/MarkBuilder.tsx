import React, { useState } from "react"

export function MarkBuilder({
  config,
  ui,
  state,
  makeSetter,
  //setProperty,
  smartHideProperties,
}) {
  const [uiState, setUIState] = useState(null)

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
    tooltip: { widgetHint: "toggle" },
    // strokeWidth: { label: "strokeWidth" },
    // strokeDash: { label: "strokeDash" },
  }

  // TODO: Only show "show advanced" button if there *are* advanced options!

  return (
    <ui.MarkContainer
      title={"Mark"}
      setUIState={setUIState}
    >

      {Object.entries(config.mark).map(([groupName, groupItems]) => (
        <ui.MarkPropertiesContainer
          groupName={groupName}
          uiState={uiState}
          key={groupName}
        >

          {Object.entries(groupItems)
            .filter(([name, _]) =>
              config.selectMarkProperty(name, state, smartHideProperties))
            .map(([name, propSpec]) => (
              <ui.GenericPickerWidget
                propType="mark-property"
                propName={name}
                widgetHint={uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={state[name]}
                setValue={makeSetter(name)}
                items={config?.markPropertyValues?.[name]}
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
