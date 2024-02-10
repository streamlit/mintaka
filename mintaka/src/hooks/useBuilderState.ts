import { useEffect, useState, useCallback, useMemo } from "react"

import {
  Config,
  ColumnTypes,
} from "../configTypes.ts"

import { InitialState, StateValue } from "../stateTypes.ts"
import { Presets } from "../presetTypes.ts"

import { BuilderState } from "../BuilderState.ts"

export function useBuilderState(
  columnTypes: ColumnTypes,
  config: Config,
  initialState?: InitialState,
  presets?: Presets,
): [BuilderState, StateValue] {
  const [stateValue, setStateValue] = useState<StateValue>({
    layers: [],
    currentLayerIndex: 0,
    preset: null,
  })

  const state = useMemo(() => (
    new BuilderState(
      columnTypes, config, initialState, presets,
      (v) => setStateValue(v))
  ), [columnTypes, config, initialState, presets, setStateValue])

  return [state, stateValue]
}