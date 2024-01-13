import { ReactNode } from "react"

import {
  Config,
  MarkConfig,
  MarkPropName,
  MarkState,
  NamedMode,
  PlainRecord,
  UIComponents,
  WidgetHint,
  WithCustomState,
} from "../types/index.ts"

import { filterSection } from "../modeParser.ts"
import { BuilderState } from "mintaka/hooks/useBuilderState.ts"

export interface Props<S> extends WithCustomState<S> {
  config: Config,
  ui: UIComponents<S>,
  state: BuilderState,
  markState: MarkState,
  namedViewMode: NamedMode,
}

export function MarkBuilder<S>({
  config,
  ui,
  state,
  markState,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const uiParams: PlainRecord<UIParam> = {
    align: { widgetHint: "select" },
    baseline: { widgetHint: "select" },
    filled: { widgetHint: "toggle" },
    interpolate: { widgetHint: "select" },
    line: { widgetHint: "toggle" },
    orient: { widgetHint: "select" },
    point: { widgetHint: "toggle" },
    shape: { widgetHint: "select" },
    type: { widgetHint: "select" },
    tooltip: { widgetHint: "toggle" },
  }

  const cleanedProps = filterSection(
    "mark", config, namedViewMode,
    (name) => config.selectMarkProperty(name as MarkPropName, state.getCurrentLayer()))

  if (!cleanedProps) return null

  const statePath = ["mark"]

  return (
    <ui.MarkContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >

      {Object.entries(cleanedProps as MarkConfig)
        .map(([label, name]: [string, MarkPropName]) => (
          <ui.GenericPickerWidget
            statePath={[...statePath, name]}
            widgetHint={uiParams[name]?.widgetHint ?? "json"}
            label={label}
            value={markState[name]}
            setValue={state.getMarkSetter(name)}
            items={config?.markPropertyValues?.[name]}
            viewMode={namedViewMode?.[0]}
            customState={customState}
            setCustomState={setCustomState}
            key={name}
          />
        ))}

    </ui.MarkContainer>
  )
}

interface UIParam {
  widgetHint: WidgetHint,
}
