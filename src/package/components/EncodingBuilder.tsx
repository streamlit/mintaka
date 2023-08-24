import { ReactNode } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  Mode,
  UIComponents,
  WithCustomState,
} from "../types"

import { UI_EXTRAS } from "../config"
import { shouldIncludeGroup } from "../modeParser"

import { ChannelBuilder } from "./ChannelBuilder"

export interface Props extends WithCustomState {
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
  customState,
  setCustomState,
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
    <ui.EncodingContainer
      title="Encoding"
      statePath="encoding"
      groupName={null}
      viewMode={viewMode}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(config.encoding)
        .filter(([groupName]) => (
          shouldIncludeGroup("encoding", groupName, viewMode)))

        .map(([groupName, groupItems]) => (
          <ui.EncodingGroup
            groupName={groupName}
            viewMode={viewMode}
            customState={customState}
            setCustomState={setCustomState}
            key={groupName}
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
                  customState={customState}
                  setCustomState={setCustomState}
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

