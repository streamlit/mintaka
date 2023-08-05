import React, { useState } from "react"

export function ChannelBuilder({
  channel: channelName,
  channelSpec,
  channelState,
  columns,
  config,
  groupName: channelGroupName,
  makeSetter,
  smartHideProperties,
  ui,
}): React.Node {
  const state = channelState ?? {}
  const { channelProperties } = config

  // Useful variables for the developer.
  const hasSomethingSet = Object.values(state).some(v => v != null)
  const groupHasSomethingSet = Object.fromEntries(
    Object.entries(channelProperties).map(([groupName, groupItems]) =>
      [groupName, Object.keys(groupItems).some(k => state[k] != null)]
    )
  )

  // Some state for the developer to use however they want.
  const [uiState, setUIState] = useState(null)

  const validValues = config.channelPropertyValues

  const uiParams = {
    aggregate: { widgetHint: "select" },
    bin: { widgetHint: "toggle" },
    binStep: { widgetHint: "number" },
    field: { widgetHint: "select", validValues: columns },
    legend: { widgetHint: "toggle" },
    sort: { widgetHint: "select" },
    stack: { widgetHint: "select" },
    timeUnit: { widgetHint: "select" },
    type: {
      widgetHint: "select",
      validValues: prepareTypes(channelName, config.fieldTypes),
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
    >

      {Object.entries(channelProperties).map(([groupName, groupItems]) => (
        <ui.ChannelPropertiesContainer
          groupName={groupName}
          uiState={uiState}
          key={groupName}
          hasSomethingSet={groupHasSomethingSet[groupName]}
        >

          {Object.entries(groupItems)
            .filter(([name, _]) =>
              config.selectChannelProperty(name, channelName, state, smartHideProperties))
            .map(([name, propSpec]) => (
              <ui.GenericPickerWidget
                propType="channel-property"
                propName={name}
                widgetHint={uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={state[name]}
                setValue={makeSetter(name)}
                items={uiParams[name]?.validValues ?? validValues?.[name]}
                placeholder={uiParams[name]?.placeholder ?? "Default"}
                groupName={groupName}
                key={name}
              />
            ))
          }

        </ui.ChannelPropertiesContainer>
      ))}

    </ui.ChannelContainer>
  )
}


function prepareTypes(channelName, fieldTypes) {
  const flippedTypes =
    Object.fromEntries(Object.entries(fieldTypes).map(e => e.reverse()))

  if (channelName != "geoshape") {
    return Object.fromEntries(
      Object.entries(flippedTypes).filter(([_, n]) => n != "geojson")
    )
  }

  return flippedTypes
}
