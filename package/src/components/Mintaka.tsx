import React, { ReactNode, useEffect, useCallback, useState, useMemo } from "react"

import {
  BuilderState,
  ChannelPropertiesConfig,
  ChannelPropertyValuesConfig,
  ColumnTypes,
  Config,
  EncodingConfig,
  MarkConfig,
  MarkPropertyValuesConfig,
  ModeConfig,
  Presets,
  SelectChannelFunc,
  SelectChannelPropertyFunc,
  SelectMarkPropertyFunc,
  UIComponents,
  UtilBlockProps,
  VLSpec,
} from "../types"

import * as configDefaults from "../config"
import { generateVegaSpec, DEFAULT_BASE_SPEC } from "../vegaBuilder"
import { updateStateFromPreset } from "../presetParser"

import { useBuilderState } from "../hooks/useBuilderState"

import { LayerBuilder } from "./LayerBuilder"
import { PresetBuilder } from "./PresetBuilder"

export interface Props<S> {
  columnTypes: ColumnTypes,
  initialState?: BuilderState, // TODO: Use VL Spec here.
  baseSpec?: VLSpec,

  // Customize presets to show.
  presets: Presets,
  setGeneratedSpec: (s: VLSpec) => void,

  // Customize UI components.
  ui: UIComponents<S>,

  // Split properties into different "modes".
  modes?: ModeConfig,

  // Customize the properties to show.
  mark?: MarkConfig,
  encoding?: EncodingConfig,
  channelProperties?: ChannelPropertiesConfig,
  markPropertyValues?: MarkPropertyValuesConfig,
  channelPropertyValues?: ChannelPropertyValuesConfig,

  // Customize how we the UI adapts to selections.
  selectMarkProperty?: SelectMarkPropertyFunc,
  selectChannel?: SelectChannelFunc,
  selectChannelProperty?: SelectChannelPropertyFunc,
}

export function Mintaka<S>({
  columnTypes,
  initialState,
  baseSpec,
  presets,
  setGeneratedSpec,
  ui,
  modes,
  mark,
  encoding,
  channelProperties,
  markPropertyValues,
  channelPropertyValues,
  selectMarkProperty,
  selectChannel,
  selectChannelProperty,
}: Props<S>): ReactNode {
  const config = useMemo<Config>(() => ({
    modes: modes ?? configDefaults.modes,
    mark: mark ?? configDefaults.mark,
    encoding: encoding ?? configDefaults.encoding,
    channelProperties: channelProperties ?? configDefaults.channelProperties,
    markPropertyValues: markPropertyValues ?? configDefaults.markPropertyValues,
    channelPropertyValues: channelPropertyValues ?? configDefaults.channelPropertyValues,
    selectMarkProperty: selectMarkProperty ?? configDefaults.selectMarkProperty,
    selectChannel: selectChannel ?? configDefaults.selectChannel,
    selectChannelProperty: selectChannelProperty ?? configDefaults.selectChannelProperty,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [ /* Not including any of the above. */ ])

  const state = useBuilderState(config, initialState)

  // Some state for the developer to use however they want.
  const [customState, setCustomState] = useState<S>()

  const [ namedViewMode, setNamedViewMode ] =
    useState(Object.entries(config?.modes ?? {})?.[0])

  const setViewMode = useCallback((name: string) => {
    setNamedViewMode([name, config?.modes?.[name]])
  }, [ config?.modes ])

  const reset = useCallback(() => {
    state.reset()
    updateStateFromPreset(state, state.preset, columnTypes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnTypes,
    state.preset,
    // Not including:
    // state,
  ])

  useEffect(() => {
    const spec = generateVegaSpec(state, columnTypes, config, baseSpec ?? DEFAULT_BASE_SPEC)
    setGeneratedSpec(spec)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config,
    columnTypes,
    setGeneratedSpec,
    state.mark,
    state.encoding,
    // Not including:
    // state,
  ])

  const utilContainerProps: UtilBlockProps = {
    modes: config?.modes ? Object.keys(config?.modes) : null,
    currentMode: namedViewMode[0],
    setMode: setViewMode,
    reset: reset,
  }

  return (
    <ui.MintakaContainer>
      <ui.TopUtilBlock {...utilContainerProps} />

      <PresetBuilder
        state={state}
        columnTypes={columnTypes}
        ui={ui}
        presets={presets}
        namedViewMode={namedViewMode}
        customState={customState}
        setCustomState={setCustomState}
        />

      <LayerBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        ui={ui}
        namedViewMode={namedViewMode}
        customState={customState}
        setCustomState={setCustomState}
        />

      <ui.BottomUtilBlock {...utilContainerProps} />
    </ui.MintakaContainer>
  )
}
