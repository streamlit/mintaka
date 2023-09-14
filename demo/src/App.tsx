import { useState, useEffect, useCallback } from "react"

import { formats } from "vega"
import includes from "lodash/includes"

import backspaceIconSvg from "../assets/backspace_FILL0_wght300_GRAD0_opsz48.svg"
import tuneIconSvg from "../assets/tune_FILL0_wght300_GRAD0_opsz48.svg"

import {
  BuilderPane,
  PreviewPane,
  simpleColumnTypeDetector,
} from "../../src"

import barleyDataset from "../data/barley.json"
import carsDataset from "../data/cars.json"
import disastersDataset from "../data/disasters.json"
import drivingDataset from "../data/driving.json"
import irisDataset from "../data/iris.json"
import moviesDataset from "../data/movies.json"
import populationDataset from "../data/population.json"

import styles from "./app.module.css"
import uiStyles from "./components.module.css"

const AUTO_EXPANDED_CHANNELS = new Set([
  "text",
  "url",
  "x",
  "y",
  "theta",
  "latitude",
  "longitude",
  "color",
])

const ALWAYS_EXPANDED_MARK_PROPS = new Set([
  "type",
])

const ALWAYS_EXPANDED_CHANNEL_PROPS = new Set([
  "field",
])

function App() {
  const [dataset, setDataset] = useState(irisDataset)
  const [columnTypes, setcolumnTypes] = useState({})
  const [key, setKey] = useState(0)
  const [generatedSpec, setGeneratedSpec] = useState()

  // Handle dataset changes gracefully.
  useEffect(() => {
    setKey(key + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataset,
    // Not including:
    // key,
    // setKey,
  ])

  useEffect(() => {
    setcolumnTypes(Object.fromEntries(
      Object.entries(dataset[0]).map(([colName, value]) => ([
        colName,
        { type: simpleColumnTypeDetector(value), unique: null }
      ]))))
  }, [dataset])

  return (
    <div className={styles.DemoWrapper}>
      <div className={styles.BuilderWrapper}>
        <BuilderPane
          key={key}
          columnTypes={columnTypes}
          setGeneratedSpec={setGeneratedSpec}
          ui={UI_COMPONENTS}
        />

        <PreviewPane
          className={styles.PreviewPane}
          spec={generatedSpec}
          data={dataset}
        />
      </div>

      <details>
        <summary className={styles.DetailsSummary}>
          Demo input / output
        </summary>

        <div className={styles.DetailsChild}>

          <div className={styles.DatasetPickerWrapper}>
            <h3 className={styles.DatasetPickerLabel}>Input</h3>
            <SelectBox
                label="Dataset"
                items={{
                  iris: irisDataset,
                  barley: barleyDataset,
                  cars: carsDataset,
                  disasters: disastersDataset,
                  driving: drivingDataset,
                  movies: moviesDataset,
                  population: populationDataset,
                }}
                value={irisDataset}
                setValue={setDataset}
            />
          </div>

          <div className={styles.OutputWrapper}>
            <h3 className={styles.OutputLabel}>Output</h3>
            <code className={styles.OutputCode}>
              { JSON.stringify(generatedSpec, undefined, 4) }
            </code>
          </div>
        </div>
      </details>
    </div>
  )
}

function BuilderContainer({children}) {
  return (
    <div className={uiStyles.BuilderContainer}>
      {children}
    </div>
  )
}

function LayerContainer({children}) {
  return (
    <div className={uiStyles.LayerContainer}>
      {children}
    </div>
  )
}

function EncodingContainer({children}) {
  return (
    <div className={uiStyles.EncodingContainer}>
      {children}
    </div>
  )
}

function ToolbarContainer({children}) {
  return (
    <div className={uiStyles.ToolbarContainer}>
      {children}
    </div>
  )
}

function ResetButton({
  onClick,
}) {
  return (
    <button className={uiStyles.ResetButton} onClick={onClick}>
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

  return (
    <div className={uiStyles.ModePicker}>
      {items.map((label, i) => (
        <label
          className={radioValue == label
            ? uiStyles.ModePickerSelectedLabel
            : uiStyles.ModePickerLabel
          }
          key={i}
        >
          <input
            type="radio"
            className={uiStyles.HiddenInput}
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

function PresetsContainer({
  children,
  statePath,
}) {
  return (
    <GenericContainer
      title={"Chart type"}
      expandable={false}
      className={uiStyles.PresetsContainer}
      statePath={statePath}
    >
      {children}
    </GenericContainer>
  )
}

function MarkContainer({
  children,
  setCustomState,
  viewMode,
  statePath,
}) {
  return (
    <GenericContainer
      title={"Mark"}
      expandable={viewMode == "Adv"}
      startsExpanded={true}
      setCustomState={setCustomState}
      advOptionsAvailable={viewMode == "Adv"}
      statePath={statePath}
    >
      {children}
    </GenericContainer>
  )
}

function ChannelContainer({
  title,
  children,
  statePath,
  setCustomState,
  viewMode,
}) {
  return (
    <GenericContainer
      title={title}
      expandable={viewMode == "Adv"}
      startsExpanded={AUTO_EXPANDED_CHANNELS.has(statePath[1])}
      setCustomState={setCustomState}
      advOptionsAvailable={viewMode == "Adv"}
      statePath={statePath}
    >
      {children}
    </GenericContainer>
  )
}

function GenericContainer({
  title,
  children,
  className,
  expandable,
  startsExpanded,
  advShownByDefault,
  advOptionsAvailable,
  setCustomState,
  customState,
  statePath,
}) {
  const [expanded, setExpanded] = useState(startsExpanded ?? !expandable)
  const [advShown, setAdvShown] = useState(!!advShownByDefault)

  const showAdvanced = useCallback((newValue) => {
    setAdvShown(newValue)
    if (setCustomState)
      setCustomState({ ...customState, [statePath.join(".")]: newValue })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setAdvShown,
    setCustomState,
    customState,
    // Not including:
    // statePath
  ])

  useEffect(() => {
    showAdvanced(advShownByDefault)
  }, [
    showAdvanced,
    advShownByDefault,
  ])

  const toggleAdvanced = useCallback(() => {
    showAdvanced(!advShown)
  }, [
    showAdvanced,
    advShown,
  ])

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)

    if (expanded) {
      setAdvShown(false)
      if (setCustomState)
        setCustomState({ ...customState, [statePath.join(".")]: false })
    }
  }, [expanded, setExpanded, setAdvShown, setCustomState])

  const wrapperStyles = [
    expanded ? uiStyles.GenericContainer : uiStyles.GenericContainerCollapsed,
    expandable ? uiStyles.GenericContainerExpandable : null,
    className,
  ].join(" ")

  return (
    <div className={wrapperStyles}>
      {title && (
        <div className={uiStyles.GenericContainerTitle}>
          <label className={uiStyles.GenericContainerLabel} onClick={expandable ? toggleExpanded : null}>
            {title.toUpperCase()}
          </label>

          {expanded && setCustomState && advOptionsAvailable && (
            <div className={uiStyles.GenericContainerToolbar}>
              <button className={uiStyles.GenericContainerAdvButton} onClick={toggleAdvanced}>
                <img src={tuneIconSvg} alt="Advanced" />
              </button>
            </div>
          )}
        </div>
      )}

      {(expanded || !title) && (
        <div className={uiStyles.GenericContainerChildrenWrapper}>
          {children}
        </div>
      )}
    </div>
  )
}

function GenericPickerWidget({
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
  const isCollapsed = viewMode == "Adv" && !customState[parentPath.join(".")]

  const isPermanentChannelProp =
    statePath[0] == "encoding"
    && !ALWAYS_EXPANDED_CHANNEL_PROPS.has(statePath[2])
  const isPermanentMarkProp =
    statePath[0] == "mark"
    && !ALWAYS_EXPANDED_MARK_PROPS.has(statePath[1])

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

function MultiSelect({
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
        <select
          key={i}
          data-index={i}
          className={uiStyles.MultiSelect}
          value={selectboxValue}
          onChange={setValueFromLabel}
        >
          {Object.keys(items).map(label => (
            <option value={label} key={label}>
              {label}
            </option>
          ))}
        </select>
      ))}

      <a className={uiStyles.MultiSelectAddSeries} onClick={addSeries}>
        + Add series
      </a>
    </WidgetWrapper>
  )
}

function SelectBox({
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
      <select
        className={uiStyles.SelectBox}
        value={selectboxValue}
        onChange={setValueFromLabel}
      >
        {Object.keys(items).map(label => (
          <option value={label} key={label}>
            {label}
          </option>
        ))}
      </select>
    </WidgetWrapper>
  )
}

function TextInput({
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
    <WidgetWrapper label={label} className={uiStyles.TextInput}>
      <input
        className={uiStyles.TextInputInput}
        type="text"
        value={valueString ?? ""}
        onChange={setValueFromString}
      />
      {hasContent ? (
        <button
          className={uiStyles.TextInputOverlayButton}
          onClick={clearValue}
          disabled={!hasContent}
        >
          <img src={backspaceIconSvg} alt="Delete" />
        </button>
      ) : null}
    </WidgetWrapper>
  )
}

function Toggle({
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
      <HtmlLabel className={uiStyles.ToggleLabel}>
        <input
          type="checkbox"
          key={/* This is a hack so presets work */ value}
          defaultChecked={value == values[1]}
          className={[uiStyles.ToggleInput, uiStyles.HiddenInput].join(" ")}
          onClick={toggle}
        />
        <div className={uiStyles.ToggleElement}></div>
      </HtmlLabel>
    </WidgetWrapper>
  )
}

function HtmlLabel(props) {
  return <label {...props} />
}

function WidgetWrapper({
  label,
  className,
  children,
}) {
  return (
    <>
      { label &&
        <HtmlLabel className={[uiStyles.WidgetWrapperLabel, className].join(" ")}>
          {label}
        </HtmlLabel>
      }

      <div className={uiStyles.WidgetWrapperWidget}>
        {children}
      </div>
    </>
  )
}

const UI_COMPONENTS = {
  BuilderContainer,
  ResetButton,
  ChannelContainer,
  EncodingContainer,
  GenericPickerWidget,
  LayerContainer,
  MarkContainer,
  ModePicker,
  PresetsContainer,
  ToolbarContainer,
}

export default App
