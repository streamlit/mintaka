import React, { useState, useCallback } from 'react'

export function useEncodingState(initialState: Object) {
  const [internalState, setInternalState] = useState(initialState)

  return useCallback({
    state: internalState,
    setComponent: (key: str, newValue: any) => {
      setInternalState({
        ...internalState,
        [key]: newValue,
      })
    },
  }, [internalState, setInternalState])
}

export function EncodingPicker({
  components,
  title,
  state,
  setComponent,
  encodingState,
  fields,
  types,
}): React.Node {
  //const {state, setComponent} = encodingState

  const makeSetter = useCallback((key: str) => (
    (newValue: any) => setComponent(key, newValue)
  ), [setComponent])

  return (
    <components.WidgetGroup title={title}>
      <components.WidgetWrapper>
        <components.Label>Field</components.Label>
        <components.SelectBox
          items={fields}
          value={state.field}
          setValue={makeSetter('field')}
        />
      </components.WidgetWrapper>

      {state.field == null ? (
        <components.WidgetWrapper>
          <components.Label>Value</components.Label>
          <components.TextBox
            value={state.value}
            setValue={makeSetter('value')}
          />
        </components.WidgetWrapper>
      ) : (
        <components.WidgetWrapper>
          <components.Label>Type</components.Label>
          <components.SelectBox
            items={types}
            value={state.type}
            setValue={makeSetter('type')}
          />
        </components.WidgetWrapper>
      )}
    </components.WidgetGroup>
  )
}
