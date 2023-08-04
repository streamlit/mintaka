import React from "react"

import * as specConfig from "../specConfig.ts"

import { ChannelBuilder } from "./ChannelBuilder.tsx"


export function EncodingBuilder({
  columnTypes,
  smartHideProperties,
  state,
  ui,
  widgets,
}) {
  const columnsLabelsToNames = {
    "None": null,
    ...Object.fromEntries(Object.keys(columnTypes)
      .map(c => [c, c]))
  }

  return (
    <ui.EncodingContainer>
      {Object.entries(widgets.encoding).map(([groupName, groupItems]) => (
        <ui.EncodingGroupContainer
          groupName={groupName}
          key={groupName}
        >
          {Object.entries(groupItems)
            .filter(([name]) => (
              specConfig.keepChannel(
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
                widgets={widgets}
                ui={ui}
                smartHideProperties={smartHideProperties}
                columns={{
                  ...columnsLabelsToNames,
                  ...specConfig.UI_EXTRAS[name]?.extraCols
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

