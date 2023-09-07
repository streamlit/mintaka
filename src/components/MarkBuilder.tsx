import { ReactNode, useState } from "react"

import {
  BuilderState,
  Config,
  MarkPropertySetter,
  Mode,
  UIComponents,
  WithCustomState,
} from "../types"

import { objectFrom, objectFilter, objectIsEmpty } from "../collectionUtils"
import { selectGroup } from "../modeParser"

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
  }

  if (!selectGroup("mark", null, viewMode)) {
    return null
  }

  const cleanedGroups = prepMarkGroups(config, viewMode, state)

  return (
    <ui.MarkContainer
      statePath="mark"
      groupName={null}
      viewMode={viewMode}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedGroups).map(([groupName, groupItems]) => (
        <ui.MarkPropertyGroup
          groupName={groupName}
          viewMode={viewMode}
          customState={customState}
          setCustomState={setCustomState}
          key={groupName}
        >

          {Object.entries(groupItems).map(([label, name]) => (
            <ui.GenericPickerWidget
              statePath={`mark.${name}`}
              groupName={groupName}
              widgetHint={uiParams[name]?.widgetHint ?? "json"}
              label={label}
              value={state.mark[name]}
              setValue={makeSetter(name)}
              items={config?.markPropertyValues?.[name]}
              customState={customState}
              setCustomState={setCustomState}
              key={name}
            />
          ))}

        </ui.MarkPropertyGroup>
      ))}

    </ui.MarkContainer>
  )
}

export function prepMarkGroups(config: Config, viewMode: Mode, state: BuilderState) {
  return objectFrom(config.mark, ([groupName, groupItems]) => {
    // Select groups according to current view mode.
    if (!selectGroup("mark", groupName, viewMode)) return null

    // In each group select properties according to current state.
    const filtered = objectFilter(groupItems,
      ([label, name]) => config.selectMarkProperty(name, state))

    if (objectIsEmpty(filtered)) return null
    return [groupName, filtered]
  })
}
