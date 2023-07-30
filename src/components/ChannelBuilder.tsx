import React, { useState, useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { isElementOf } from "../array.ts"

export function useChannelState(origChannelSpec: Object, fallbackState: Object) {
  const initialState = {...fallbackState, ...origChannelSpec}

  const [internalState, setInternalState] = useState(initialState)

  return {
    state: internalState,
    setComponent: (key: str, newValue: any) => {
      setInternalState({
        ...internalState,
        [key]: newValue,
      })
    },
  }
}

export function ChannelBuilder({
  channel,
  channelState,
  setChannelProperty,
  widgets,
  ui,
  smartHideProperties,
  channelsToLabels,
  columns,
  types,
}): React.Node {
  const state = channelState
  const { channels, channelProperties } = widgets
  const [advancedShown, showAdvanced] = useState(false)

  const makeSetter = (key: str) => {
    return (newValue: any) => setChannelProperty(key, newValue)
  }

  const validValues = specConfig.CHANNEL_PROPERTY_VALUES

  const uiParams = {
    aggregate: { widgetHint: "select" },
    binStep: { widgetHint: "number", placeholder: "No binning" },
    field: { widgetHint: "select", validValues: columns },
    legend: { widgetHint: "toggle" },
    sort: { widgetHint: "select" },
    sortBy: { widgetHint: "select", validValues: channelsToLabels},
    stack: { widgetHint: "select" },
    timeUnit: { widgetHint: "select" },
    title: { widgetHint: "text" },
    type: { widgetHint: "select", validValues: prepareTypes(types, channel) },
    value: { widgetHint: "json" },
  }

  const desiredProperties = Object.entries(channelProperties)
    .filter(([name, propSpec]) =>
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
          .filter(([name, propSpec]) => !propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="channel-property"
              vlPropName={name}
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
          .filter(([name, propSpec]) => propSpec.advanced)
          .map(([name, propSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="channel-property"
              vlPropName={name}
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
