import { ReactNode } from "react"

import {
  ChannelName,
  ColumnTypes,
  Config,
  EncodingConfig,
  EncodingState,
  NamedMode,
  UIComponents,
  WithCustomState,
} from "../types/index.ts"

import { showSection, filterSection } from "../modeParser.ts"

import { ChannelBuilder } from "./ChannelBuilder.tsx"
import { BuilderState } from "mintaka/hooks/useBuilderState.ts"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes,
  config: Config,
  state: BuilderState,
  encodingState: EncodingState,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

export function EncodingBuilder<S>({
  columnTypes,
  config,
  state,
  encodingState,
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
    (name) => config.selectChannel(name as ChannelName, state.getCurrentLayer()))

  if (!cleanedProps) return null

  const statePath = ["encoding"]

  return (
    <ui.EncodingContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedProps as EncodingConfig).map(([label, name]) => (
        <ChannelBuilder
          channelName={name}
          channelLabel={label}
          config={config}
          state={state}
          channelState={encodingState?.[name]}
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
