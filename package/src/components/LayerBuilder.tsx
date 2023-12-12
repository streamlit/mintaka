import React, { ReactNode } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  NamedMode,
  UIComponents,
  WithCustomState,
} from "../types/index.ts"

import { MarkBuilder } from "./MarkBuilder.tsx"
import { EncodingBuilder } from "./EncodingBuilder.tsx"

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
