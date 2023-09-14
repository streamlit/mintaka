import { ReactNode, useState } from "react"
import isEmpty from "lodash/isEmpty"

import {
  BuilderState,
  Config,
  MarkPropertySetter,
  NamedMode,
  UIComponents,
  WithCustomState,
} from "../types"

import { filterSection } from "../modeParser"

export interface Props extends WithCustomState {
  config: Config,
  ui: UIComponents,
  state: BuilderState,
  makeSetter: MarkPropertySetter,
  namedViewMode: NamedMode,
}

export function MarkBuilder({
  config,
  ui,
  state,
  makeSetter,
  namedViewMode,
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
  }

  const cleanedProps = filterSection(
    "mark", config, namedViewMode,
    (name) => config.selectMarkProperty(name, state))

  if (!cleanedProps) return null

  const statePath = ["mark"]

  return (
    <ui.MarkContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedProps).map(([label, name]) => (
        <ui.GenericPickerWidget
          statePath={[...statePath, name]}
          widgetHint={uiParams[name]?.widgetHint ?? "json"}
          label={label}
          value={state.mark[name]}
          setValue={makeSetter(name)}
          items={config?.markPropertyValues?.[name]}
          viewMode={namedViewMode?.[0]}
          customState={customState}
          setCustomState={setCustomState}
          key={name}
        />
      ))}

    </ui.MarkContainer>
  )
}
