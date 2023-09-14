import { ReactNode } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  NamedMode,
  UIComponents,
  WithCustomState,
} from "../types"

import { MarkBuilder } from "./MarkBuilder"
import { EncodingBuilder } from "./EncodingBuilder"

export interface Props extends WithCustomState {
  columnTypes: ColumnTypes,
  config: Config,
  state: BuilderState,
  ui: UIComponents,
  namedViewMode: NamedMode,
}

export function LayerBuilder({
  columnTypes,
  config,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props): ReactNode {
  return (
    <ui.LayerContainer>
      <MarkBuilder
        config={config}
        makeSetter={state.getMarkSetter}
        state={state}
        ui={ui}
        namedViewMode={namedViewMode}
        customState={customState}
        setCustomState={setCustomState}
      />

      <EncodingBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        namedViewMode={namedViewMode}
        ui={ui}
        customState={customState}
        setCustomState={setCustomState}
      />
    </ui.LayerContainer>
  )
}
