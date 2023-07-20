import { useState, useCallback } from 'react'

import { formats } from 'vega'
import arrow from 'vega-loader-arrow'

import { BuilderPane, useBuilderState } from './components/Builder.tsx'
import { PreviewPane } from './components/PreviewPane.tsx'
import irisDataset from './data/iris.ts'

import './App.css'

// Register arrow reader under type 'arrow'
formats('arrow', arrow);

const spec = {
  width: 600,
  height: 600,
  data: { name: 'main' }, // note: Vega-Lite data attribute is a plain Object instead of an array
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
      typeof exampleRow[name] == 'number' ? 'quantitative' :
      typeof exampleRow[name] == 'boolean' ? 'nominal' :
      typeof exampleRow[name] == 'string' ? 'nominal' :
      exampleRow[name] instanceof Date ? 'temporal' :
      'nominal'
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
          origSpec={spec}
          components={{
            BuilderWrapper,
            WidgetGroup,
            WidgetWrapper,
            Label,
            SelectBox,
            TextBox,
          }}
        />
        <PreviewPane
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

function BuilderWrapper({children}) {
  return (
    <div className="flex flex-col gap-2 w-56">
      {children}
    </div>
  )
}

function WidgetGroup({title, children}) {
  return (
    <div className="grid grid-cols-3 gap-1 items-center">
      <div className="text-xs font-bold text-slate-500 pt-4 col-start-1 col-span-3">{title}</div>
      {children}
    </div>
  )
}

function WidgetWrapper({children}) {
  return (
    children
  )
}

function Label({children}) {
  return (
    <label className="block text-xs text-slate-500 col-start-1 col-span-1">
      {children}
    </label>
  )
}

// items can be list or object of label->value.
function SelectBox({items, value, setValue}) {
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

  return (
    <select
      className="col-start-2 col-span-2 border border-slate-200 rounded-md text-sm py-0.5 px-1"
      defaultValue={labels[values.indexOf(value)]}
      onChange={setValueCallback}
    >
      {labels.map(label => (
        <option value={label} key={label}>
          {label}
        </option>
      ))}
    </select>
  )
}

function TextBox({value, setValue}) {
  const setValueCallback = useCallback((ev) => {
    const newValue = ev.currentTarget.value
    setValue(newValue == "" ? null : newValue)
  }, [setValue])

  return (
    <input
      className="col-start-2 col-span-2 border border-slate-200 rounded-md text-sm py-0.5 px-1"
      type="text"
      value={value ?? ""}
      placeholder={"Default"}
      onChange={setValueCallback}
    />
  )
}

export default App
