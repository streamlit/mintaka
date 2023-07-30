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
        widgets={props.widgets}
        markState={props.layerState.mark}
        ui={props.ui}
        smartHideProperties={props.smartHideProperties}
      />

      {Object.keys(props.widgets.channels)
        .filter(channel => (
          specConfig.keepChannel(
            channel, props.layerState.markType, props.smartHideProperties
          )
        ))
        .map(channel => (
          <ChannelBuilder
            channel={channel}
            channelState={props.layerState.encoding.states[channel]}
            setChannelProperty={props.layerState.encoding.setProperty(channel)}
            widgets={props.widgets}
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
