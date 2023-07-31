import React, { useState, useEffect } from "react"
import merge from "lodash/merge"

import * as specConfig from "../specConfig.ts"

import { BuilderPaneProps } from "./commonTypes.ts"
import { MarkBuilder } from "./MarkBuilder.tsx"
import { ChannelBuilder, useChannelState } from "./ChannelBuilder.tsx"


export function LayerBuilder(props: BuilderPaneProps) {
  const columnsLabelsToNames = {
    "None": null,
    ...Object.fromEntries(Object.keys(props.columnTypes)
      .map(c => [c, c]))
  }

  const selectedChannels = Object.entries(props.widgets.channels)
    .filter(([channel]) => (
      specConfig.keepChannel(
        channel, props.layerState.mark.state.type, props.smartHideProperties
      )
    ))

  const channelsToLabels = {
    "": specConfig.AUTO_FIELD,
    ...Object.fromEntries(selectedChannels
      .map(([name, propSpec]) => [propSpec.label, name]))
  }

  return (
    <props.ui.LayerContainer>
      <MarkBuilder
        widgets={props.widgets}
        state={props.layerState.mark.state}
        setProperty={props.layerState.mark.setProperty}
        ui={props.ui}
        smartHideProperties={props.smartHideProperties}
      />

      {selectedChannels
        .map(([channel]) => (
          <ChannelBuilder
            channel={channel}
            channelState={props.layerState.encoding.states[channel]}
            setChannelProperty={props.layerState.encoding.setProperty(channel)}
            widgets={props.widgets}
            channelsToLabels={channelsToLabels}
            ui={props.ui}
            smartHideProperties={props.smartHideProperties}
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
