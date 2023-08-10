import React from "react"

import { MarkBuilder } from "./MarkBuilder.tsx"
import { EncodingBuilder } from "./EncodingBuilder.tsx"


export function LayerBuilder({
  columnTypes,
  config,
  state,
  ui,
  viewMode,
}) {
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
