import { ReactNode } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  Mode,
} from "../types"

import { MarkBuilder } from "./MarkBuilder"
import { EncodingBuilder } from "./EncodingBuilder"

export interface Props {
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
}: Props): ReactNode {
  return (
    <ui.LayerContainer>
      <MarkBuilder
        config={config}
        makeSetter={state.getMarkSetter}
        state={state}
        ui={ui}
        viewMode={viewMode}
      />

      <EncodingBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        viewMode={viewMode}
        ui={ui}
      />
    </ui.LayerContainer>
  )
}
