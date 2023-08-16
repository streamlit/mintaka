import React from "react"

import { UI_EXTRAS } from "../config.ts"
import { shouldIncludeSection } from "../modeParser.ts"

import { ChannelBuilder } from "./ChannelBuilder.tsx"


export function EncodingBuilder({
  columnTypes,
  state,
  ui,
  config,
  viewMode,
}) {
  const columnsLabelsToNames = {
    "": null,
    ...Object.fromEntries(Object.keys(columnTypes)
      .map(c => [c, c]))
  }

  if (!shouldIncludeSection("encoding", viewMode)) {
    return null
  }

  return (
    <ui.EncodingContainer>

      {Object.entries(config.encoding)
        .filter(([groupName]) => (
          shouldIncludeSection(groupName, viewMode)))

        .map(([groupName, groupItems]) => (
          <ui.EncodingGroup
            groupName={groupName}
            key={groupName}
            viewMode={viewMode}
          >

            {Object.entries(groupItems)
              .filter(([name]) =>
                config.selectChannel(name, state))

              .map(([name, channelSpec]) => (
                <ChannelBuilder
                  channelName={name}
                  channelSpec={channelSpec}
                  groupName={groupName}
                  makeSetter={state.getEncodingSetter(name)}
                  config={config}
                  state={state}
                  ui={ui}
                  columns={{
                    ...columnsLabelsToNames,
                    ...UI_EXTRAS[name]?.extraCols
                  }}
                  viewMode={viewMode}
                  key={name}
                />
              ))
            }

          </ui.EncodingGroup>
        ))
      }
    </ui.EncodingContainer>
  )
}

