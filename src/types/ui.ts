import { FunctionComponent, ReactNode, MouseEventHandler } from "react"

import { PlainRecord } from "./index"

type Children = ReactNode | ReactNode[]

interface SimpleContainerProps {
  children: Children,
}

export interface WithCustomState {
  customState?: any,
  setCustomState?: Setter<any>,
}

export type Setter<T> = (value: T) => void
export type BuilderContainer = FunctionComponent<SimpleContainerProps>
export type LayerContainer = FunctionComponent<SimpleContainerProps>
export type ToolbarContainer = FunctionComponent<SimpleContainerProps>

export interface ResetButtonProps {
  onClick: MouseEventHandler,
}

export type ResetButton = FunctionComponent<ResetButtonProps>

export interface ModePickerProps {
  items: string[],
  value: string,
  setValue: Setter<string>,
}

export type ModePicker = FunctionComponent<ModePickerProps>
export type StatePath = Array<string>

export interface LevelContainerProps extends SimpleContainerProps, WithCustomState {
  statePath: StatePath,
  viewMode: string,
}

type LevelContainer = FunctionComponent<LevelContainerProps>
export type MarkContainer = LevelContainer
export type EncodingContainer = LevelContainer
export type PresetsContainer = LevelContainer

export interface ChannelContainerProps extends LevelContainerProps {
  title: string,
}

export type ChannelContainer = FunctionComponent<ChannelContainerProps>

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

interface GenericPickerWidgetCommonProps extends WithCustomState {
  statePath: StatePath,
  label: string,
  value: any,
  setValue: Setter<any>,
  viewMode: string,
}

interface GenericPickerWidgetItemizedProps extends GenericPickerWidgetCommonProps {
  widgetHint: ItemizedWidgetHint,
  items: PlainRecord<any>,
}

interface GenericPickerWidgetAllProps extends GenericPickerWidgetCommonProps {
  widgetHint: WidgetHint,
  items: PlainRecord<any>,
}

export type GenericPickerWidgetProps =
  | GenericPickerWidgetItemizedProps
  | GenericPickerWidgetCommonProps
  | GenericPickerWidgetAllProps

export type GenericPickerWidget = FunctionComponent<GenericPickerWidgetProps>

export interface UIComponents {
  BuilderContainer: BuilderContainer,
  ResetButton: ResetButton,
  ChannelContainer: ChannelContainer,
  EncodingContainer: EncodingContainer,
  GenericPickerWidget: GenericPickerWidget,
  LayerContainer: LayerContainer,
  MarkContainer: MarkContainer,
  ModePicker: ModePicker,
  PresetsContainer: PresetsContainer,
  ToolbarContainer: ToolbarContainer,
}
