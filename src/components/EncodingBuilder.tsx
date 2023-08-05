import React from "react"

import { UI_EXTRAS } from "../config.ts"

import { ChannelBuilder } from "./ChannelBuilder.tsx"


export function EncodingBuilder({
  columnTypes,
  smartHideProperties,
  state,
  ui,
  config,
}) {
  const columnsLabelsToNames = {
    "None": null,
    ...Object.fromEntries(Object.keys(columnTypes)
      .map(c => [c, c]))
  }

  return (
    <ui.EncodingContainer>
      {Object.entries(config.encoding).map(([groupName, groupItems]) => (
        <ui.EncodingGroupContainer
          groupName={groupName}
          key={groupName}
        >
          {Object.entries(groupItems)
            .filter(([name]) => (
              config.selectChannel(
                name, state.mark.type, smartHideProperties
              )
            ))
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
                key={name}
              />
            ))
          }
        </ui.EncodingGroupContainer>
      ))}
    </ui.EncodingContainer>
  )
}

