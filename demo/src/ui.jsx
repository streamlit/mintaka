import { useState, useEffect, useCallback } from "react"

import backspaceIconSvg from "../assets/backspace_FILL0_wght300_GRAD0_opsz48.svg"
import tuneIconSvg from "../assets/tune_FILL0_wght300_GRAD0_opsz48.svg"

import styles from "./ui.module.css"
import utilStyles from "./util.module.css"

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

export function MintakaContainer({children}) {
  return (
    <div className={styles.MintakaContainer}>
      {children}
    </div>
  )
}

export function LayerContainer({children}) {
  return (
    <div className={styles.LayerContainer}>
      {children}
    </div>
  )
}

export function EncodingContainer({children}) {
  return (
    <div className={styles.EncodingContainer}>
      {children}
    </div>
  )
}

export function MegaToolbar({modes, currentMode, setMode, reset}) {
  return (
    <div className={styles.MegaToolbar}>
      {modes && (
        <ModePicker
          items={modes}
          value={currentMode}
          setValue={setMode}
        />
      )}

      <ResetButton onClick={reset} />
    </div>
  )
}

export function EmptyBlock(props) {
  return null
}

export function ViewModeToolbar({modes, currentMode, setMode}) {
  return (
    <div className={styles.ViewModeToolbar}>
      {modes && (
        <ModePicker
          items={modes}
          value={currentMode}
          setValue={setMode}
        />
      )}
    </div>
  )
}

export function ButtonToolbar({reset}) {
  return (
    <div className={styles.ButtonToolbar}>
      <ResetButton onClick={reset} />
    </div>
  )
}

function ResetButton({
  onClick,
}) {
  return (
    <button className={styles.ResetButton} onClick={onClick}>
      Reset
    </button>
  )
}

function ModePicker({
  items,
  value,
  setValue,
}) {
  const [ radioValue, setRadioValue ] = useState(value)

  const onClick = useCallback(ev => {
    const newValue = ev.currentTarget.value
    setRadioValue(newValue)
    setValue(newValue)
  }, [items, setValue, setRadioValue])

  if (!items || Object.keys(items).length <= 1)
    return null

  return (
    <div className={styles.ModePicker}>
      {items.map((label, i) => (
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
}) {
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
}) {
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
}) {
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
}) {
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

    if (setCustomState)
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

  if (!children || children.length == 0) return null

  return (
    <div className={wrapperStyles}>
      {title && (
        <div className={styles.GenericContainerTitle}>
          <label className={styles.GenericContainerLabel} onClick={minimizable ? toggleMinimized : null}>
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
}) {
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

  if (statePath[0] == "presets") label = null

  switch (widgetHint) {
    case "multiselect":
      return (
        <MultiSelect
          label={label}
          items={items}
          value={value}
          setValue={setValue}
        />
      )

    case "select":
      return (
        <SelectBox
          label={label}
          items={items}
          value={value}
          setValue={setValue}
        />
      )

    case "toggle":
      return (
        <Toggle
          label={label}
          items={items}
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
          label={label}
          value={value}
          setValue={setValue}
        />
      )
  }
}

export function MultiSelect({
  label,
  items,
  value,
  setValue,
}) {
  const NO_VALUE_LABEL = Object.keys(items)[0]
  const valueArr =
      Array.isArray(value) ? value :
      value == null ? []
      : [value]

  const getLabelFromValue = useCallback((v) => {
    return Object.entries(items ?? {})
      .find(([_, itemValue]) => itemValue == v)
      ?.[0]
  }, [items])

  // We use labels for selectbox values since they're always strings,
  // and HTML Selectbox only supports value strings.
  const [multiselectValue, setMultiselectValue] = useState([])

  useEffect(() => {
    const newSelectboxValue = valueArr?.map(v => getLabelFromValue(v))

    if (!newSelectboxValue) return

    if (newSelectboxValue?.length == multiselectValue.length
      && newSelectboxValue?.every((v, i) => v == multiselectValue[i]))
      return

    setMultiselectValue(newSelectboxValue)
  }, [value])

  const setValueFromLabel = useCallback((ev) => {
    const domLabel = ev.currentTarget.value
    const index = parseInt(ev.currentTarget.dataset["index"], 10)

    const domValue = items[domLabel]

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
}) {
  const getLabelFromValue = useCallback((v) => {
    return Object.entries(items ?? {})
      .find(([_, itemValue]) => itemValue == v)
      ?.[0]
  }, [items])

  // We use labels for selectbox values since they're always strings,
  // and HTML Selectbox only supports value strings.
  // (BTW "" doesn't matter since the useEffect below will replace it)
  const [selectboxValue, setSelectboxValue] = useState("")

  useEffect(() => {
    const currItemLabel = getLabelFromValue(value)
    if (currItemLabel == selectboxValue) return

    setSelectboxValue(currItemLabel)
  }, [value])

  const setValueFromLabel = useCallback((ev) => {
    const label = ev.currentTarget.value
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

export function TextInput({
  label,
  value,
  setValue,
}) {
  const setValueFromString = useCallback((ev) => {
    const newValue = ev.currentTarget.value
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

export function Toggle({
  label,
  items,
  value,
  setValue,
}) {
  let values

  if (Array.isArray(items)) {
    values = items
  } else {
    values = Object.values(items)
  }

  const toggle = useCallback((ev) => {
    setValue(ev.currentTarget.checked ? values[1] : values[0])
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

export function HtmlLabel(props) {
  return <label {...props} />
}

export function WidgetWrapper({
  label,
  children,
}) {
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
