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
  channelFields,
  encodingChannels,
  components,
  fields,  // Rename to columns
  types,
  importance
}): React.Node {
  const {state, setComponent} = channelState.stateObj

  const makeSetter = useCallback((key: str) => (
    (newValue: any) => setComponent(key, newValue)
  ), [setComponent])

  // The order of these items determines the order in the UI.
  const allSupportedFields = [
    { name: "field", importance: "high", widgetHint: "select", validValues: fields },
    { name: "value", widgetHint: "json" },
    { name: "type", widgetHint: "select", validValues: types },
    { name: "aggregate", widgetHint: "select", validValues: AGGREGATE_OPS },
    { name: "binStep", widgetHint: "number", placeholder: "No binning" },
    { name: "stack", widgetHint: "select", validValues: VALID_STACK_VALUES },
    { name: "legend", widgetHint: "toggle", validValues: VALID_LEGEND_VALUES },
    { name: "timeUnit", widgetHint: "select", validValues: TIME_UNITS },
    { name: "title", widgetHint: "text" },
  ]

  return (
    <components.WidgetGroup
      title={encodingChannels[channelState.channel]}
      importance={importance}
    >
      {allSupportedFields
        .filter(
          f => shouldIncludeField(f.name, state, channelState.channel, channelFields)
        ).map(f => (
        <components.GenericPickerWidget
          name={`field-${f.name}`}
          widgetHint={f.widgetHint}
          label={channelFields[f.name]}
          value={state[f.name]}
          setValue={makeSetter(f.name)}
          importance={f.importance ?? "low"}
          key={f.name}
          items={f.validValues}
          placeholder={f.placeholder ?? "Default"}
        />
      ))}
    </components.WidgetGroup>
  )
}


function shouldIncludeField(fieldName, state, channelName, channelFields): boolean {
  if (channelFields[fieldName] == null) return false

  const fieldIsSet = !state.field

  switch (fieldName) {
    case "field":
      return true

    case "value":
      return fieldIsSet

    case "type":
    case "title":
      return !fieldIsSet

    case "aggregate":
      return !fieldIsSet && state.binStep == null

    case "binStep":
      return !fieldIsSet && state.aggregate == null

    case "stack":
      return !fieldIsSet && isElementOf(channelName, ["x", "y"])

    case "legend":
      return !fieldIsSet && isElementOf(channelName, ["color", "size", "opacity"])

    case "timeUnit":
      return !fieldIsSet && state.type == "temporal"

    default:
      return true
  }
}
