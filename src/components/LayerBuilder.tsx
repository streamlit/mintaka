import React, { useState, useEffect } from "react"
import merge from "lodash/merge"

import * as specConfig from "../specConfig.ts"

import { BuilderPaneProps } from "./commonTypes.ts"
import { MarkBuilder } from "./MarkBuilder.tsx"
import { ChannelBuilder, useChannelState } from "./ChannelBuilder.tsx"


export function LayerBuilder(props: BuilderPaneProps) {

  const columnsLabelsToNames = { "None": null }
  props.columns.forEach(s => columnsLabelsToNames[s.colName] = s.colName)

  return (
    <props.ui.LayerContainer>
      <MarkBuilder
        mark={props.mark}
        markState={props.layerState.mark}
        ui={props.ui}
      />

      {Object.keys(props.channels)
        .filter(channel => (
          specConfig.shouldIncludeChannel(
            channel, props.layerState.markType
          )
        ))
        .map(channel => (
          <ChannelBuilder
            channel={channel}
            channelState={props.layerState.encoding.states[channel]}
            setChannelField={props.layerState.encoding.setField(channel)}
            fields={props.fields}
            channels={props.channels}
            ui={props.ui}
            smartHideFields={props.smartHideFields ?? true}
            columns={{
              ...columnsLabelsToNames,
              ...specConfig.UI_EXTRAS[channel]?.extraCols
            }}
            types={specConfig.FIELD_TYPES}
            key={channel}
          />
        ))
      }
    </props.ui.LayerContainer>
  )
}
