import { ReactNode } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  Mode,
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
  viewMode: Mode,
}

export function LayerBuilder({
  columnTypes,
  config,
  state,
  ui,
  viewMode,
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
        viewMode={viewMode}
        customState={customState}
        setCustomState={setCustomState}
      />

      <EncodingBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        viewMode={viewMode}
        ui={ui}
        customState={customState}
        setCustomState={setCustomState}
      />
    </ui.LayerContainer>
  )
}
