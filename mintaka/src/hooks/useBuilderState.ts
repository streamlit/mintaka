import { useEffect, useState, useCallback } from "react"

import {
  Config,
  ColumnTypes,
} from "../configTypes.ts"

import { InitialState } from "../stateTypes.ts"
import { Presets } from "../presetTypes.ts"

import { BuilderState } from "../BuilderState.ts"

export function useBuilderState(
  columnTypes: ColumnTypes,
  config: Config,
  initialState?: InitialState,
  presets?: Presets,
): [number, BuilderState] {
  const [changeNum, setChangeNum] = useState(0)

  const [state] = useState(() => new BuilderState(
    columnTypes, config, initialState, presets))

  state.onChange = useCallback(() => {
    setChangeNum(changeNum + 1)
  }, [
    setChangeNum,
    changeNum,
  ])

  useEffect(() => {
    state.columnTypes = columnTypes
    state.config = config
    state.initialState = initialState
    state.presets = presets
    state.reset()
  }, [columnTypes, config, initialState, presets, state])

  return [changeNum, state]
}