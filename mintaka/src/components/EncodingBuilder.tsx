import { ReactNode } from "react"

import {
  BuilderState,
  ChannelName,
  ColumnTypes,
  Config,
  NamedMode,
  UIComponents,
  WithCustomState,
} from "../types/index.ts"

import { showSection, filterSection } from "../modeParser.ts"

import { ChannelBuilder } from "./ChannelBuilder.tsx"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes,
  config: Config,
  layer: LayerState,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

export function EncodingBuilder<S>({
  columnTypes,
  config,
  layer,
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
    (name) => config.selectChannel(name as ChannelName, layer))

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
          makeSetter={layer.getEncodingSetter(name)}
          config={config}
          layer={layer}
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
