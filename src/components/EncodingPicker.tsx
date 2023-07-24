import React, { useState, useCallback } from 'react'

const AGGREGATE_OPS = {
  "None": null,
  "Count": "count",
  "Distinct": "distinct",
  "Sum": "sum",
  "Mean": "mean",
  "Standard devation": "stdev",
  "Variance": "variance",
  "Min": "min",
  "Max": "max",
  "1st quartile": "q1",
  "Median (2nd quartile)": "median",
  "3rd quartile": "q3",
  "Missing": "missing",
  "Valid": "valid",
}

export function useEncodingState(origSpecEncoding: Object, fallbackState: Object) {
  const initialState = {...fallbackState, ...origSpecEncoding}

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

export function EncodingPicker({
  encodingInfo,
  components,
  fields,
  types,
  visibilityState
}): React.Node {
  const {state, setComponent} = encodingInfo.encodingState

  const makeSetter = useCallback((key: str) => (
    (newValue: any) => setComponent(key, newValue)
  ), [setComponent])

  return (
    <components.WidgetGroup
      title={encodingInfo.title}
      visibilityState={visibilityState}
    >
      <components.SelectBox
        label="Field"
        items={fields}
        value={state.field}
        setValue={makeSetter("field")}
        visibilityState={"expanded"}
      />

      {state.field == null ? (
        <components.TextBox
          label="Value"
          placeholder="Default"
          value={state.value}
          setValue={makeSetter("value")}
          visibilityState={"collapsed"}
        />

      ) : (

        <>
          <components.SelectBox
            label="Type"
            items={types}
            value={state.type}
            setValue={makeSetter("type")}
            visibilityState={"collapsed"}
          />

          {state.binStep == null ? (
            <components.SelectBox
              label="Aggregate"
              items={AGGREGATE_OPS}
              value={state.aggregate}
              setValue={makeSetter("aggregate")}
              visibilityState={"collapsed"}
            />
          ) : null}

          {state.aggregate == null ? (
            <components.TextBox
              label="Bin size"
              placeholder="No binning"
              value={state.binStep}
              setValue={makeSetter("binStep")}
              visibilityState={"collapsed"}
            />
          ) : null}

          {(encodingInfo.channel == "x" || encodingInfo.channel == "y") ? (
            <components.SelectBox
              label="Stack"
              items={{
                "True": null,
                "Normalize": "normalize",
                "False": false,
              }}
              value={state.stack}
              setValue={makeSetter("stack")}
              visibilityState={"collapsed"}
            />
          ) : null}
        </>

      )}
    </components.WidgetGroup>
  )
}
