import { Dispatch, useState, useEffect, useCallback, SetStateAction, ReactNode, ChangeEvent, MouseEvent } from "react"

import {
  ChannelContainerProps,
  GenericPickerWidgetProps,
  SectionContainerProps,
  Setter,
  SimpleContainerProps,
  UtilBlockProps,
} from "mintaka"

import backspaceIconSvg from "../assets/backspace_FILL0_wght300_GRAD0_opsz48.svg"
import tuneIconSvg from "../assets/tune_FILL0_wght300_GRAD0_opsz48.svg"

import styles from "./ui.module.css"
import utilStyles from "./util.module.css"

type DrawerStates = Record<string, boolean>

const AUTO_VISIBLE_CHANNELS = new Set([
  "text",
  "url",
  "x",
  "y",
  "theta",
  "latitude",
  "longitude",
  "color",
])

const ALWAYS_VISIBLE_MARK_PROPS = new Set([
  "type",
])

const ALWAYS_VISIBLE_CHANNEL_PROPS = new Set([
  "field",
])

export function MintakaContainer({children}: SimpleContainerProps) {
  return (
    <div className={styles.MintakaContainer}>
      {children}
    </div>
  )
}

export function LayerContainer({children}: SimpleContainerProps) {
  return (
    <div className={styles.LayerContainer}>
      {children}
    </div>
  )
}

export function EncodingContainer({children}: SimpleContainerProps) {
  return (
    <div className={styles.EncodingContainer}>
      {children}
    </div>
  )
}

export function MegaToolbar({modes, currentMode, setMode, reset}: UtilBlockProps) {
  return (
    <div className={styles.MegaToolbar}>
      {modes && (
        <ModePicker
          modes={modes}
          currentMode={currentMode}
          setMode={setMode}
        />
      )}

      <ResetButton onClick={reset} />
    </div>
  )
}

export function EmptyBlock() {
  return null
}

export function ViewModeToolbar({modes, currentMode, setMode}: UtilBlockProps) {
  return (
    <div className={styles.ViewModeToolbar}>
      {modes && (
        <ModePicker
          modes={modes}
          currentMode={currentMode}
          setMode={setMode}
        />
      )}
    </div>
  )
}

export function ButtonToolbar({reset}: UtilBlockProps) {
  return (
    <div className={styles.ButtonToolbar}>
      <ResetButton onClick={reset} />
    </div>
  )
}

interface ResetButtonProps {
  onClick: () => void,
}

function ResetButton({
  onClick,
}: ResetButtonProps) {
  return (
    <button className={styles.ResetButton} onClick={onClick}>
      Reset
    </button>
  )
}

interface ModePickerProps {
  modes: string[] | null,
  currentMode: string,
  setMode: Setter<string>,
}

function ModePicker({
  modes,
  currentMode,
  setMode,
}: ModePickerProps) {
  const [ radioValue, setRadioValue ] = useState(currentMode)

  const onClick = useCallback((ev: ChangeEvent) => {
    const newValue = (ev.currentTarget as HTMLInputElement).value
    setRadioValue(newValue)
    setMode(newValue)
  }, [modes, setMode, setRadioValue])

  if (!modes || Object.keys(modes).length <= 1)
    return null

  return (
    <div className={styles.ModePicker}>
      {modes.map((label, i) => (
        <label
          className={radioValue == label
            ? styles.ModePickerSelectedLabel
            : styles.ModePickerLabel
          }
          key={i}
        >
          <input
            type="radio"
            className={utilStyles.HiddenInput}
            value={label}
            onChange={onClick}
            checked={radioValue == label}
            name="modePicker"
          />
          {label}
        </label>
      ))}
    </div>
  )
}

export function PresetsContainer({
  children,
  statePath,
}: SectionContainerProps<DrawerStates>) {
  return (
    <GenericContainer
      title={"Chart type"}
      minimizable={false}
      className={styles.PresetsContainer}
      statePath={statePath}
    >
      {children}
    </GenericContainer>
  )
}

export function MarkContainer({
  children,
  customState,
  setCustomState,
  viewMode,
  statePath,
}: SectionContainerProps<DrawerStates>) {
  return (
    <GenericContainer
      title={"Mark"}
      minimizable={
        viewMode == "Adv" || viewMode == "Advanced"}
      startsMinimized={false}
      customState={customState}
      setCustomState={setCustomState}
      hasSettingsDrawer={
        viewMode == "Adv" || viewMode == "Advanced" || viewMode == "Default"}
      statePath={statePath}
    >
      {children}
    </GenericContainer>
  )
}

export function ChannelContainer({
  title,
  children,
  statePath,
  customState,
  setCustomState,
  viewMode,
}: ChannelContainerProps<DrawerStates>) {
  const isAdv = viewMode == "Adv" || viewMode == "Advanced"
  return (
    <GenericContainer
      title={title}
      minimizable={isAdv}
      startsMinimized={isAdv && !AUTO_VISIBLE_CHANNELS.has(statePath[1])}
      customState={customState}
      setCustomState={setCustomState}
      hasSettingsDrawer={isAdv || viewMode == "Default"}
      statePath={statePath}
    >
      {children}
    </GenericContainer>
  )
}

interface GenericContainerProps {
  title?: string,
  children: ReactNode|ReactNode[],
  className?: string,
  minimizable?: boolean,
  startsMinimized?: boolean,
  hasSettingsDrawer?: boolean,
  setCustomState?: Dispatch<SetStateAction<DrawerStates|undefined>>,
  customState?: DrawerStates,
  statePath?: string[],
}

export function GenericContainer({
  title,
  children,
  className,
  minimizable,
  startsMinimized,
  hasSettingsDrawer,
  setCustomState,
  customState,
  statePath,
}: GenericContainerProps) {
  const [minimized, setMinimized] = useState(minimizable ? startsMinimized : false)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const toggleMinimized = useCallback(() => {
    setMinimized(!minimized)
  }, [
    minimized,
    setMinimized,
  ])

  const toggleDrawer = useCallback(() => {
    const newValue = !drawerVisible
    setDrawerVisible(newValue)

    if (setCustomState && statePath)
      setCustomState({ ...customState, [statePath.join(".")]: newValue })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    drawerVisible,
    setDrawerVisible,
    setCustomState,
    customState,
    // Not including:
    // statePath
  ])

  const wrapperStyles = [
    minimized ? styles.GenericContainerMinimized : styles.GenericContainer,
    minimizable ? styles.GenericContainerMinimizable : null,
    className,
  ].join(" ")

  if (!children || (children as ReactNode[]).length == 0) return null

  return (
    <div className={wrapperStyles}>
      {title && (
        <div className={styles.GenericContainerTitle}>
          <label className={styles.GenericContainerLabel} onClick={minimizable ? toggleMinimized : undefined}>
            {title.toUpperCase()}
          </label>

          {!minimized && setCustomState && hasSettingsDrawer && (
            <div className={styles.GenericContainerToolbar}>
              <button className={styles.GenericContainerDrawerButton} onClick={toggleDrawer}>
                <img src={tuneIconSvg} alt="More options" />
              </button>
            </div>
          )}
        </div>
      )}

      {(!minimized || !title) && (
        <div className={styles.GenericContainerChildrenWrapper}>
          {children}
        </div>
      )}
    </div>
  )
}

export function GenericPickerWidget({
  widgetHint,
  label,
  value,
  setValue,
  items,
  statePath,
  customState,
  viewMode,
}: GenericPickerWidgetProps<any, DrawerStates>) {
  const parentPath = statePath.slice(0, -1)
  const isCollapsed = (viewMode == "Adv" || viewMode == "Advanced" || viewMode == "Default") && !customState?.[parentPath.join(".")]

  const isPermanentChannelProp =
    statePath[0] == "encoding"
    && !ALWAYS_VISIBLE_CHANNEL_PROPS.has(statePath[2])
  const isPermanentMarkProp =
    statePath[0] == "mark"
    && !ALWAYS_VISIBLE_MARK_PROPS.has(statePath[1])

  if (isCollapsed && (isPermanentMarkProp || isPermanentChannelProp))
    return null

  if (widgetHint == "multiselect"
    && statePath.length == 3
    && statePath[0] == "encoding"
    && statePath[1] != "y"
  ) {
    widgetHint = "select"
  }

  const widgetLabel = statePath[0] == "presets" ?
    undefined : label

  switch (widgetHint) {
    case "multiselect":
      return (
        <MultiSelect
          label={widgetLabel}
          items={items as Record<string, any>}
          value={value}
          setValue={setValue}
        />
      )

    case "select":
      return (
        <SelectBox
          label={widgetLabel}
          items={items as Record<string, any>}
          value={value}
          setValue={setValue}
        />
      )

    case "toggle":
      return (
        <Toggle
          label={widgetLabel}
          items={items as Record<string, any>}
          value={value}
          setValue={setValue}
        />
      )

    case "text":
    case "number":
    case "json":
    default:
      return (
        <TextInput
          label={widgetLabel}
          value={value as string|null}
          setValue={setValue as Dispatch<SetStateAction<string|null|undefined>>}
        />
      )
  }
}

interface SelectInputProps<V> {
  label?: string,
  items: Record<string, V>,
  value: V,
  setValue: Dispatch<SetStateAction<V>>,
}

export function MultiSelect({
  label,
  items,
  value,
  setValue,
}: SelectInputProps<any>) {
  const NO_VALUE_LABEL = Object.keys(items)[0]
  const valueArr =
      Array.isArray(value) ? value :
      value == null ? []
      : [value]

  const getLabelFromValue = useCallback((v: any) => {
    return Object.entries(items ?? {})
      .find(([_, itemValue]) => itemValue == v)
      ?.[0]
  }, [items])

  // We use labels for selectbox values since they're always strings,
  // and HTML Selectbox only supports value strings.
  const [multiselectValue, setMultiselectValue] = useState<any[]>([])

  useEffect(() => {
    const newSelectboxValue = valueArr?.map(v => getLabelFromValue(v))

    if (!newSelectboxValue) return

    if (newSelectboxValue?.length == multiselectValue.length
      && newSelectboxValue?.every((v, i) => v == multiselectValue[i]))
      return

    setMultiselectValue(newSelectboxValue)
  }, [value])

  const setValueFromLabel = useCallback((ev: ChangeEvent) => {
    const el = ev.currentTarget as HTMLSelectElement 
    const domLabel = el.value
    const index = parseInt(el.dataset["index"] || "0", 10)

    if (multiselectValue.length > 1 && domLabel == NO_VALUE_LABEL) {
      multiselectValue.splice(index, 1)
    } else {
      multiselectValue[index] = domLabel
    }

    setMultiselectValue(multiselectValue)

    const newValue = multiselectValue.map(l => items[l])
    setValue(newValue)
  }, [setValue, multiselectValue, setMultiselectValue])

  const addSeries = useCallback(() => {
    setMultiselectValue([ ...multiselectValue, NO_VALUE_LABEL ])
  }, [multiselectValue, setMultiselectValue])

  return (
    <WidgetWrapper label={label}>
      {multiselectValue.map((selectboxValue, i) => (
        <div className={styles.MultiSelect} key={i}>
          <select
            data-index={i}
            className={styles.MultiSelectEl}
            value={selectboxValue}
            onChange={setValueFromLabel}
          >
            {Object.keys(items).map(label => (
              <option value={label} key={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      ))}

      <a className={styles.MultiSelectAddSeries} onClick={addSeries}>
        + Add series
      </a>
    </WidgetWrapper>
  )
}

export function SelectBox({
  label,
  items,
  value,
  setValue,
}: SelectInputProps<any>) {
  const getLabelFromValue = useCallback((v: any) => {
    return Object.entries(items ?? {})
      .find(([_, itemValue]) => itemValue == v)
      ?.[0]
  }, [items])

  // We use labels for selectbox values since they're always strings,
  // and HTML Selectbox only supports value strings.
  // (BTW "" doesn't matter since the useEffect below will replace it)
  const [selectboxValue, setSelectboxValue] = useState<string|undefined>("")

  useEffect(() => {
    const currItemLabel = getLabelFromValue(value)
    if (currItemLabel == selectboxValue) return

    setSelectboxValue(currItemLabel)
  }, [value])

  const setValueFromLabel = useCallback((ev: ChangeEvent) => {
    const label = (ev.currentTarget as HTMLSelectElement).value
    setSelectboxValue(label)

    const newValue = items[label]
    setValue(newValue)
  }, [setValue, setSelectboxValue])

  return (
    <WidgetWrapper label={label}>
      <div className={styles.SelectBox}>
        <select
          className={styles.SelectBoxEl}
          value={selectboxValue}
          onChange={setValueFromLabel}
        >
          {Object.keys(items).map(label => (
            <option value={label} key={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </WidgetWrapper>
  )
}

export function Toggle({
  label,
  items,
  value,
  setValue,
}: SelectInputProps<string>) {
  let values: string[]

  if (Array.isArray(items)) {
    values = items 
  } else {
    values = Object.values(items)
  }

  const toggle = useCallback((ev: MouseEvent) => {
    const el = ev.currentTarget as HTMLInputElement
    setValue(el.checked ? values[1] : values[0])
  }, [setValue, values])

  return (
    <WidgetWrapper label={label}>
      <HtmlLabel className={styles.ToggleLabel}>
        <input
          type="checkbox"
          key={/* This is a hack so presets work */ value}
          defaultChecked={value == values[1]}
          className={[styles.ToggleInput, utilStyles.HiddenInput].join(" ")}
          onClick={toggle}
        />
        <div className={styles.ToggleElement}></div>
      </HtmlLabel>
    </WidgetWrapper>
  )
}

interface TextInputProps {
  label?: string,
  value: string|null,
  setValue: Dispatch<SetStateAction<string|null|undefined>>,
}

export function TextInput({
  label,
  value,
  setValue,
}: TextInputProps) {
  const setValueFromString = useCallback((ev: ChangeEvent) => {
    const newValue = (ev.currentTarget as HTMLInputElement).value
    try {
      setValue(JSON.parse(newValue))
    } catch (e) {
      setValue(newValue == "" ? null : newValue)
    }
  }, [setValue])

  const clearValue = useCallback(
    () => setValue(null),
  [setValue])

  const hasContent = value != null && value != ""

  const valueString = value == null
    ? value = ""
    : typeof value == "string"
      ?value 
      : JSON.stringify(value)

  return (
    <WidgetWrapper label={label}>
      <input
        className={styles.TextInputEl}
        type="text"
        value={valueString ?? ""}
        onChange={setValueFromString}
      />
      {hasContent ? (
        <button
          className={styles.TextInputOverlayButton}
          onClick={clearValue}
          disabled={!hasContent}
        >
          <img src={backspaceIconSvg} alt="Delete" />
        </button>
      ) : null}
    </WidgetWrapper>
  )
}

export function HtmlLabel(props: Record<string, any>) {
  return <label {...props} />
}

interface WidgetWrapperProps {
  label?: string,
  children?: ReactNode|ReactNode[],
}

export function WidgetWrapper({
  label,
  children,
}: WidgetWrapperProps) {
  return (
    <>
      { label &&
        <HtmlLabel className={styles.WidgetWrapperLabel}>
          {label}
        </HtmlLabel>
      }

      <div className={styles.WidgetWrapperWidget}>
        {children}
      </div>
    </>
  )
}
