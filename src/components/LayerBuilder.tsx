import React from "react"

import { MarkBuilder } from "./MarkBuilder.tsx"
import { EncodingBuilder } from "./EncodingBuilder.tsx"


export function LayerBuilder({
  columnTypes,
  smartHideProperties,
  state,
  ui,
  widgets,
}) {
  return (
    <ui.LayerContainer>
      <MarkBuilder
        widgets={widgets}
        state={state.mark}
        makeSetter={state.getMarkSetter}
        ui={ui}
        smartHideProperties={smartHideProperties}
      />

      <EncodingBuilder
        columnTypes={columnTypes}
        widgets={widgets}
        ui={ui}
        state={state}
        smartHideProperties={smartHideProperties}
      />
    </ui.LayerContainer>
  )
}
