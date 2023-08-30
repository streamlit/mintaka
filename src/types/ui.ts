import { FunctionComponent, ReactNode, MouseEventHandler } from "react"

import {
  Mode,
  PlainRecord,
  json,
} from "./index"

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

export interface ResetButtonProps extends SimpleContainerProps {
  onClick: MouseEventHandler,
}

export type ResetButton = FunctionComponent<ResetButtonProps>

export interface ModePickerProps {
  items: PlainRecord<Mode>,
  value: Mode,
  setValue: Setter<Mode>,
}

export type ModePicker = FunctionComponent<ModePickerProps>

export interface LevelContainerProps extends SimpleContainerProps, WithCustomState {
  statePath: string,
  groupName: string|null,
  viewMode: Mode|null,
}

type LevelContainer = FunctionComponent<LevelContainerProps>
export type MarkContainer = LevelContainer
export type EncodingContainer = LevelContainer
export type PresetsContainer = LevelContainer

export interface ChannelContainer extends LevelContainer {
  title: string,
}

export interface PropertyGroupProps extends SimpleContainerProps, WithCustomState {
  groupName: string,
  viewMode: Mode,
}

export type PropertyGroup = FunctionComponent<PropertyGroupProps>

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
  statePath: string,
  groupName: string,
  label: string,
  value: any,
  setValue: Setter<any>,
}

interface GenericPickerWidgetItemizedProps extends GenericPickerWidgetCommonProps {
  widgetHint: ItemizedWidgetHint,
  items: PlainRecord<any>,
}

interface GenericPickerWidgetJsonizedProps extends GenericPickerWidgetCommonProps {
  widgetHint: JsonizedWidgetHint,
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
  ChannelPropertyGroup: PropertyGroup,
  EncodingContainer: EncodingContainer,
  EncodingGroup: PropertyGroup,
  GenericPickerWidget: GenericPickerWidget,
  LayerContainer: LayerContainer,
  MarkContainer: MarkContainer,
  MarkPropertyGroup: PropertyGroup,
  ModePicker: ModePicker,
  PresetsContainer: PresetsContainer,
  ToolbarContainer: ToolbarContainer,
}
