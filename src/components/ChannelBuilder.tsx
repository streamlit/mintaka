import React, { useState } from "react"

import * as specConfig from "../specConfig.ts"

export function ChannelBuilder({
  channel,
  channelSpec,
  channelState,
  groupName,
  makeSetter,
  widgets,
  ui,
  smartHideProperties,
  columns,
}): React.Node {
  const state = channelState ?? {}
  const { channelProperties } = widgets
  const [uiState, setUIState] = useState(null)

  const validValues = specConfig.CHANNEL_PROPERTY_VALUES

  const uiParams = {
    aggregate: { widgetHint: "select" },
    bin: { widgetHint: "toggle" },
    binStep: { widgetHint: "number" },
    field: { widgetHint: "select", validValues: columns },
    legend: { widgetHint: "toggle" },
    sort: { widgetHint: "select" },
    stack: { widgetHint: "select" },
    timeUnit: { widgetHint: "select" },
    type: { widgetHint: "select", validValues: prepareTypes(channel) },
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
              specConfig.keepChannelProperty(name, channel, state, smartHideProperties))
            .map(([name, propSpec]) => (
              <ui.GenericPickerWidget
                propType="channel-property"
                propName={name}
                widgetHint={uiParams[name]?.widgetHint ?? "json"}
                label={propSpec.label}
                value={state[name]}
                setValue={makeSetter(name)}
                items={uiParams[name]?.validValues ?? validValues[name]}
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


function prepareTypes(channel) {
  const types = specConfig.FIELD_TYPES

  const flippedTypes =
    Object.fromEntries(Object.entries(types).map(e => e.reverse()))

  if (channel != "geoshape") {
    return Object.fromEntries(
      Object.entries(flippedTypes).filter(([_, n]) => n != "geojson")
    )
  }

  return flippedTypes
}
