import { useState, useCallback } from "react"

import { formats } from "vega"
import arrow from "vega-loader-arrow"

import { BuilderPane, useBuilderState } from "./components/Builder.tsx"
import { PreviewPane } from "./components/PreviewPane.tsx"
import irisDataset from "./data/iris.ts"

import "./App.css"

// Register arrow reader under type "arrow"
formats("arrow", arrow);

const spec = {
  mark: "circle", // Anything. So Vega doesn't throw a warning.
  width: 500, // BUG: "container" doesn't work with facet/rows/columns
  height: 500, // BUG: "container" doesn't work with facet/rows/columns
  data: { name: "main" }, // note: Vega-Lite data attribute is a plain Object instead of an array
}

function App() {
  const builderState = useBuilderState(spec)
  const dataset = irisDataset

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-4">
        <BuilderPane
          state={builderState}
          colSpecs={colSpecs}
          baseSpec={spec}
          channels={{
            "X": "x",
            "Y": "y",
            "Color": "color",
            "Size": "size",
            "Opacity": "opacity",
            "Facet": "facet",
            "Row": "row",
            "Column": "column",
            "X2": "x2",
            "Y2": "y2",
          }}
          components={{
            LayerContainer,
            BuilderContainer,
            ToolbarContainer,
            WidgetGroup,
            SelectBox,
            TextBox,
            Button,
          }}
        />
        <PreviewPane
          className="flex-auto align-self-stretch"
          spec={builderState.spec}
          data={{
            main: dataset,
          }}
        />
      </div>

      <div>
        <h2>JSON</h2>
        <pre>
          <code>
            { JSON.stringify(builderState.spec, undefined, 4) }
          </code>
        </pre>
      </div>
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
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function WidgetGroup({title, children, visibilityState}) {
  const [expanded, setExpanded] = useState(
    visibilityState == "expanded" || visibilityState == "always")

  const toggleExpanded = useCallback(
    () => setExpanded(!expanded),
    [expanded, setExpanded])

  const isExpandable = visibilityState != "always"

  const expandedWrapperStyles = [
    "flex flex-row flex-wrap gap-1 items-stretch",
    "w-full pb-2",
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
    "w-full h-8 pt-4",
  ].join(" ")

  const labelStyles = [
    "text-xs font-bold",
    "text-slate-500",
    "border-b-2 border-slate-200",
    isExpandable
      ? "hover:border-pink-400 hover:text-pink-400 cursor-pointer select-none"
      : "",
  ].join(" ")

  return (
    <div className={wrapperStyles}>
      {title ? (
        <div className={labelWrapperStyles}>
          <Label
            className={labelStyles}
            onClick={isExpandable ? toggleExpanded : null}
          >
            {title.toUpperCase()}
          </Label>
        </div>
      ) : null}
      {(expanded || !title) ? children : null}
    </div>
  )
}

function Label({children, ...args}) {
  return (
    <label {...args}>
      {children}
    </label>
  )
}

// items can be list or object of label->value.
function SelectBox({label, items, value, setValue, visibilityState}) {
  let labels, values

  if (Array.isArray(items)) {
    labels = items
    values = items
  } else {
    labels = Object.keys(items)
    values = Object.values(items)
  }

  const setValueCallback = useCallback((ev) => {
    const label = ev.currentTarget.value
    const newValue = values[labels.indexOf(label)]

    setValue(newValue)
  }, [labels, values, setValue])

  const currIndex = values.indexOf(value)
  const currLabel = labels[currIndex]

  const styles=[
    "text-xs py-0.5 flex-auto",
    "border bg-slate-100 border-transparent hover:border-pink-400 rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500 hover:text-pink-400",
  ].join(" ")

  return (
    <CollapsibleWidget
      label={label}
      isSetToDefault={value == null}
      visibilityState={visibilityState}
    >
      <select
        className={styles}
        defaultValue={currLabel}
        onChange={setValueCallback}
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

function TextBox({label, value, placeholder, setValue, visibilityState}) {
  const setValueCallback = useCallback((ev) => {
    const newValue = ev.currentTarget.value
    setValue(newValue == "" ? null : newValue)
  }, [setValue])

  const styles=[
    "text-xs py-0.5 px-1 flex-auto",
    "border bg-slate-100 border-transparent hover:border-pink-400 rounded-md",
    "focus:outline-0 focus:border-pink-400 focus:ring ring-pink-200",
    "text-slate-500 hover:text-pink-400",
  ].join(" ")

  return (
    <CollapsibleWidget
      label={label}
      isSetToDefault={value == "" || value == null}
      visibilityState={visibilityState}
    >
      <input
        className={styles}
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={setValueCallback}
      />
    </CollapsibleWidget>
  )
}

function CollapsibleWidget({label, isSetToDefault, visibilityState, children}) {
  const [expanded, setExpanded] = useState(
    visibilityState == "expanded" || visibilityState == "always")

  const toggleExpanded = useCallback(
    () => setExpanded(!expanded),
    [expanded, setExpanded])

  const isExpandable = visibilityState != "always"

  const wrapperStyles = [
    "flex flex-row items-stretch gap-2",
    "h-6",
    expanded ? "w-full order-1" : "order-2",
  ].join(" ")

  const labelWrapperStyles = [
    "flex items-center",
    expanded ? "" : "pr-1"
  ].join(" ")

  const labelStyles = [
    "text-xs",
    "text-slate-500",
    isExpandable
      ? "cursor-pointer select-none hover:text-pink-400"
      : "",
    (!expanded && !isSetToDefault) ? "font-bold" : "",
  ].join(" ")

  return (
    <div className={wrapperStyles}>
      <div className={labelWrapperStyles}>
        <Label
          className={labelStyles}
          onClick={isExpandable ? toggleExpanded : null}
        >
          {label}
        </Label>
      </div>
      {expanded ? children : null}
    </div>
  )
}

export default App
