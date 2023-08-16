import { useState, useEffect, useCallback } from "react"

import { formats } from "vega"
import arrow from "vega-loader-arrow"

import backspaceIconSvg from "./assets/backspace_FILL0_wght300_GRAD0_opsz48.svg"
import tuneIconSvg from "./assets/tune_FILL0_wght300_GRAD0_opsz48.svg"

import { BuilderPane } from "./components/BuilderPane.tsx"
import { PreviewPane } from "./components/PreviewPane.tsx"
import { isElementOf } from "./array.ts"
import { shouldIncludeSection } from "./modeParser.ts"
import { simpleColumnTypeDetector } from "./simpleColumnTypeDetector.ts"

import irisDataset from "./data/iris.json"
import carsDataset from "./data/cars.json"
import drivingDataset from "./data/driving.json"
import moviesDataset from "./data/movies.json"
import populationDataset from "./data/population.json"

import "./App.css"

// Register arrow reader under type "arrow"
formats("arrow", arrow);

function App() {
  const [dataset, setDataset] = useState(irisDataset)
  const [columnTypes, setcolumnTypes] = useState({})
  const [key, setKey] = useState(0)
  const [generatedSpec, setGeneratedSpec] = useState()

  // Handle dataset changes gracefully.
  useEffect(() => {
    setKey(key + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, /* key, setKey */])

  useEffect(() => {
    setcolumnTypes(Object.fromEntries(
      Object.entries(dataset[0]).map(([colName, value]) => ([
        colName,
        { type: simpleColumnTypeDetector(value), unique: null }
      ]))))
  }, [dataset])

  return (
    <div className="flex flex-col gap-32">
      <div className="flex min-h-[800px] flex-row gap-4">
        <BuilderPane
          key={key}
          columnTypes={columnTypes}
          setGeneratedSpec={setGeneratedSpec}
          ui={UI_COMPONENTS}
        />

        <PreviewPane
          className="flex-auto align-self-stretch"
          spec={generatedSpec}
          data={dataset}
        />
      </div>

      <details>
        <summary className="text-slate-500 border-t border-slate-200 pt-2 hover:text-pink-400 cursor-pointer text-sm">Demo input / output</summary>

        <div className="flex flex-col gap-4 pt-4">

          <div className="self-start w-64">
            <h3 className="text-slate-500 font-bold text-xs uppercase">Input</h3>
            <SelectBox
                label="Dataset"
                items={{
                  iris: irisDataset,
                  cars: carsDataset,
                  driving: drivingDataset,
                  movies: moviesDataset,
                  population: populationDataset,
                }}
                value={irisDataset}
                setValue={setDataset}
            />
          </div>

          <h3 className="text-slate-500 font-bold text-xs uppercase">Output</h3>
          <pre className="text-slate-800 bg-slate-100 text-sm p-4 rounded-lg">
            <code>
              { JSON.stringify(generatedSpec, undefined, 4) }
            </code>
          </pre>
        </div>
      </details>
    </div>
  )
}

function BuilderContainer({children}) {
  return (
    <div className="flex flex-col w-64 p-1 overflow-y-auto">
      {children}
    </div>
  )
}

function LayerContainer({children}) {
  return (
    <div className="flex flex-col order-1 gap-2">
      {children}
    </div>
  )
}

function EncodingContainer({children}) {
  return (
    <div className="flex flex-col order-1 gap-2">
      {children}
    </div>
  )
}

function EncodingGroup({children}) {
  const styles = [
    "flex flex-row flex-wrap items-start order-1",
    "gap-2 pt-2",
    "empty:hidden",
  ].join(" ")

  return (
    <div className={styles}>
      {children}
    </div>
  )
}

function ToolbarContainer({children}) {
  return (
    <div className="flex-auto flex flex-row flex-wrap items-end justify-center order-1 gap-1">
      {children}
    </div>
  )
}

function Button({onClick, children}) {
  return (
    <button
      className={[
        "px-2 py-0.5",
        "text-sm text-slate-500",
        "border border-slate-200 rounded-md",
        "hover:border-pink-400 hover:text-pink-400",
        "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
        "select-none",
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function PresetsContainer({title, children}) {
  return (
    <GenericContainer
      title={title}
      expandable={false}
      className="pb-2"
    >
      {children}
    </GenericContainer>
  )
}

function MarkContainer({title, children, setUIState, viewMode}) {
  return (
    <GenericContainer
      title={title}
      expandable={false}
      setUIState={setUIState}
      advOptionsAvailable={shouldIncludeSection("advanced", viewMode)}
    >
      {children}
    </GenericContainer>
  )
}

function ChannelContainer({
  title,
  children,
  groupName,
  setUIState,
  hasSomethingSet,
  groupHasSomethingSet,
  viewMode,
}) {
  return (
    <GenericContainer
      title={title}
      expandable={!isElementOf(groupName, ["basic", "requiredForSomeMarks"])}
      setUIState={setUIState}
      advOptionsAvailable={shouldIncludeSection("advanced", viewMode)}
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
  advShownByDefault,
  advOptionsAvailable,
  setUIState,
}) {
  const [expanded, setExpanded] = useState(!expandable)
  const [advShown, setAdvShown] = useState(!!advShownByDefault)

  const showAdvanced = (newValue) => {
    if (newValue == advShown) return
    setAdvShown(newValue)
    if (setUIState) setUIState(newValue ? "advShown": null)
  }

  useEffect(() => {
    showAdvanced(advShownByDefault)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advShownByDefault, /* showAdvanced */])

  const toggleAdvanced = useCallback(() => {
    showAdvanced(!advShown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advShown, setAdvShown, setUIState, showAdvanced])

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)

    if (expanded) {
      setAdvShown(false)
      if (setUIState) setUIState(null)
    }
  }, [expanded, setExpanded, setAdvShown, setUIState])

  const expandedWrapperStyles = [
    "flex flex-col",
    "w-full",
    "order-1",
    className,
  ].join(" ")

  const collapsedWrapperStyles = [
    "inline-flex pr-2 last:pr-0",
    "order-2",
    className,
  ].join(" ")

  const wrapperStyles = [
    expanded ? expandedWrapperStyles : collapsedWrapperStyles,
  ].join(" ")

  const labelWrapperStyles = [
    "flex flex-row items-center",
    "w-full h-8",
  ].join(" ")

  const labelStyles = [
    "text-xs font-bold",
    "text-slate-500",
    expandable ? "hover:border-pink-400 hover:text-pink-400 cursor-pointer" : null,
  ].join(" ")

  const childrenWrapperStyles = [
    "flex flex-col gap-1",
  ].join(" ")

  const advButtonStyles = "flex items-center w-4 opacity-50 hover:opacity-100"
  const toolbarStyles = "flex items-center justify-end flex-[1_0]"

  return (
    <div className={wrapperStyles}>
      {title && (
        <div className={labelWrapperStyles}>
          <label className={labelStyles} onClick={expandable ? toggleExpanded : null}>
            {title.toUpperCase()}
          </label>

          {expanded && setUIState && advOptionsAvailable && (
            <div className={toolbarStyles}>
              <button className={advButtonStyles} onClick={toggleAdvanced}>
                <img src={tuneIconSvg} alt="Advanced" />
              </button>
            </div>
          )}
        </div>
      )}

      {(expanded || !title) && (
        <div className={childrenWrapperStyles}>
          {children}
        </div>
      )}
    </div>
  )
}

function ChannelPropertyGroup({children, groupName, uiState}) {
  if (groupName == "basic") {
    return (
      <div className="grid grid-cols-3 gap-1">
        {children}
      </div>
    )

  } else {
    const styles = [
      "grid grid-cols-3 gap-1",
      uiState == "advShown" ? "" : "hidden",
    ].join(" ")

    return (
      <div className={styles}>
        {children}
      </div>
    )
  }
}

function GenericPickerWidget({propType, widgetHint, label, value, setValue, items, placeholder, propName, parentName, groupName}) {
  if (typeof widgetHint == "function") {
    widgetHint = widgetHint({propType, parentName, propName, groupName})
  }

  if (isElementOf(propName, ["preset", "mode"])) label = null

  switch (widgetHint) {
    case "multiselect":
      return (
        <MultiSelect
          label={label}
          items={items}
          value={value}
          setValue={setValue}
          groupName={groupName}
        />
      )

    case "select":
      return (
        <SelectBox
          label={label}
          items={items}
          value={value}
          setValue={setValue}
          groupName={groupName}
        />
      )

    case "toggle":
      return (
        <Toggle
          label={label}
          items={items}
          value={value}
          setValue={setValue}
          groupName={groupName}
        />
      )

    case "text":
    case "number":
    case "json":
    default:
      return (
        <TextInput
          label={label}
          placeholder={placeholder ?? "Default"}
          value={value}
          setValue={setValue}
          groupName={groupName}
        />
      )
  }
}

function MultiSelect({label, items, value, setValue}) {
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

  const selectStyles=[
    "py-0.5 flex-auto",
    "border hover:bg-slate-200 border-transparent rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500",
    "cursor-pointer",
    "bg-slate-100",
    "text-sm",
  ].join(" ")

  const buttonStyles=[
    "text-xs",
    "text-slate-500 hover:text-pink-500",
    "cursor-pointer",
    "flex items-center justify-start",
    "h-6",
  ].join(" ")

  return (
    <WidgetWrapper label={label}>
      {multiselectValue.map((selectboxValue, i) => (
        <select
          key={i}
          data-index={i}
          className={selectStyles}
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

      <a className={buttonStyles} onClick={addSeries}>
        + Add series
      </a>
    </WidgetWrapper>
  )
}

function SelectBox({label, items, value, setValue}) {
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

  const styles=[
    "py-0.5 flex-auto",
    "border hover:bg-slate-200 border-transparent rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500",
    "cursor-pointer",
    "bg-slate-100",
    "text-sm",
  ].join(" ")

  return (
    <WidgetWrapper label={label}>
      <select
        className={styles}
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

function TextInput({label, value, placeholder, setValue}) {
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

  const styles=[
    "py-0.5 pl-1 flex-auto",
    "border hover:bg-slate-200 border-transparent rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500",
    "bg-slate-100",
    "text-sm",
  ].join(" ")

  const hasContent = value != null && value != ""

  const valueString = value == null
    ? value = ""
    : typeof value == "string"
      ? value
      : JSON.stringify(value)

  const buttonStyles=[
    "absolute top-0 bottom-0 right-0 w-6",
    "flex items-center w-6 opacity-50 hover:opacity-100",
  ].join(" ")

  return (
    <WidgetWrapper label={label} className="relative">
      <input
        className={styles}
        type="text"
        value={valueString ?? ""}
        placeholder={placeholder}
        onChange={setValueFromString}
      />
      {hasContent ? (
        <button
          className={buttonStyles}
          onClick={clearValue}
          disabled={!hasContent}
        >
          <img src={backspaceIconSvg} alt="Delete" />
        </button>
      ) : null}
    </WidgetWrapper>
  )
}

function Toggle({label, items, value, setValue}) {
  let values

  if (Array.isArray(items)) {
    values = items
  } else {
    values = Object.values(items)
  }

  const toggle = useCallback((ev) => {
    setValue(ev.currentTarget.checked ? values[1] : values[0])
  }, [setValue, values])

  const troughClasses = [
    "w-7 h-4",
    "peer",
    "border border-transparent",
    "peer-focus:outline-none peer-focus:ring peer-focus:ring-pink-200 peer-focus:border-pink-400",
    "peer-checked:bg-slate-400",
    "bg-slate-200",
    "hover:bg-slate-300 hover:peer-checked:bg-pink-500",
    "rounded-full"
  ].join(" ")

  const thumbClasses = [
    "peer-checked:after:translate-x-full peer-checked:after:border-white",
    "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
    "after:bg-white after:border-slate-400",
    "after:border after:rounded-full",
    "after:h-3 after:w-3",
    "after:transition-all",
  ].join(" ")

  const toggleClasses = [troughClasses, thumbClasses].join(" ")

  return (
    <WidgetWrapper label={label}>
      <HtmlLabel className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          key={/* This is a hack so presets work */ value}
          defaultChecked={value == values[1]}
          className="sr-only peer"
          onClick={toggle}
        />
        <div className={toggleClasses}></div>
      </HtmlLabel>
    </WidgetWrapper>
  )
}

function HtmlLabel(props) {
  return <label {...props} />
}

function WidgetWrapper({label, className, children}) {
  const labelStyles = [
    "col-span-1",
    "flex items-start",
    "text-sm",
    "text-slate-500",
    "text-sm",
  ].join(" ")

  const childrenStyles = [
    "col-span-2",
    "flex-auto",
    "flex flex-col justify-start items-stretch gap-1",
    "min-h-6",
    className,
  ].join(" ")

  return (
    <>
      <HtmlLabel className={labelStyles}>
        {label}
      </HtmlLabel>

      <div className={childrenStyles}>
        {children}
      </div>
    </>
  )
}

const UI_COMPONENTS = {
  BuilderContainer,
  Button,
  ChannelContainer,
  ChannelPropertyGroup,
  EncodingContainer,
  EncodingGroup,
  GenericPickerWidget,
  LayerContainer,
  MarkContainer,
  MarkPropertyGroup: ChannelPropertyGroup,
  PresetsContainer,
  ToolbarContainer,
}

export default App
