import React, { useState } from "react"

import * as specConfig from "../specConfig.ts"

export function ChannelBuilder({
  channel,
  channelState,
  makeSetter,
  widgets,
  ui,
  smartHideProperties,
  channelsToLabels,
  columns,
  types,
}): React.Node {
  const state = channelState ?? {}
  const { channels, channelProperties } = widgets
  const [advancedShown, showAdvanced] = useState(false)

  const validValues = specConfig.CHANNEL_PROPERTY_VALUES

  const uiParams = {
    aggregate: { widgetHint: "select" },
    bin: { widgetHint: "toggle" },
    binStep: { widgetHint: "number" },
    field: { widgetHint: "select", validValues: columns },
    legend: { widgetHint: "toggle" },
    sort: { widgetHint: "select" },
    sortBy: { widgetHint: "select", validValues: channelsToLabels},
    stack: { widgetHint: "select" },
    timeUnit: { widgetHint: "select" },
    type: { widgetHint: "select", validValues: prepareTypes(types, channel) },
    value: { widgetHint: "json" },
  }

  const desiredProperties = Object.entries(channelProperties)
    .filter(([name, _]) =>
      specConfig.keepChannelProperty(name, channel, state, smartHideProperties))

  return (
    <ui.ChannelContainer
      vlName={channel}
      title={channels[channel].label}
      expandedByDefault={!channels[channel].advanced}
      showAdvanced={showAdvanced}
    >
      <ui.BasicChannelPropertiesContainer>
        {desiredProperties
          .filter(([_, propSpec]) => !propSpec.advanced)
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
              advanced={false}
              key={name}
            />
          ))
        }
      </ui.BasicChannelPropertiesContainer>

      <ui.AdvancedChannelPropertiesContainer visible={advancedShown}>
        {desiredProperties
          .filter(([_, propSpec]) => propSpec.advanced)
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
              advanced={true}
              key={name}
            />
          ))
        }
      </ui.AdvancedChannelPropertiesContainer>

    </ui.ChannelContainer>
  )
}


function prepareTypes(types, channel) {
  const flippedTypes =
    Object.fromEntries(Object.entries(types).map(e => e.reverse()))

  if (channel != "geoshape") {
    return Object.fromEntries(
      Object.entries(flippedTypes).filter(([_, n]) => n != "geojson")
    )
  }

  return flippedTypes
}
