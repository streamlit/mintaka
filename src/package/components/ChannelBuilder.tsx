import React, { useState } from "react"

import { shouldIncludeGroup } from "../modeParser.ts"

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
}): React.Node {
  const channelState = state?.encoding?.[channelName] ?? {}
  const { channelProperties } = config

  // Some state for the developer to use however they want.
  const [uiState, setUIState] = useState(null)

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

  return (
    <ui.ChannelContainer
      vlName={channelName}
      title={channelSpec.label}
      groupName={channelGroupName}
      viewMode={viewMode}
      uiState={uiState}
      setUIState={setUIState}
    >

      {Object.entries(channelProperties)
        .filter(([groupName]) => (
          shouldIncludeGroup("channelProperties", groupName, viewMode)))
        .map(([groupName, groupItems]) => (
        <ui.ChannelPropertyGroup
          groupName={groupName}
          viewMode={viewMode}
          uiState={uiState}
          setUIState={setUIState}
          key={groupName}
        >

          {Object.entries(groupItems)
            .filter(([name]) =>
              config.selectChannelProperty(name, channelName, state))
            .map(([name, propSpec]) => (
              <ui.GenericPickerWidget
                propType="channel-property"
                parentName={channelName}
                propName={name}
                groupName={groupName}
                widgetHint={uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={channelState[name]}
                setValue={makeSetter(name)}
                items={uiParams[name]?.validValues ?? validValues?.[name]}
                placeholder={uiParams[name]?.placeholder ?? "Default"}
                uiState={uiState}
                setUIState={setUIState}
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
