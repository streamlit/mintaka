import { Dispatch, FunctionComponent, ReactNode, SetStateAction } from "react"

import { PlainRecord } from "./index"

type Children = ReactNode | ReactNode[]

interface SimpleContainerProps {
  children: Children,
}

export interface WithCustomState<S> {
  customState?: S | undefined,
  // This is just the type returned by useState.
  setCustomState?: Dispatch<SetStateAction<S | undefined>>,
}

export type Setter<V> = (value: V) => void
export type MintakaContainer = FunctionComponent<SimpleContainerProps>
export type LayerContainer = FunctionComponent<SimpleContainerProps>

export interface UtilBlockProps {
  // Utils for settings and viewing the current view mode.
  modes: string[] | null,
  currentMode: string,
  setMode: Setter<string>,

  // Utils for resetting the chart builder.
  reset: () => void,
}

export type UtilBlock = FunctionComponent<UtilBlockProps>

export type StatePath = Array<string>

export interface LevelContainerProps<S> extends SimpleContainerProps, WithCustomState<S> {
  statePath: StatePath,
  viewMode: string,
}

type LevelContainer<S> = FunctionComponent<LevelContainerProps<S>>
export type MarkContainer<S> = LevelContainer<S>
export type EncodingContainer<S> = LevelContainer<S>
export type PresetsContainer<S> = LevelContainer<S>

export interface ChannelContainerProps<S> extends LevelContainerProps<S> {
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

interface GenericPickerWidgetCommonProps<V, S> extends WithCustomState<S> {
  statePath: StatePath,
  label: string,
  value: V,
  setValue: Dispatch<SetStateAction<V>>,
  viewMode: string,
}

interface GenericPickerWidgetItemizedProps<V, S> extends GenericPickerWidgetCommonProps<V, S> {
  widgetHint: ItemizedWidgetHint,
  items: PlainRecord<V>,
}

interface GenericPickerWidgetAllProps<V, S> extends GenericPickerWidgetCommonProps<V, S> {
  widgetHint: WidgetHint,
  items: PlainRecord<V>,
}

export type GenericPickerWidgetProps<V, S> =
  | GenericPickerWidgetItemizedProps<V, S>
  | GenericPickerWidgetAllProps<V, S>
  | GenericPickerWidgetCommonProps<V, S>

export type GenericPickerWidget<V, S> = FunctionComponent<GenericPickerWidgetProps<V, S>>

export interface UIComponents<S> {
  MintakaContainer: MintakaContainer,
  ChannelContainer: ChannelContainer<S>,
  EncodingContainer: EncodingContainer<S>,
  GenericPickerWidget: GenericPickerWidget<any, S>,
  LayerContainer: LayerContainer,
  MarkContainer: MarkContainer<S>,
  PresetsContainer: PresetsContainer<S>,
  TopUtilBlock: UtilBlock,
  BottomUtilBlock: UtilBlock,
}
