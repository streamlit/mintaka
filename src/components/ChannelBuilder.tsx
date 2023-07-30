import React, { useState, useCallback } from "react"

import * as specConfig from "../specConfig.ts"
import { isElementOf } from "../array.ts"

const AGGREGATE_OPS = {
  "None": null,
  "Count": "count",
  "Sum": "sum",
  "Mean": "mean",
  "Std. deviation": "stdev",
  "Variance": "variance",
  "Min": "min",
  "Max": "max",
  "1st quartile": "q1",
  "Median": "median",
  "3rd quartile": "q3",
  "Distinct": "distinct",
  "Valid": "valid",
  "Missing": "missing",
}

const TIME_UNITS = {
  "Auto": null,
  "Milliseconds": "milliseconds",
  "Seconds": "seconds",
  "Minutes": "minutes",
  "Hours": "hours",
  "Day of the month": "date",
  "Day of year": "dayofyear",
  "Day of week": "day",
  "Week": "week",
  "Month": "month",
  "Quarter": "quarter",
  "Year": "year",
  "Year and quarter": "yearquarter",
  "Year and month": "yearmonth",
  "Year, month, date": "yearmonthdate",
}

const VALID_STACK_VALUES = {
  "True": null,
  "Normalize": "normalize",
  "False": false,
}

const VALID_LEGEND_VALUES = {
  "Off": false,
  "On": null,
}

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
  setChannelField,
  fields,
  channels,
  ui,
  smartHideFields,
  columns,
  types,
}): React.Node {
  const [advancedShown, showAdvanced] = useState(false)

  const makeSetter = (key: str) => {
    return (newValue: any) => setChannelField(key, newValue)
  }

  // The order of these items determines the order in the UI.
  // TODO: Replace with channels!
  const fieldUIParams = [
    { name: "field", widgetHint: "select", validValues: columns },
    { name: "value", widgetHint: "json" },
    { name: "type", widgetHint: "select", validValues: prepareTypes(types, channel) },
    { name: "aggregate", widgetHint: "select", validValues: AGGREGATE_OPS },
    { name: "binStep", widgetHint: "number", placeholder: "No binning" },
    { name: "stack", widgetHint: "select", validValues: VALID_STACK_VALUES },
    { name: "legend", widgetHint: "toggle", validValues: VALID_LEGEND_VALUES },
    { name: "timeUnit", widgetHint: "select", validValues: TIME_UNITS },
    { name: "title", widgetHint: "text" },
  ].filter(
    f => specConfig.shouldIncludeField(f.name, channelState, channel, fields, smartHideFields)
  )

  return (
    <ui.ChannelContainer
      vlName={channel}
      title={channels[channel].label}
      expandedByDefault={!channels[channel].advanced}
      showAdvanced={showAdvanced}
    >
      <ui.BasicFieldsContainer>
        {fieldUIParams
          .filter(f => !fields[f.name]?.advanced)
          .map(f => (
            <ui.GenericPickerWidget
              vlPropType="field"
              vlPropName={f.name}
              widgetHint={f.widgetHint}
              label={fields[f.name].label}
              value={channelState[f.name]}
              setValue={makeSetter(f.name)}
              items={f.validValues}
              placeholder={f.placeholder ?? "Default"}
              advanced={false}
              key={f.name}
            />
          ))
        }
      </ui.BasicFieldsContainer>

      <ui.AdvancedFieldsContainer visible={advancedShown}>
        {fieldUIParams
          .filter(f => !!fields[f.name]?.advanced)
          .map(f => (
            <ui.GenericPickerWidget
              vlPropType="field"
              vlPropName={f.name}
              widgetHint={f.widgetHint}
              label={fields[f.name].label}
              value={channelState[f.name]}
              setValue={makeSetter(f.name)}
              items={f.validValues}
              placeholder={f.placeholder ?? "Default"}
              advanced={true}
              key={f.name}
            />
          ))
        }
      </ui.AdvancedFieldsContainer>

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
