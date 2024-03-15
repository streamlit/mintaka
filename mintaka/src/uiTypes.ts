import { Dispatch, FunctionComponent, ReactNode, SetStateAction } from "react"

import { PlainRecord } from "./typeUtil.ts"
import { LayerState } from "./stateTypes.ts"

type Children = ReactNode | ReactNode[]

export interface SimpleContainerProps {
  children: Children,
}

export interface WithCustomState<S> {
  customState?: S | undefined,
  // This is just the type returned by useState.
  setCustomState?: Dispatch<SetStateAction<S | undefined>>,
}

export type Setter<V> = (value: V) => void
export type MintakaContainer = FunctionComponent<SimpleContainerProps>
export type LayerBuilder = FunctionComponent<SimpleContainerProps>

export interface LayerPickerProps {
  addLayer: () => void,
  removeLayer: () => void,
  moveLayer: (newIndex: number) => void,
  setCurrentLayer: (newIndex: number) => void,
  currentLayerIndex: number,
  layers: LayerState[],
}

export type LayerPicker = FunctionComponent<LayerPickerProps>

// Utils for settings and viewing the current view mode.
export interface ModeBlockProps {
  modes: string[] | null,
  currentMode: string,
  setMode: Setter<string>,
}

// Utils for resetting the chart builder.
export interface ResetBlockProps {
  reset: () => void,
}

export interface UtilBlockProps extends ModeBlockProps, ResetBlockProps {}

export type UtilBlock = FunctionComponent<UtilBlockProps>

export type StatePath = Array<string>

export interface SectionContainerProps<S> extends SimpleContainerProps, WithCustomState<S> {
  statePath: StatePath,
  viewMode: string,
}

type SectionContainer<S> = FunctionComponent<SectionContainerProps<S>>
export type MarkContainer<S> = SectionContainer<S>
export type EncodingContainer<S> = SectionContainer<S>
export type PresetsContainer<S> = SectionContainer<S>

export interface ChannelContainerProps<S> extends SectionContainerProps<S> {
  title: string,
}

export type ChannelContainer<S> = FunctionComponent<ChannelContainerProps<S>>

export type ItemizedWidgetHint =
  | "multiselect"
  | "select"
  | "toggle"

export type JsonizedWidgetHint =
  | "text"
  | "number"
  | "json"
  | "2tuple"
  | "2or3tuple"

export type WidgetHint = ItemizedWidgetHint | JsonizedWidgetHint

export interface GenericPickerWidgetProps<V, S> extends WithCustomState<S> {
  statePath: StatePath,
  label: string,
  items: PlainRecord<V>|undefined,
  value: V,
  setValue: Dispatch<SetStateAction<V>>,
  viewMode: string,
  widgetHint: WidgetHint|undefined,
}

export type GenericPickerWidget<V, S> = FunctionComponent<GenericPickerWidgetProps<V, S>>

export interface UIComponents<S> {
  MintakaContainer: MintakaContainer,
  ChannelContainer: ChannelContainer<S>,
  EncodingContainer: EncodingContainer<S>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GenericPickerWidget: GenericPickerWidget<any, S>,
  LayerBuilder: LayerBuilder,
  LayerPicker: LayerPicker,
  MarkContainer: MarkContainer<S>,
  PresetsContainer: PresetsContainer<S>,
  TopUtilBlock: UtilBlock,
  BottomUtilBlock: UtilBlock,
}