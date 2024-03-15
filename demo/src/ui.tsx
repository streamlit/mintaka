import { Dispatch, useState, useEffect, useCallback, SetStateAction, ReactNode, ChangeEvent, MouseEvent, useRef } from "react"

import {
  ChannelContainerProps,
  GenericPickerWidgetProps,
  LayerPickerProps,
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

export function MintakaContainer({ children }: SimpleContainerProps) {
  return (
    <div className={styles.MintakaContainer}>
      {children}
    </div>
  )
}

export function LayerBuilder({ children }: SimpleContainerProps) {
  return (
    <div className={styles.LayerBuilder}>
      {children}
    </div>
  )
}

export function EncodingContainer({ children }: SimpleContainerProps) {
  return (
    <div className={styles.EncodingContainer}>
      {children}
    </div>
  )
}

export function LayerPicker({
  setCurrentLayer,
  addLayer,
  removeLayer,
  moveLayer,
  layers,
  currentLayerIndex,
}: LayerPickerProps) {
  const layerItems = Object.fromEntries(layers.map((layer, i) => (
    [
      `${layer.mark.type || "blank"} layer ${i}`,
      i,
    ]
  )))

  const setValue = useCallback((i: number) => {
    setCurrentLayer(i)
  }, [setCurrentLayer])

  return (
    <div className={styles.LayerManager}>
      <SelectBox
        label="Layers"
        items={layerItems}
        value={currentLayerIndex}
        setValue={setValue}
      />

      <div className={styles.LayerButtons}>
        <button onClick={addLayer}>+</button>
        <button onClick={removeLayer}>&minus;</button>
      </div>
    </div>
  )
}

export function MegaToolbar({ modes, currentMode, setMode, reset }: UtilBlockProps) {
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

export function ViewModeToolbar({ modes, currentMode, setMode }: UtilBlockProps) {
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

export function ButtonToolbar({ reset }: UtilBlockProps) {
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
  const [radioValue, setRadioValue] = useState(currentMode)

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
  children: ReactNode | ReactNode[],
  className?: string,
  minimizable?: boolean,
  startsMinimized?: boolean,
  hasSettingsDrawer?: boolean,
  setCustomState?: Dispatch<SetStateAction<DrawerStates | undefined>>,
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
          value={value as string | null}
          setValue={setValue as Dispatch<SetStateAction<string | null | undefined>>}
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
  items = items ?? {}

  const getIndicesFromValue = useCallback((): number[] => {
    const itemValues = Object.values(items)
    const valueArr = Array.isArray(value) ? value : [value]

    return valueArr.map(v => itemValues.indexOf(v))
  }, [items, value])

  const [selectedIndices, setSelectedIndices] =
    useState<number[]>(() => getIndicesFromValue())

  useEffect(() => {
    const indicesFromValue = getIndicesFromValue()
    if (indicesFromValue.toString() == selectedIndices.toString()) return

    setSelectedIndices(indicesFromValue)
  }, [getIndicesFromValue])

  const selectItem = useCallback((ev: ChangeEvent) => {
    const el = ev.currentTarget as HTMLSelectElement
    const newSelectedIndex = parseInt(el.value, 10)

    const selectboxIndexStr = el.dataset['selectboxIndex'] as string
    const selectboxIndex = parseInt(selectboxIndexStr, 10)

    if (selectedIndices.length > 1 && newSelectedIndex == 0) {
      selectedIndices.splice(selectboxIndex, 1)
    } else {
      selectedIndices[selectboxIndex] = newSelectedIndex
    }

    setSelectedIndices(selectedIndices)

    const itemValues = Object.values(items)
    const newValue = selectedIndices.map(i => itemValues[i])
    setValue(newValue)
  }, [setValue, selectedIndices, setSelectedIndices, items])

  const addSeries = useCallback(() => {
    setSelectedIndices([...selectedIndices, 0])
  }, [selectedIndices, setSelectedIndices])

  return (
    <WidgetWrapper label={label}>
      {selectedIndices.map((selectedIndex, selectboxIndex) => (
        <div className={styles.MultiSelect} key={selectboxIndex}>
          <select
            className={styles.MultiSelectEl}
            value={selectedIndex}
            data-selectbox-index={selectboxIndex}
            onChange={selectItem}
          >
            {Object.keys(items)
              .map((label, itemIndex) => (
                <option value={itemIndex} key={label}>
                  {label}
                </option>
              )).filter((_, itemIndex) =>
                itemIndex == 0 ||
                itemIndex == selectedIndex ||
                selectedIndices.indexOf(itemIndex) == -1
              )
            }
          </select>
        </div>
      ))}

      { (selectedIndices.at(-1) ?? 0) > 0 && (
        <a className={styles.MultiSelectAddSeries} onClick={addSeries}>
          + Add series
        </a>
      )}
    </WidgetWrapper>
  )
}

export function SelectBox({
  label,
  items,
  value,
  setValue,
}: SelectInputProps<any>) {
  const getIndexFromItems = useCallback(
    (v: any): number => Object.values(items ?? {}).indexOf(v),
    [items])

  const [selectedIndex, setSelectedIndex] =
    useState<number>(getIndexFromItems(value))

  useEffect(() => {
    const indexFromValue = getIndexFromItems(value)
    if (indexFromValue == selectedIndex) return

    setSelectedIndex(indexFromValue)
  }, [value])

  const setValueFromIndex = useCallback((ev: ChangeEvent) => {
    const index = parseInt((ev.currentTarget as HTMLSelectElement).value, 10)
    setSelectedIndex(index)

    const newValue = Object.values(items ?? {})[index]
    setValue(newValue)
  }, [setValue, setSelectedIndex, items])

  return (
    <WidgetWrapper label={label}>
      <div className={styles.SelectBox}>
        <select
          className={styles.SelectBoxEl}
          value={selectedIndex}
          onChange={setValueFromIndex}
        >
          {Object.keys(items).map((label, index) => (
            <option value={index} key={label}>
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
  value: string | null,
  setValue: Dispatch<SetStateAction<string | null | undefined>>,
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
      ? value
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
  children?: ReactNode | ReactNode[],
}

export function WidgetWrapper({
  label,
  children,
}: WidgetWrapperProps) {
  return (
    <>
      {label &&
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
