import React from "react"

import { UI_EXTRAS } from "../config.ts"

import { ChannelBuilder } from "./ChannelBuilder.tsx"


export function EncodingBuilder({
  advancedMode,
  columnTypes,
  smartHideProperties,
  state,
  ui,
  config,
}) {
  const columnsLabelsToNames = {
    "": null,
    ...Object.fromEntries(Object.keys(columnTypes)
      .map(c => [c, c]))
  }

  return (
    <ui.EncodingContainer>
      {Object.entries(config.encoding)
        .filter(([groupName]) => (
          advancedMode ? true : groupName == "basic"))
        .map(([groupName, groupItems]) => (
        <ui.EncodingGroup
          groupName={groupName}
          key={groupName}
        >
          {Object.entries(groupItems)
            .filter(([name]) =>
              config.selectChannel(name, state, smartHideProperties))
            .map(([name, channelSpec]) => (
              <ChannelBuilder
                channel={name}
                channelSpec={channelSpec}
                channelState={state.encoding[name]}
                groupName={groupName}
                makeSetter={state.getEncodingSetter(name)}
                config={config}
                ui={ui}
                smartHideProperties={smartHideProperties}
                columns={{
                  ...columnsLabelsToNames,
                  ...UI_EXTRAS[name]?.extraCols
                }}
                advancedMode={advancedMode}
                key={name}
              />
            ))
          }
        </ui.EncodingGroup>
      ))}
    </ui.EncodingContainer>
  )
}

