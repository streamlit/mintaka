import React, { ReactNode } from "react"

import {
  BuilderState,
  ChannelName,
  ColumnTypes,
  Config,
  NamedMode,
  UIComponents,
  WithCustomState,
} from "../types"

import { showSection, filterSection } from "../modeParser"

import { ChannelBuilder } from "./ChannelBuilder"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes,
  config: Config,
  state: BuilderState,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

export function EncodingBuilder<S>({
  columnTypes,
  config,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const columnsLabelsToNames = {
    "": null,
    ...Object.fromEntries(Object.keys(columnTypes)
      .map(c => [c, c]))
  }

  if (!showSection("encoding", namedViewMode)) {
    return null
  }

  const cleanedProps = filterSection(
    "encoding", config, namedViewMode,
    (name) => config.selectChannel(name as ChannelName, state))

  if (!cleanedProps) return null

  const statePath = ["encoding"]

  return (
    <ui.EncodingContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedProps).map(([label, name]) => (
        <ChannelBuilder
          channelName={name}
          channelLabel={label}
          makeSetter={state.getEncodingSetter(name)}
          config={config}
          state={state}
          statePath={statePath}
          ui={ui}
          columns={columnsLabelsToNames}
          namedViewMode={namedViewMode}
          customState={customState}
          setCustomState={setCustomState}
          key={name}
        />
      ))}

    </ui.EncodingContainer>
  )
}
