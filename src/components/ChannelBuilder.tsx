import React, { useState, useCallback } from "react"

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
  channelState,
  fields,
  channels,
  components,
  smartHideFields,
  columns,
  types,
}): React.Node {
  const { state, setComponent } = channelState.stateObj
  const [advancedShown, showAdvanced] = useState(false)

  const makeSetter = useCallback((key: str) => (
    (newValue: any) => setComponent(key, newValue)
  ), [setComponent])

  // The order of these items determines the order in the UI.
  const fieldUIMetadata = [
    { name: "field", widgetHint: "select", validValues: columns },
    { name: "value", widgetHint: "json" },
    { name: "type", widgetHint: "select", validValues: prepareTypes(types, channelState.channel) },
    { name: "aggregate", widgetHint: "select", validValues: AGGREGATE_OPS },
    { name: "binStep", widgetHint: "number", placeholder: "No binning" },
    { name: "stack", widgetHint: "select", validValues: VALID_STACK_VALUES },
    { name: "legend", widgetHint: "toggle", validValues: VALID_LEGEND_VALUES },
    { name: "timeUnit", widgetHint: "select", validValues: TIME_UNITS },
    { name: "title", widgetHint: "text" },
  ].filter(
    f => shouldIncludeField(f.name, state, channelState.channel, fields, smartHideFields)
  )

  return (
    <components.ChannelContainer
      vlName={channelState.channel}
      title={channels[channelState.channel].label}
      expandedByDefault={!channels[channelState.channel].advanced}
      showAdvanced={showAdvanced}
    >
      <components.BasicFieldsContainer>
        {fieldUIMetadata
          .filter(f => !fields[f.name]?.advanced)
          .map(f => (
            <components.GenericPickerWidget
              vlPropType="field"
              vlPropName={f.name}
              widgetHint={f.widgetHint}
              label={fields[f.name].label}
              value={state[f.name]}
              setValue={makeSetter(f.name)}
              key={f.name}
              items={f.validValues}
              placeholder={f.placeholder ?? "Default"}
              advanced={false}
            />
          ))
        }
      </components.BasicFieldsContainer>

      { advancedShown && (
        <components.AdvancedFieldsContainer>
          {fieldUIMetadata
            .filter(f => !!fields[f.name]?.advanced)
            .map(f => (
              <components.GenericPickerWidget
                vlPropType="field"
                vlPropName={f.name}
                widgetHint={f.widgetHint}
                label={fields[f.name].label}
                value={state[f.name]}
                setValue={makeSetter(f.name)}
                key={f.name}
                items={f.validValues}
                placeholder={f.placeholder ?? "Default"}
                advanced={true}
              />
            ))
          }
        </components.AdvancedFieldsContainer>
      )}

    </components.ChannelContainer>
  )
}


function prepareTypes(types, channel) {
  const flippedTypes =
    Object.fromEntries(Object.entries(types).map(e => e.reverse()))

  if (channel != "geoshape") {
    return Object.fromEntries(
      Object.entries(flippedTypes).filter((_, v) => v != "geojson")
    )
  }

  return flippedTypes
}


function shouldIncludeField(fieldName, state, channelName, fields, smartHideFields): boolean {
  if (fields[fieldName] == null) return false
  if (!smartHideFields) return true

  const fieldIsSet = !!state.field

  switch (fieldName) {
    case "field":
      return true

    case "value":
      return !fieldIsSet

    case "type":
    case "title":
      return fieldIsSet

    case "aggregate":
      return fieldIsSet && state.binStep == null

    case "binStep":
      return fieldIsSet && state.aggregate == null

    case "stack":
      return fieldIsSet && isElementOf(channelName, ["x", "y"])

    case "legend":
      return fieldIsSet && isElementOf(channelName, ["color", "size", "opacity"])

    case "timeUnit":
      return fieldIsSet && state.type == "temporal"

    default:
      return true
  }
}
