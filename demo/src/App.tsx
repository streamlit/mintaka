import { useState, useEffect, useCallback } from "react"

import { formats } from "vega"
import arrow from "vega-loader-arrow"

import backspaceIconSvg from "../assets/backspace_FILL0_wght300_GRAD0_opsz48.svg"
import tuneIconSvg from "../assets/tune_FILL0_wght300_GRAD0_opsz48.svg"

import { BuilderPane, PreviewPane, selectGroup, simpleColumnTypeDetector } from "../../src"
import { isElementOf } from "../../src/array.ts"

import barleyDataset from "../data/barley.json"
import carsDataset from "../data/cars.json"
import disastersDataset from "../data/disasters.json"
import drivingDataset from "../data/driving.json"
import irisDataset from "../data/iris.json"
import moviesDataset from "../data/movies.json"
import populationDataset from "../data/population.json"

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
      <div className="flex flex-none h-[500px] flex-row gap-4">
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

          <div className="self-start min-w-64">
            <h3 className="text-slate-500 font-bold text-xs uppercase">Input</h3>
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
    <div className="flex flex-col flex-none w-64 p-1">
      {children}
    </div>
  )
}

function LayerContainer({children}) {
  return (
    <div className="flex flex-col order-1 gap-2 flex-auto pb-8 overflow-y-auto">
      {children}
    </div>
  )
}

function EncodingContainer({children}) {
  return (
    <div className="flex flex-col order-1">
      {children}
    </div>
  )
}

function EncodingGroup({children}) {
  const styles = [
    "flex flex-col order-1",
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
    <div className="flex flex-row flex-wrap items-stretch order-1 gap-1 z-10 shadow-[0_0_1rem_0.5rem_rgba(255,255,255,1.0)]">
      {children}
    </div>
  )
}

function ResetButton({
  onClick,
}) {
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
      Reset
    </button>
  )
}

function ModePicker({
  items,
  value,
  setValue,
}) {
  const [ radioValue, setRadioValue ] = useState(
    Object.entries(items).find(([_, v]) => v == value)?.[0])

  const onClick = useCallback(ev => {
    const newLabel = ev.currentTarget.value
    setRadioValue(newLabel)

    const newValue = items[newLabel]
    setValue(newValue)
  }, [items, setValue, setRadioValue])

  const labelStyles = [
    "flex flex-row items-center justify-center",
    "text-xs text-slate-500 uppercase cursor-pointer",
    "hover:border-pink-400 hover:text-pink-400",
    "border-y border-r-[0.5px] border-l-[0.5px] border-slate-200",
    "px-1",
    "first:rounded-l-md last:rounded-r-md",
    "first:border-l last:border-r",
  ].join(" ")

  const selectedLabelStyles = [
    labelStyles,
    "bg-slate-400 text-white border-slate-400",
    "hover:bg-pink-400 hover:text-white hover:border-pink-400",
  ].join(" ")

  return (
    <div className="flex flex-row items-stretch">
      {Object.keys(items).map((label, i) => (
        <label
          className={radioValue == label ? selectedLabelStyles : labelStyles}
          key={i}
        >
          <input
            type="radio"
            className="hidden"
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
      className="pb-2"
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
  const basicOptionsAvailable =
        selectGroup("mark", "basic", viewMode)
  const advOptionsAvailable =
        selectGroup("mark", "advanced", viewMode)

  return (
    <GenericContainer
      title={"Mark"}
      expandable={false}
      setCustomState={setCustomState}
      advOptionsAvailable={basicOptionsAvailable ? advOptionsAvailable : false}
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
  groupName,
  setCustomState,
  viewMode,
}) {
  const basicOptionsAvailable =
        selectGroup("channelProperties", "basic", viewMode)
  const advOptionsAvailable = ["data", "aggregation", "axes"].some(g =>
        selectGroup("channelProperties", g, viewMode))

  return (
    <GenericContainer
      title={title}
      expandable={true}
      startsExpanded={isElementOf(groupName, ["basic", "requiredForSomeMarks"])}
      setCustomState={setCustomState}
      advOptionsAvailable={basicOptionsAvailable ? advOptionsAvailable : false}
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

  const showAdvanced = (newValue) => {
    if (newValue == advShown) return
    setAdvShown(newValue)
    if (setCustomState)
      setCustomState({ ...customState, [statePath]: newValue })
  }

  useEffect(() => {
    showAdvanced(advShownByDefault)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advShownByDefault, /* showAdvanced */])

  const toggleAdvanced = useCallback(() => {
    showAdvanced(!advShown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advShown, setAdvShown, setCustomState, showAdvanced])

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)

    if (expanded) {
      setAdvShown(false)
      if (setCustomState)
        setCustomState({ ...customState, [statePath]: false })
    }
  }, [expanded, setExpanded, setAdvShown, setCustomState])

  const expandedWrapperStyles = [
    "flex flex-col",
    "w-full",
    "pb-4",
    className,
  ].join(" ")

  const collapsedWrapperStyles = [
    "flex",
    "border-y border-slate-200",
    "cursor-pointer",
    "-mb-[1px]",
    className,
  ].join(" ")

  const wrapperStyles =
    expanded ? expandedWrapperStyles : collapsedWrapperStyles

  const labelWrapperStyles = [
    "flex flex-row items-center",
    "w-full",
    expanded ? "h-8" : "h-5",
  ].join(" ")

  const collapsedLabelStyles = [
    "py-1",
    "hover:text-pink-400",
  ].join(" ")

  const expandedLabelStyles = [
    "font-bold",
    expandable ? "hover:text-pink-400 cursor-pointer" : null,
  ].join(" ")

  const labelStyles = [
    "flex-1",
    "text-xs text-slate-500",
    expanded ? expandedLabelStyles : collapsedLabelStyles,
  ].join(" ")

  const childrenWrapperStyles = [
    "flex flex-col gap-1",
  ].join(" ")

  const advButtonStyles = "flex items-center w-4 opacity-50 hover:opacity-100"
  const toolbarStyles = "flex items-center justify-end flex-0"

  return (
    <div className={wrapperStyles}>
      {title && (
        <div className={labelWrapperStyles}>
          <label className={labelStyles} onClick={expandable ? toggleExpanded : null}>
            {title.toUpperCase()}
          </label>

          {expanded && setCustomState && advOptionsAvailable && (
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

function MarkPropertyGroup({
  children,
  groupName,
  statePath,
  customState,
  viewMode,
}) {
  const basicOptionsAvailable = selectGroup("mark", "basic", viewMode)

  if (groupName == "basic") {
    return (
      <div className="grid grid-cols-3 gap-1">
        {children}
      </div>
    )

  } else {
    const styles = [
      "grid grid-cols-3 gap-1 items-center",
      basicOptionsAvailable && !customState["mark"] ? "hidden" : "",
    ].join(" ")

    return (
      <div className={styles}>
        {children}
      </div>
    )
  }
}

function ChannelPropertyGroup({
  children,
  groupName,
  statePath,
  customState,
  viewMode,
}) {
  const basicOptionsAvailable =
        selectGroup("channelProperties", "basic", viewMode)

  if (!children || children.length == 0) {
    return null

  } else if (groupName == "basic") {
    return (
      <div className="grid grid-cols-3 gap-1">
        {children}
      </div>
    )

  } else {
    const styles = [
      "grid grid-cols-3 items-center gap-1",
      basicOptionsAvailable && !customState[statePath] ? "hidden" : "",
    ].join(" ")

    return (
      <div className={styles}>
        {children}
      </div>
    )
  }
}

function GenericPickerWidget({
  widgetHint,
  label,
  value,
  setValue,
  items,
  statePath,
  groupName,
}) {
  if (widgetHint == "multiselect"
    && !statePath.startsWith("encoding.y")
  ) {
    widgetHint = "select"
  }

  if (statePath == "preset") label = null

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
          value={value}
          setValue={setValue}
          groupName={groupName}
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

function WidgetWrapper({
  label,
  className,
  children,
}) {
  const labelStyles = [
    "col-span-1",
    "flex",
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
  ResetButton,
  ChannelContainer,
  ChannelPropertyGroup,
  EncodingContainer,
  EncodingGroup,
  GenericPickerWidget,
  LayerContainer,
  MarkContainer,
  MarkPropertyGroup,
  ModePicker,
  PresetsContainer,
  ToolbarContainer,
}

export default App
