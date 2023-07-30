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
  const state = channelState
  const [advancedShown, showAdvanced] = useState(false)

  const makeSetter = (key: str) => {
    return (newValue: any) => setChannelField(key, newValue)
  }

  const fieldUIParams = {
    field: { widgetHint: "select", validValues: columns },
    value: { widgetHint: "json" },
    type: { widgetHint: "select", validValues: prepareTypes(types, channel) },
    aggregate: { widgetHint: "select", validValues: AGGREGATE_OPS },
    binStep: { widgetHint: "number", placeholder: "No binning" },
    stack: { widgetHint: "select", validValues: VALID_STACK_VALUES },
    legend: { widgetHint: "toggle", validValues: VALID_LEGEND_VALUES },
    timeUnit: { widgetHint: "select", validValues: TIME_UNITS },
    title: { widgetHint: "text" },
  }

  const desiredFields = Object.entries(fields) // rename channels to encoding
    .filter(([name, fieldSpec]) =>
      specConfig.shouldIncludeField(name, channel, state, fields, smartHideFields))

  return (
    <ui.ChannelContainer
      vlName={channel}
      title={channels[channel].label}
      expandedByDefault={!channels[channel].advanced}
      showAdvanced={showAdvanced}
    >
      <ui.BasicFieldsContainer>
        {desiredFields
          .filter(([name, fieldSpec]) => !fieldSpec.advanced)
          .map(([name, fieldSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="field"
              vlPropName={name}
              widgetHint={fieldUIParams[name]?.widgetHint ?? "json"}
              label={fieldSpec.label}
              value={state[name]}
              setValue={makeSetter(name)}
              items={fieldUIParams[name]?.validValues}
              placeholder={fieldUIParams[name]?.placeholder ?? "Default"}
              advanced={false}
              key={name}
            />
          ))
        }
      </ui.BasicFieldsContainer>

      <ui.AdvancedFieldsContainer visible={advancedShown}>
        {desiredFields
          .filter(([name, fieldSpec]) => fieldSpec.advanced)
          .map(([name, fieldSpec]) => (
            <ui.GenericPickerWidget
              vlPropType="field"
              vlPropName={name}
              widgetHint={fieldUIParams[name]?.widgetHint ?? "json"}
              label={fieldSpec.label}
              value={state[name]}
              setValue={makeSetter(name)}
              items={fieldUIParams[name]?.validValues}
              placeholder={fieldUIParams[name]?.placeholder ?? "Default"}
              advanced={true}
              key={name}
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
