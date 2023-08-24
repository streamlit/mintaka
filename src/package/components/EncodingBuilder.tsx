import { ReactNode } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  Mode,
} from "../types"

import { UI_EXTRAS } from "../config"
import { shouldIncludeGroup } from "../modeParser"

import { ChannelBuilder } from "./ChannelBuilder"

export interface Props {
  columnTypes: ColumnTypes,
  config: Config,
  state: BuilderState,
  ui: UIComponents,
  viewMode: Mode,
}

export function EncodingBuilder({
  columnTypes,
  config,
  state,
  ui,
  viewMode,
}: Props): ReactNode {
  const columnsLabelsToNames = {
    "": null,
    ...Object.fromEntries(Object.keys(columnTypes)
      .map(c => [c, c]))
  }

  if (!shouldIncludeGroup("encoding", null, viewMode)) {
    return null
  }

  return (
    <ui.EncodingContainer>

      {Object.entries(config.encoding)
        .filter(([groupName]) => (
          shouldIncludeGroup("encoding", groupName, viewMode)))

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

