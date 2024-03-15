import { ReactNode, memo, useCallback } from "react"

import { BuilderState } from "../BuilderState.ts"
import { ColumnTypes, Config, NamedMode } from "../configTypes.ts"
import { UIComponents, WithCustomState } from "../uiTypes.ts"
import { EncodingBuilder } from "./EncodingBuilder.tsx"
import { MarkBuilder } from "./MarkBuilder.tsx"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes,
  config: Config,
  state: BuilderState,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

function LayerBuilderRaw<S>({
  columnTypes,
  config,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const setCurrentLayer = useCallback((newIndex: number) => {
    state.selectLayer(newIndex)
  }, [state])

  const addLayer = useCallback(() => {
    state.createNewLayerAndSetAsCurrent()
  }, [state])

  const removeLayer = useCallback(() => {
    state.removeCurrentLayer()
  }, [state])

  const moveLayer = useCallback((newIndex: number) => {
    state.moveCurrentLayer(newIndex)
  }, [state])

  return (
    <ui.LayerBuilder>
      {namedViewMode[1].layers && (
        <ui.LayerPicker
          setCurrentLayer={setCurrentLayer}
          addLayer={addLayer}
          removeLayer={removeLayer}
          moveLayer={moveLayer}
          layers={state.value.layers}
          currentLayerIndex={state.value.currentLayerIndex}
        />
      )}

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
    </ui.LayerBuilder>
  )
}

export const LayerBuilder = memo(LayerBuilderRaw) as typeof LayerBuilderRaw
