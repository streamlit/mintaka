import React from "react"

import { MarkBuilder } from "./MarkBuilder.tsx"
import { EncodingBuilder } from "./EncodingBuilder.tsx"


export function LayerBuilder({
  columnTypes,
  smartHideProperties,
  state,
  ui,
  config,
}) {
  return (
    <ui.LayerContainer>
      <MarkBuilder
        config={config}
        state={state.mark}
        makeSetter={state.getMarkSetter}
        ui={ui}
        smartHideProperties={smartHideProperties}
      />

      <EncodingBuilder
        columnTypes={columnTypes}
        config={config}
        ui={ui}
        state={state}
        smartHideProperties={smartHideProperties}
      />
    </ui.LayerContainer>
  )
}
