import React, { useState } from "react"

export function ChannelBuilder({
  channel,
  channelSpec,
  channelState,
  groupName,
  makeSetter,
  config,
  ui,
  smartHideProperties,
  columns,
}): React.Node {
  const state = channelState ?? {}
  const { channelProperties } = config
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
      validValues: prepareTypes(channel, config.fieldTypes),
    },
    value: { widgetHint: "json" },
  }

  return (
    <ui.ChannelContainer
      vlName={channel}
      title={channelSpec.label}
      groupName={groupName}
      setUIState={setUIState}
    >

      {Object.entries(channelProperties).map(([groupName, groupItems]) => (
        <ui.ChannelPropertiesContainer
          groupName={groupName}
          uiState={uiState}
          key={groupName}
        >

          {Object.entries(groupItems)
            .filter(([name, _]) =>
              config.selectChannelProperty(name, channel, state, smartHideProperties))
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


function prepareTypes(channel, fieldTypes) {
  const flippedTypes =
    Object.fromEntries(Object.entries(fieldTypes).map(e => e.reverse()))

  if (channel != "geoshape") {
    return Object.fromEntries(
      Object.entries(flippedTypes).filter(([_, n]) => n != "geojson")
    )
  }

  return flippedTypes
}
