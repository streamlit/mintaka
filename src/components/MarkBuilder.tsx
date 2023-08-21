import React, { useState } from "react"

import { shouldIncludeGroup } from "../modeParser.ts"

export function MarkBuilder({
  config,
  ui,
  state,
  makeSetter,
  viewMode,
}) {
  // Some state for the developer to use however they want.
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

  if (!shouldIncludeGroup("mark", null, viewMode)) {
    return null
  }

  // TODO: Only show "show advanced" button if there *are* advanced options!

  return (
    <ui.MarkContainer
      title={"Mark"}
      uiState={uiState}
      setUIState={setUIState}
      viewMode={viewMode}
    >

      {Object.entries(config.mark)
        .filter(([groupName]) => (
          shouldIncludeGroup("mark", groupName, viewMode)))
        .map(([groupName, groupItems]) => (
        <ui.MarkPropertyGroup
          groupName={groupName}
          viewMode={viewMode}
          uiState={uiState}
          setUIState={setUIState}
          key={groupName}
        >

          {Object.entries(groupItems)
            .filter(([name]) =>
              config.selectMarkProperty(name, state))

            .map(([name, propSpec]) => (
              <ui.GenericPickerWidget
                propType="mark-property"
                parentName={"mark"}
                propName={name}
                groupName={groupName}
                widgetHint={uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={state.mark[name]}
                setValue={makeSetter(name)}
                items={config?.markPropertyValues?.[name]}
                placeholder={uiParams[name]?.placeholder ?? "Default"}
                uiState={uiState}
                setUIState={setUIState}
                key={name}
              />
            )
          )}

        </ui.MarkPropertyGroup>
      ))
      }

    </ui.MarkContainer>
  )
}
