import { ReactNode } from "react"

import {
  BuilderState,
  ChannelName,
  ChannelPropName,
  Config,
  MarkPropertySetter,
  NamedMode,
  PlainRecord,
  StatePath,
  UIComponents,
  WidgetHint,
  WithCustomState,
  json,
} from "../types"

import { filterSection } from "../modeParser"

export interface Props extends WithCustomState {
  channelName: ChannelName,
  channelLabel: string,
  columns: PlainRecord<string | null>,
  config: Config,
  makeSetter: MarkPropertySetter,
  state: BuilderState,
  statePath: StatePath,
  ui: UIComponents,
  namedViewMode: NamedMode,
}

export function ChannelBuilder({
  channelName,
  channelLabel,
  columns,
  config,
  makeSetter,
  state,
  statePath,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props): ReactNode {
  const channelState = state?.encoding?.[channelName] ?? {}
  const validValues = config.channelPropertyValues

  const uiParams: PlainRecord<UIParam> = {
    aggregate: { widgetHint: "select" },
    bin: { widgetHint: "select" },
    binStep: { widgetHint: "number" },
    domain: { widgetHint: "2or3tuple" },
    field: { widgetHint: "multiselect", validValues: columns },
    legend: { widgetHint: "toggle" },
    maxBins: { widgetHint: "number" },
    range: { widgetHint: "2tuple" },
    scaleType: { widgetHint: "select" },
    scheme: { widgetHint: "select" },
    sort: { widgetHint: "select" },
    stack: { widgetHint: "select" },
    timeUnit: { widgetHint: "select" },
    type: { widgetHint: "select" },
    value: { widgetHint: "json" },
    zero: { widgetHint: "select" },
  }

  const cleanedProps = filterSection(
    "channelProperties", config, namedViewMode,
    (name) => config.selectChannelProperty(
      name as ChannelPropName, channelName, state))

  if (!cleanedProps) return null

  return (
    <ui.ChannelContainer
      title={channelLabel}
      statePath={[...statePath, channelName]}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedProps).map(([label, name]: [string, ChannelPropName]) => (
        <ui.GenericPickerWidget
          statePath={[...statePath, channelName, name]}
          widgetHint={uiParams[name]?.widgetHint ?? "json"}
          label={label}
          value={channelState[name]}
          setValue={makeSetter(name)}
          items={uiParams[name]?.validValues ?? validValues?.[name]}
          viewMode={namedViewMode?.[0]}
          customState={customState}
          setCustomState={setCustomState}
          key={name}
        />
      ))}

    </ui.ChannelContainer>
  )
}

interface UIParam {
  widgetHint: WidgetHint,
  validValues?: PlainRecord<json>,
}