import { ReactNode, useState } from "react"

import {
  BuilderState,
  Config,
  MarkPropertySetter,
  Mode,
  UIComponents,
  WithCustomState,
} from "../types"

import { shouldIncludeGroup } from "../modeParser"

export interface Props extends WithCustomState {
  config: Config,
  ui: UIComponents,
  state: BuilderState,
  makeSetter: MarkPropertySetter,
  viewMode: Mode,
}

export function MarkBuilder({
  config,
  ui,
  state,
  makeSetter,
  viewMode,
  customState,
  setCustomState,
}: Props): ReactNode {
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
      statePath="mark"
      groupName={null}
      viewMode={viewMode}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(config.mark)
        .filter(([groupName]) => (
          shouldIncludeGroup("mark", groupName, viewMode)))
        .map(([groupName, groupItems]) => (
        <ui.MarkPropertyGroup
          groupName={groupName}
          viewMode={viewMode}
          customState={customState}
          setCustomState={setCustomState}
          key={groupName}
        >

          {Object.entries(groupItems)
            .filter(([name]) =>
              config.selectMarkProperty(name, state))

            .map(([name, propSpec]) => (
              <ui.GenericPickerWidget
                statePath={`mark.${name}`}
                groupName={groupName}
                widgetHint={uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={state.mark[name]}
                setValue={makeSetter(name)}
                items={config?.markPropertyValues?.[name]}
                placeholder={uiParams[name]?.placeholder ?? "Default"}
                customState={customState}
                setCustomState={setCustomState}
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
