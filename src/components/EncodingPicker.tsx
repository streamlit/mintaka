import React, { useState, useCallback } from 'react'

export function useEncodingState(initialState: Object) {
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
  components,
  title,
  encodingState,
  fields,
  types,
}): React.Node {
  const {state, setComponent} = encodingState

  const makeSetter = useCallback((key: str) => (
    (newValue: any) => setComponent(key, newValue)
  ), [setComponent])

  return (
    <components.WidgetGroup title={title}>
      <components.SelectBox
        label="Field"
        items={fields}
        value={state.field}
        setValue={makeSetter('field')}
      />

      {state.field == null ? (
        <components.TextBox
          label="Value"
          value={state.value}
          setValue={makeSetter('value')}
        />
      ) : (
        <components.SelectBox
          label="Type"
          items={types}
          value={state.type}
          setValue={makeSetter('type')}
        />
      )}
    </components.WidgetGroup>
  )
}
