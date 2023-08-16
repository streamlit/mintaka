import React, { useState } from "react"

import { shouldIncludeSection } from "../modeParser.ts"

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

  // Useful variables for the developer.
  const hasSomethingSet = Object.values(channelState).some(v => v != null)
  const groupHasSomethingSet = Object.fromEntries(
    Object.entries(channelProperties).map(([groupName, groupItems]) =>
      [groupName, Object.keys(groupItems).some(k => channelState[k] != null)]
    )
  )

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
    stack: { widgetHint: "select" },
    timeUnit: { widgetHint: "select" },
    type: {
      widgetHint: "select",
      validValues: prepareTypes(channelName, config.channelPropertyValues.type),
    },
    value: { widgetHint: "json" },
  }

  return (
    <ui.ChannelContainer
      vlName={channelName}
      title={channelSpec.label}
      groupName={channelGroupName}
      setUIState={setUIState}
      hasSomethingSet={hasSomethingSet}
      groupHasSomethingSet={groupHasSomethingSet}
      viewMode={viewMode}
    >

      {Object.entries(channelProperties)
        .filter(([groupName]) => (
          shouldIncludeSection(groupName, viewMode)))
        .map(([groupName, groupItems]) => (
        <ui.ChannelPropertyGroup
          groupName={groupName}
          uiState={uiState}
          key={groupName}
          hasSomethingSet={groupHasSomethingSet[groupName]}
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
                widgetHint={propSpec.widgetHint ?? uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={channelState[name]}
                setValue={makeSetter(name)}
                items={uiParams[name]?.validValues ?? validValues?.[name]}
                placeholder={uiParams[name]?.placeholder ?? "Default"}
                groupName={groupName}
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
