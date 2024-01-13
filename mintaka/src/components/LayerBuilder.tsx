import { ReactNode, useCallback } from "react"

import { MarkBuilder } from "./MarkBuilder.tsx"
import { EncodingBuilder } from "./EncodingBuilder.tsx"
import { BuilderState } from "../hooks/useBuilderState.ts"
import { ColumnTypes, Config, NamedMode } from "../configTypes.ts"
import { WithCustomState, UIComponents } from "../uiTypes.ts"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes,
  config: Config,
  state: BuilderState,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

export function LayerBuilder<S>({
  columnTypes,
  config,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const onLayerSelected = useCallback((ev: React.FormEvent<HTMLSelectElement>) => {
    const newLayerIndex = parseInt(ev.currentTarget.value, 10)
    state.selectLayer(newLayerIndex)
  }, [state])

  const addLayer = useCallback(() => {
    state.createNewLayer()
  }, [state])

  const removeLayer = useCallback(() => {
    state.removeCurrentLayer()
  }, [state])

  return (
    <ui.LayerContainer>
      <select onChange={onLayerSelected} key={state.currentLayerIndex}>
        {state.layers.map((layer, i) => {
          return <option value={i} key={i}>Layer {i}: {JSON.stringify(layer.mark.type || "blank")}</option>
        })}
      </select>
      <button onClick={addLayer}>Add layer</button>
      <button onClick={removeLayer}>Remove layer</button>

      <MarkBuilder
        config={config}
        state={state}
        markState={state.getCurrentLayer().mark}
        ui={ui}
        namedViewMode={namedViewMode}
        customState={customState}
        setCustomState={setCustomState}
      />

      <EncodingBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        encodingState={state.getCurrentLayer().encoding}
        namedViewMode={namedViewMode}
        ui={ui}
        customState={customState}
        setCustomState={setCustomState}
      />
    </ui.LayerContainer>
  )
}
