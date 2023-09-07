import { ReactNode } from "react"

import {
  BuilderState,
  ColumnTypes,
  Config,
  Mode,
  UIComponents,
  WithCustomState,
} from "../types"

import { objectFrom, objectFilter, objectIsEmpty } from "../collectionUtils"
import { UI_EXTRAS } from "../config"
import { selectGroup } from "../modeParser"

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

  if (!selectGroup("encoding", null, viewMode)) {
    return null
  }

  const cleanedGroups = prepEncodingGroups(config, viewMode, state)

  return (
    <ui.EncodingContainer
      statePath="encoding"
      groupName={null}
      viewMode={viewMode}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedGroups).map(([groupName, groupItems]) => (
        <ui.EncodingGroup
          groupName={groupName}
          viewMode={viewMode}
          customState={customState}
          setCustomState={setCustomState}
          key={groupName}
        >

          {Object.entries(groupItems).map(([label, name]) => (
            <ChannelBuilder
              channelName={name}
              channelLabel={label}
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
          ))}

        </ui.EncodingGroup>
      ))}
    </ui.EncodingContainer>
  )
}

export function prepEncodingGroups(config: Config, viewMode: Mode, state: BuilderState) {
  return objectFrom(config.encoding, ([groupName, groupItems]) => {
    // Select groups according to current view mode.
    if (!selectGroup("encoding", groupName, viewMode)) return null

    // In each group, select channels according to current state.
    const filtered = objectFilter(groupItems,
      ([label, name]) => config.selectChannel(name, state))

    if (objectIsEmpty(filtered)) return null
    return [groupName, filtered]
  })
}
