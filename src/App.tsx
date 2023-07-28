import { useState, useEffect, useCallback } from "react"

import { formats } from "vega"
import arrow from "vega-loader-arrow"

import backspaceIconSvg from "./assets/backspace_FILL0_wght300_GRAD0_opsz48.svg"

import { BuilderPane, useBuilderState } from "./components/Builder.tsx"
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
  const [key, setKey] = useState(0)
  const builderState = useBuilderState(spec)

  // Handle dataset changes gracefully.
  useEffect(() => setKey(key + 1), [dataset])

  const exampleRow = dataset[0]

  // colSpec must have field:null as the 0th item.
  const colSpecs = Object.keys(exampleRow).map(name => ({
    label: name,
    field: name,
    detectedType:
      typeof exampleRow[name] == "number" ? "quantitative" :
      typeof exampleRow[name] == "boolean" ? "nominal" :
      typeof exampleRow[name] == "string" ? "nominal" :
      exampleRow[name] instanceof Date ? "temporal" :
      "nominal"
  }))
  colSpecs.unshift({ label: "None", field: null, detectedType: null })

  // TODO: Use Arrow fields to guess columnTypes:
  // arrowdata.schema.fields[0].name
  // arrowdata.schema.fields[0].type
  // arrowjs.type :: DataType.isDate, isTime, isTimestamp, isBool, isInt, isFloat

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-row gap-4">
        <BuilderPane
          key={key}
          state={builderState}
          colSpecs={colSpecs}
          baseSpec={spec}
          components={{
            LayerContainer,
            BuilderContainer,
            ToolbarContainer,
            WidgetGroup,
            GenericPickerWidget,
            Button,
          }}
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
    <div className="flex flex-col gap-8 w-56">
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

function WidgetGroup({title, children, importance}) {
  const [expanded, setExpanded] = useState(
    importance == "high" || importance == "highest")

  const toggleExpanded = useCallback(
    () => setExpanded(!expanded),
    [expanded, setExpanded])

  const isExpandable = importance != "highest"

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
    "flex items-center",
    "w-full h-8",
  ].join(" ")

  const labelStyles = [
    "text-xs font-bold",
    "text-slate-500",
    isExpandable
      ? "hover:border-pink-400 hover:text-pink-400 cursor-pointer"
      : "",
    expanded ? "pt-2" : "",
  ].join(" ")

  const childrenWrapperStyles = [
    "flex flex-row flex-wrap gap-1 items-stretch w-full",
    title ? "pl-2.5 border-l-2 border-slate-200" : null,
  ].join(" ")

  return (
    <div className={wrapperStyles}>
      {title ? (
        <div className={labelWrapperStyles}>
          <ClickableLabel
            className={labelStyles}
            onClick={isExpandable ? toggleExpanded : null}
          >
            {title.toUpperCase()}
          </ClickableLabel>
        </div>
      ) : null}

      {(expanded || !title) ? (
        <div className={childrenWrapperStyles}>
          {children}
        </div>
      ) : null}
    </div>
  )
}

function ClickableLabel({className, onClick, children}) {
  return (
    <a onClick={onClick} className={`${className} ${"select-none"} whitespace-nowrap`} role="label">
      {children}
    </a>
  )
}

function GenericPickerWidget({name, widgetHint, label, value, setValue, importance, items, placeholder}) {
  switch (widgetHint) {
    case "select":
      return (
        <SelectBox
          label={label}
          items={items}
          value={value}
          setValue={setValue}
          importance={importance ?? "low"}
        />
      )

    case "toggle":
      return (
        <Toggle
          label={label}
          items={items}
          value={value}
          setValue={setValue}
          importance={importance ?? "low"}
        />
      )

    case "text":
    case "number":
    case "json":
    default:
      return (
        <TextBox
          label={label}
          placeholder={placeholder ?? "Default"}
          value={value}
          setValue={setValue}
          importance={importance ?? "low"}
        />
      )
  }
}

// items can be list or object of label->value.
function SelectBox({label, items, value, setValue, importance}) {
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
    "text-sm py-0.5 flex-auto",
    "border bg-slate-100 hover:bg-slate-200 border-transparent rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500",
    "cursor-pointer",
  ].join(" ")

  return (
    <CollapsibleWidget
      label={label}
      isSetToDefault={value == null}
      importance={importance ?? "highest"}
    >
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
    </CollapsibleWidget>
  )
}

function TextBox({label, value, placeholder, setValue, importance}) {
  const setValueWithTypes = useCallback((ev) => {
    const newValue = ev.currentTarget.value
    setValue(newValue == "" ? null : newValue)
  }, [setValue])

  const clearValue = useCallback(
    () => setValue(null),
  [setValue])

  const styles=[
    "text-sm py-0.5 pl-1 flex-auto",
    "border bg-slate-100 hover:bg-slate-200 border-transparent rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500",
  ].join(" ")

  const hasContent = value != null && value != ""

  const buttonStyles=[
    "absolute flex items-center top-0 bottom-0 right-0 pr-2 w-6 opacity-50 hover:opacity-100",
  ].join(" ")

  return (
    <CollapsibleWidget
      label={label}
      isSetToDefault={value == "" || value == null}
      importance={importance}
      className="relative"
    >
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
    </CollapsibleWidget>
  )
}


function Toggle({label, items, value, setValue, importance}) {
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
    "peer-checked:bg-pink-500",
    "bg-slate-200",
    "rounded-full"
  ].join(" ")

  const thumbClasses = [
    "peer-checked:after:translate-x-full peer-checked:after:border-white",
    "after:content-[''] after:absolute after:top-1.5 after:left-0.5",
    "after:bg-white after:border-slate-300 after:border after:rounded-full",
    "after:h-3 after:w-3",
    "after:transition-all",
  ].join(" ")

  const toggleClasses = [troughClasses, thumbClasses].join(" ")

  return (
    <CollapsibleWidget
      label={label}
      isSetToDefault={!value}
      importance={importance}
    >
      <HtmlLabel className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={value == values[1]}
          className="sr-only peer"
          onClick={toggle}
        />
        <div className={toggleClasses}></div>
      </HtmlLabel>
    </CollapsibleWidget>
  )
}

function HtmlLabel(props) {
  return <label {...props} />
}

function CollapsibleWidget({label, isSetToDefault, importance, className, children}) {
  const [expanded, setExpanded] = useState(
    importance == "high" || importance == "highest")

  const toggleExpanded = useCallback(
    () => setExpanded(!expanded),
    [expanded, setExpanded])

  const isExpandable = importance != "highest" && isSetToDefault

  const wrapperStyles = [
    "flex flex-row items-stretch gap-2",
    "h-6 relative",
    expanded ? "w-full order-1" : "order-2",
    className,
  ].join(" ")

  const labelWrapperStyles = [
    "flex items-center",
    expanded ? "" : "pr-1"
  ].join(" ")

  const labelStyles = [
    "text-sm",
    "text-slate-500",
    isExpandable
      ? "cursor-pointer hover:text-pink-400"
      : "",
  ].join(" ")

  return (
    <div className={wrapperStyles}>
      <div className={labelWrapperStyles}>
        <ClickableLabel
          className={labelStyles}
          onClick={isExpandable ? toggleExpanded : null}
        >
          {label}
        </ClickableLabel>
      </div>
      {expanded ? children : null}
    </div>
  )
}

export default App
