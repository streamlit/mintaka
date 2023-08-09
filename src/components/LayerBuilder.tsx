import React from "react"

import { MarkBuilder } from "./MarkBuilder.tsx"
import { EncodingBuilder } from "./EncodingBuilder.tsx"


export function LayerBuilder({
  columnTypes,
  config,
  smartHideProperties,
  state,
  ui,
  advancedMode,
}) {
  return (
    <ui.LayerContainer>
      { advancedMode ? (
        <MarkBuilder
          config={config}
          makeSetter={state.getMarkSetter}
          smartHideProperties={smartHideProperties}
          state={state}
          ui={ui}
        />
      ) : null }

      <EncodingBuilder
        columnTypes={columnTypes}
        config={config}
        smartHideProperties={smartHideProperties}
        state={state}
        advancedMode={advancedMode}
        ui={ui}
      />
    </ui.LayerContainer>
  )
}
