import { ReactNode, useEffect, useCallback, useState, useMemo } from "react"

import {
  ChannelPropertiesConfig,
  ChannelPropertyValuesConfig,
  ColumnTypes,
  Config,
  EncodingConfig,
  InitialState,
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
} from "../types/index.ts"

import * as configDefaults from "../config.ts"
import { generateVegaSpec, DEFAULT_BASE_SPEC } from "../vegaBuilder.ts"

import { useBuilderState } from "../hooks/useBuilderState.ts"

import { LayerBuilder } from "./LayerBuilder.tsx"
import { PresetBuilder } from "./PresetBuilder.tsx"

export interface Props<S> {
  // This is how the Vega-Lite spec that Mintaka produces is output to you.
  // Whenever you make a selection in Mintaka, this function is called with the
  // output Vega-Lite spec as an argument.
  setGeneratedSpec: (s: VLSpec) => void,

  // Some metadata about the columns in the dataset you want to plot.
  // This includes: column name, type, number of unique items.
  columnTypes: ColumnTypes,

  // A Vega-Lite spec that will be used as the "base" for the output spec.
  // Anything that is not set by the user will default to the values in baseSpec.
  // For example, if you set no baseSpec, we internally use one that sets up
  // pan/zoom for the chart.
  baseSpec?: VLSpec,

  // The initial state for the widgets in Mintaka.
  // This is only useful if presets is undefined.
  initialState?: InitialState,

  // Customize presets to show.
  // The first preset will be automatically applied, overriding whatever was
  // set in initialState.
  presets?: Presets,

  // Tell Mintaka which UI components to use.
  ui: UIComponents<S>,

  // Split properties into different "modes".
  modes?: ModeConfig,

  // Customize the properties to show.
  mark?: MarkConfig,
  encoding?: EncodingConfig,
  channelProperties?: ChannelPropertiesConfig,
  markPropertyValues?: MarkPropertyValuesConfig,
  channelPropertyValues?: ChannelPropertyValuesConfig,

  // Customize how the UI adapts to selections.
  // For example, the widgets for "Bin size" and "Max bins" only appear when
  // "Bin" is set to "true". That configured by the functions below.
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
  if (!columnTypes || Object.keys(columnTypes).length == 0) {
    console.warn('<Mintaka> requires columnTypes prop to exist and be non-empty.')
  }

  if (!setGeneratedSpec) {
    console.warn('<Mintaka> requires setGeneratedSpec prop to exist')
  }

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
  }), [ /* Not including any of the above. None are allowed to change. */ ])

  const [stateChangeNum, state] = useBuilderState(
    columnTypes,
    config,
    initialState,
    presets,
  )

  // Some state for the developer to use however they want.
  const [customState, setCustomState] = useState<S>()

  const [ namedViewMode, setNamedViewMode ] =
    useState(Object.entries(config?.modes ?? {})?.[0])

  const setViewMode = useCallback((name: string) => {
    setNamedViewMode([name, config?.modes?.[name]])
  }, [ config?.modes ])

  useEffect(() => {
    const spec = generateVegaSpec(state, columnTypes, config, baseSpec ?? DEFAULT_BASE_SPEC)
    setGeneratedSpec(spec)
  }, [
    config,
    columnTypes,
    setGeneratedSpec,
    stateChangeNum,
    state,
  ])

  const utilContainerProps: UtilBlockProps = {
    modes: config?.modes ? Object.keys(config?.modes) : null,
    currentMode: namedViewMode[0],
    setMode: setViewMode,
    reset: state.reset,
  }

  return (
    <ui.MintakaContainer>
      <ui.TopUtilBlock {...utilContainerProps} />

      <PresetBuilder
        state={state}
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
