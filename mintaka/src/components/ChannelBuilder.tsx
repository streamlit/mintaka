import { ReactNode, memo } from "react"

import { filterSection } from "../modeParser.ts"
import { BuilderState } from "../BuilderState.ts"
import { Config, NamedMode, ChannelPropertiesConfig } from "../configTypes.ts"
import { ChannelName, ChannelState, ChannelPropName } from "../stateTypes.ts"
import { PlainRecord, json } from "../typeUtil.ts"
import { WithCustomState, StatePath, UIComponents, WidgetHint } from "../uiTypes.ts"

export interface Props<S> extends WithCustomState<S> {
  channelName: ChannelName,
  channelLabel: string,
  columns: PlainRecord<string | null>,
  config: Config,
  state: BuilderState,
  channelState?: ChannelState,
  statePath: StatePath,
  ui: UIComponents<S>,
  namedViewMode: NamedMode,
}

function ChannelBuilderRaw<S>({
  channelName,
  channelLabel,
  columns,
  config,
  state,
  channelState,
  statePath,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
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
      name as ChannelPropName,
      channelName,
      state.getCurrentLayer(),
      state.value,
    )
  )

  if (!cleanedProps) return null

  return (
    <ui.ChannelContainer
      title={channelLabel}
      statePath={[...statePath, channelName]}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedProps as ChannelPropertiesConfig)
        .map(([label, name]: [string, ChannelPropName]) => (
          <ui.GenericPickerWidget
            statePath={[...statePath, channelName, name]}
            widgetHint={uiParams[name]?.widgetHint ?? "json"}
            label={label}
            value={channelState?.[name]}
            setValue={state.getChannelPropSetter(channelName, name)}
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

export const ChannelBuilder = memo(ChannelBuilderRaw) as typeof ChannelBuilderRaw
