import { ReactNode, useEffect, useCallback, useState, useMemo } from "react"

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
  VLSpec,
} from "../types"

import * as configDefaults from "../config"
import { generateVegaSpec } from "../vegaBuilder"
import { updateStateFromPreset } from "../presetParser"

import { useBuilderState } from "./useBuilderState"
import { LayerBuilder } from "./LayerBuilder"
import { PresetBuilder } from "./PresetBuilder"

export interface Props {
  columnTypes: ColumnTypes,
  initialState: BuilderState, // TODO: Use VL Spec here.
  presets: Presets,
  setGeneratedSpec: (s: VLSpec) => void,
  ui: UIComponents,

  // Customization
  modes?: ModeConfig,
  mark?: MarkConfig,
  encoding?: EncodingConfig,
  channelProperties?: ChannelPropertiesConfig,
  markPropertyValues?: MarkPropertyValuesConfig,
  channelPropertyValues?: ChannelPropertyValuesConfig,
  selectMarkProperty?: SelectMarkPropertyFunc,
  selectChannel?: SelectChannelFunc,
  selectChannelProperty?: SelectChannelPropertyFunc,
}

export function BuilderPane({
  columnTypes,
  initialState,
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
}: Props): ReactNode {
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
  }), [])

  const state = useBuilderState(config, initialState)

  // Some state for the developer to use however they want.
  const [customState, setCustomState] = useState({})

  const [ namedViewMode, setNamedViewMode ] =
    useState(Object.entries(config?.modes ?? {})?.[0])

  const setViewMode = useCallback((name: string) => {
    setNamedViewMode([name, config?.modes?.[name]])
  }, [ config?.modes ])

  const reset = useCallback(() => {
    state.reset()
    updateStateFromPreset(state, state.preset, columnTypes)
  }, [ columnTypes, state.preset ])

  useEffect(() => {
    const spec = generateVegaSpec(state, columnTypes, config)
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

  return (
    <ui.BuilderContainer>
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

      <ui.ToolbarContainer>
        {config?.modes && (
          <ui.ModePicker
            items={Object.keys(config?.modes)}
            value={namedViewMode[0]}
            setValue={setViewMode}
          />
        )}

        <ui.ResetButton onClick={reset} />
      </ui.ToolbarContainer>
    </ui.BuilderContainer>
  )
}
