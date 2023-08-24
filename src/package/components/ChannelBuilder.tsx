import { useState, ReactNode } from "react"

import {
  BuilderState,
  ChannelConfig,
  Config,
  MarkPropertySetter,
  Mode,
  PlainRecord,
  UIComponents,
  WithCustomState,
} from "../types"

import { shouldIncludeGroup } from "../modeParser"

export interface Props extends WithCustomState {
  channelName: string,
  channelSpec: ChannelConfig,
  columns: PlainRecord<string | null>,
  config: Config,
  groupName: string,
  makeSetter: MarkPropertySetter,
  state: BuilderState,
  ui: UIComponents,
  viewMode: Mode,
}

export function ChannelBuilder({
  channelName,
  channelSpec,
  columns,
  config,
  groupName: channelGroupName,
  makeSetter,
  state,
  ui,
  viewMode,
  customState,
  setCustomState,
}): ReactNode {
  const channelState = state?.encoding?.[channelName] ?? {}
  const { channelProperties } = config

  const validValues = config.channelPropertyValues

  const uiParams = {
    aggregate: { widgetHint: "select" },
    binStep: { widgetHint: "number" },
    bin: { widgetHint: "select" },
    maxBins: { widgetHint: "number" },
    field: { widgetHint: "multiselect", validValues: columns },
    legend: { widgetHint: "toggle" },
    sort: { widgetHint: "select" },
    scheme: { widgetHint: "select" },
    scaleType: { widgetHint: "select" },
    stack: { widgetHint: "select" },
    timeUnit: { widgetHint: "select" },
    type: {
      widgetHint: "select",
      validValues: prepareTypes(channelName, config.channelPropertyValues.type),
    },
    value: { widgetHint: "json" },
    zero: { widgetHint: "select" },
  }

  const basePath = `encoding.${channelName}`

  return (
    <ui.ChannelContainer
      title={channelSpec.label}
      statePath={basePath}
      groupName={channelGroupName}
      viewMode={viewMode}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(channelProperties)
        .filter(([groupName]) => (
          shouldIncludeGroup("channelProperties", groupName, viewMode)))
        .map(([groupName, groupItems]) => (
        <ui.ChannelPropertyGroup
          statePath={basePath}
          groupName={groupName}
          viewMode={viewMode}
          customState={customState}
          setCustomState={setCustomState}
          key={groupName}
        >

          {Object.entries(groupItems)
            .filter(([name]) =>
              config.selectChannelProperty(name, channelName, state))
            .map(([name, propSpec]) => (
              <ui.GenericPickerWidget
                statePath={basePath}
                groupName={groupName}
                widgetHint={uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={channelState[name]}
                setValue={makeSetter(name)}
                items={uiParams[name]?.validValues ?? validValues?.[name]}
                placeholder={uiParams[name]?.placeholder ?? "Default"}
                customState={customState}
                setCustomState={setCustomState}
                key={name}
              />
            ))
          }

        </ui.ChannelPropertyGroup>
      ))}

    </ui.ChannelContainer>
  )
}


function prepareTypes(channelName, fieldTypes) {
  if (channelName != "geoshape") {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(fieldTypes).filter(([_, n]) => n != "geojson")
    )
  }

  return fieldTypes
}
