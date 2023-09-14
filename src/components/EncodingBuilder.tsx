import { ReactNode } from "react"
import isEmpty from "lodash/isEmpty"

import {
  BuilderState,
  ColumnTypes,
  Config,
  NamedMode,
  UIComponents,
  WithCustomState,
} from "../types"

import { UI_EXTRAS } from "../config"
import { showSection, filterSection } from "../modeParser"

import { ChannelBuilder } from "./ChannelBuilder"

export interface Props extends WithCustomState {
  columnTypes: ColumnTypes,
  config: Config,
  state: BuilderState,
  ui: UIComponents,
  namedViewMode: NamedMode,
}

export function EncodingBuilder({
  columnTypes,
  config,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props): ReactNode {
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
    (name) => config.selectChannel(name, state))

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
          columns={{
            ...columnsLabelsToNames,
            ...UI_EXTRAS[name]?.extraCols,
          }}
          namedViewMode={namedViewMode}
          customState={customState}
          setCustomState={setCustomState}
          key={name}
        />
      ))}

    </ui.EncodingContainer>
  )
}
