import { useState, useEffect, useCallback } from "react"

import { formats } from "vega"
import arrow from "vega-loader-arrow"

import backspaceIconSvg from "./assets/backspace_FILL0_wght300_GRAD0_opsz48.svg"
import tuneIconSvg from "./assets/tune_FILL0_wght300_GRAD0_opsz48.svg"
import settingsIconSvg from "./assets/settings_FILL0_wght300_GRAD0_opsz48.svg"

import { BuilderPane, useBuilderState, simpleColumnTypeDetector } from "./components/Builder.tsx"
import { PreviewPane } from "./components/PreviewPane.tsx"

import irisDataset from "./data/iris.json"
import carsDataset from "./data/cars.json"
import drivingDataset from "./data/driving.json"
import moviesDataset from "./data/movies.json"
import populationDataset from "./data/population.json"

import "./App.css"

// Register arrow reader under type "arrow"
formats("arrow", arrow);

const spec = {
  mark: "circle", // Anything. So Vega doesn't throw a warning.
  width: "container",
  height: "container",
}

function App() {
  const [dataset, setDataset] = useState(irisDataset)
  const [columns, setColumns] = useState([])
  const [key, setKey] = useState(0)
  const builderState = useBuilderState(spec)

  // Handle dataset changes gracefully.
  useEffect(() => setKey(key + 1), [dataset])

  useEffect(() => {
    setColumns(
      Object.entries(dataset[0]).map(([colName, value]) => ({
        colName,
        detectedType: simpleColumnTypeDetector(value),
      })))
  }, [dataset])

  return (
    <div className="flex flex-col gap-32">
      <div className="flex h-[800px] flex-row border border-slate-200 rounded">
        <BuilderPane
          key={key}
          state={builderState}
          columns={columns}
          baseSpec={spec}
          components={COMPONENTS}
        />

        <PreviewPane
          className="flex-auto align-self-stretch"
          spec={builderState.spec}
          data={dataset}
        />
      </div>

      <details>
        <summary className="text-slate-500 border-t border-slate-300 pt-2 hover:text-pink-400 cursor-pointer text-sm">Demo input / output</summary>

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
              { JSON.stringify(builderState.spec, undefined, 4) }
            </code>
          </pre>
        </div>
      </details>
    </div>
  )
}

function BuilderContainer({children}) {
  return (
    <div className="flex flex-col gap-8 p-4 w-64 overflow-y-auto">
      {children}
    </div>
  )
}

function LayerContainer({children}) {
  return (
    <div className="flex flex-row flex-wrap content-start">
      {children}
    </div>
  )
}

function ToolbarContainer({children}) {
  return (
    <div className="flex-auto flex flex-row flex-wrap items-end">
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

function MarkContainer({children}) {
  const styles = [
    "flex flex-row gap-2",
    "order-1",
    "pb-4",
    "w-full",
  ].join(" ")

  return (
    <div className={styles}>
      {children}
    </div>
  )
}

function ChannelContainer({title, children, expandedByDefault, showAdvanced}) {
  const [expanded, setExpanded] = useState(expandedByDefault)
  const [advShown, setAdvShown] = useState(false)

  const toggleAdvanced = useCallback(() => {
    setAdvShown(!advShown)
    showAdvanced(!advShown)
  }, [advShown, setAdvShown, showAdvanced])

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)
    if (!expanded == false) {
      showAdvanced(false)
    }
  }, [expanded, setExpanded])

  const expandedWrapperStyles = [
    "flex flex-col",
    "w-full pb-4",
    "order-1",
  ].join(" ")

  const collapsedWrapperStyles = [
    "inline-flex pr-2 last:pr-0",
    "order-2",
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
    "hover:border-pink-400 hover:text-pink-400 cursor-pointer"
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
          <label className={labelStyles} onClick={toggleExpanded}>
            {title.toUpperCase()}
          </label>

          {expanded && (
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

function BasicFieldsContainer({children}) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {children}
    </div>
  )
}

function AdvancedFieldsContainer({visible, children}) {
  const styles = [
    "grid grid-cols-3 gap-1",
    visible ? "" : "hidden",
  ].join(" ")

  return (
    <div className={styles}>
      {children}
    </div>
  )
}

function GenericPickerWidget({widgetHint, label, value, setValue, advanced, items, placeholder}) {
  switch (widgetHint) {
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
          placeholder={placeholder ?? "Default"}
          value={value}
          setValue={setValue}
        />
      )
  }
}

function SelectBox({label, items, value, setValue, small}) {
  let labels, values

  if (Array.isArray(items)) {
    labels = items
    values = items
  } else {
    labels = Object.keys(items)
    values = Object.values(items)
  }

  const setValueWithTypes = useCallback((ev) => {
    const label = ev.currentTarget.value
    const newValue = values[labels.indexOf(label)]

    setValue(newValue)
  }, [labels, values, setValue])

  const currIndex = values.indexOf(value)
  const currClickableLabel = labels[currIndex]

  const styles=[
    "py-0.5 flex-auto",
    "border hover:bg-slate-200 border-transparent rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500",
    "cursor-pointer",
    "bg-slate-100",
    small ? "text-xs" : "text-sm",
  ].join(" ")

  return (
    <WidgetWrapper label={label} small={small}>
      <select
        className={styles}
        defaultValue={currClickableLabel}
        onChange={setValueWithTypes}
      >
        {labels.map(label => (
          <option value={label} key={label}>
            {label}
          </option>
        ))}
      </select>
    </WidgetWrapper>
  )
}

function TextInput({label, value, placeholder, setValue, small}) {
  const setValueWithTypes = useCallback((ev) => {
    const newValue = ev.currentTarget.value
    setValue(newValue == "" ? null : newValue)
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
    small ? "text-xs" : "text-sm",
  ].join(" ")

  const hasContent = value != null && value != ""

  const buttonStyles=[
    "absolute top-0 bottom-0 right-0 w-6",
    "flex items-center w-6 opacity-50 hover:opacity-100",
  ].join(" ")

  return (
    <WidgetWrapper label={label} className="relative" small={small}>
      <input
        className={styles}
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={setValueWithTypes}
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

function Toggle({label, items, value, setValue, small}) {
  let labels, values

  if (Array.isArray(items)) {
    labels = items
    values = items
  } else {
    labels = Object.keys(items)
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
    "after:bg-white after:border-slate-300",
    "after:border after:rounded-full",
    "after:h-3 after:w-3",
    "after:transition-all",
  ].join(" ")

  const toggleClasses = [troughClasses, thumbClasses].join(" ")

  return (
    <WidgetWrapper label={label} small={small}>
      <HtmlLabel className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
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

function WidgetWrapper({label, small, className, children}) {
  const labelStyles = [
    "col-span-1",
    "flex items-center",
    "text-sm",
    "text-slate-500",
    small ? "text-xs" : "text-sm",
  ].join(" ")

  const childrenStyles = [
    "col-span-2",
    "flex-auto",
    "flex flex-col justify-center items-stretch",
    "h-6",
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

const COMPONENTS = {
  LayerContainer,
  BuilderContainer,
  ToolbarContainer,
  MarkContainer,
  ChannelContainer,
  AdvancedFieldsContainer,
  BasicFieldsContainer,
  GenericPickerWidget,
  Button,
}

export default App
