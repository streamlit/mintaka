import { useCallback, useState, useEffect, ChangeEvent } from "react"
import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import barleyDataset from "../data/barley.json"
import carsDataset from "../data/cars.json"
import disastersDataset from "../data/disasters.json"
import drivingDataset from "../data/driving.json"
import penguinsDataset from "../data/penguins.json"
import populationDataset from "../data/population.json"

import { simpleColumnTypeDetector } from "../../mintaka/src"

import * as ui from "./ui.tsx"

import Demo1 from "./Demo1.tsx"
import Demo2 from "./Demo2.tsx"
import Demo3 from "./Demo3.tsx"

import logo from "../assets/logo.svg"

import './main.css'
import '@ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import '@ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import styles from "./demo.module.css"
import utilStyles from "./util.module.css"
import { DemoMeta } from "./demoProps.ts";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
]);

const DEMOS: DemoMeta[] = [
  {
    title: "Basic",
    description: "Shows the default settings, plus custom chart presets.",
    component: Demo1,
  },
  {
    title: "Paginated properties",
    description: "Splits the available chart props into 5 different pages.",
    component: Demo2,
  },
  {
    title: "Modeless and filtered",
    description: "Shows everything in a single page, but hides less common chart props.",
    component: Demo3,
  }
]


function App() {
  const [dataset, setDataset] = useState(penguinsDataset)
  const [columnTypes, setcolumnTypes] = useState({})
  const [agGridColumnDefs, setAgGridColumnDefs] = useState<any>(null)
  const [key, setKey] = useState(0)
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0)
  const selectedDemo = DEMOS[selectedDemoIndex]

  useEffect(() => {
    // Handle dataset changes gracefully.
    setKey(key + 1)

    const firstRow = dataset[0]

    setcolumnTypes(Object.fromEntries(
      Object.entries(firstRow).map(([colName, value]) => ([
        colName,
        { type: simpleColumnTypeDetector(value), unique: null }
      ]))))

    setAgGridColumnDefs(Object.keys(firstRow).map(colName => ({
      field: colName,
    })))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dataset ])

  const [gridOptions] = useState({
    onFirstDataRendered: (ev: any) => ev.api.sizeColumnsToFit(),
  })

  const setDemoCallback = useCallback((ev: ChangeEvent) => {
    const valueStr = (ev.currentTarget as HTMLInputElement).value
    const index = parseInt(valueStr, 10)
    setSelectedDemoIndex(index)
  }, [ setSelectedDemoIndex ])

  return (
    <div className={styles.PageWrapper}>
      <div className={styles.Intro}>

        <img src={logo} style={{ width: "6rem", height: "6rem"}} />

        <h1>
          Mintaka
        </h1>

        <div className={styles.Text}>
          <p>
            Mintaka is an open-source chart builder library for{" "}
            <a href="https://vega.github.io/vega-lite/">Vega-Lite</a> written in React.
          </p>

          <p>
            What makes it special is that it's ultra-configurable:
          </p>

          <ul>
            <li><strong>Mintaka uses <em>your</em> React components.</strong> All labels, selectboxes, etc, that is draws are provided by you.</li>
            <li>You choose which Vega-Lite properties to expose to the user.</li>
            <li>You can specify smart chart presets, so users don't need to know anything about Vega-Lite.</li>
            <li>And much more! See <a href="https://github.com/streamlit/mintaka">the README on GitHub</a> for more.</li>
          </ul>

          <p>
            Below is a demo of Mintaka in action.
          </p>
        </div>
      </div>

      <div className={styles.DemoInput}>
        <div className={styles.DatasetPickerWrapper}>
          <h2>Pick a dataset</h2>
          <ui.SelectBox
            items={{
              penguins: penguinsDataset,
              barley: barleyDataset,
              cars: carsDataset,
              disasters: disastersDataset,
              driving: drivingDataset,
              population: populationDataset,
            }}
            value={penguinsDataset}
            setValue={setDataset}
          />
        </div>

        <details>
          <summary className={styles.PreviewDatasetToggle}>
            Preview dataset
          </summary>

          <div className="ag-theme-alpine" style={{height: 500}}>
            <AgGridReact
              rowData={dataset}
              columnDefs={agGridColumnDefs}
              gridOptions={gridOptions}
              />
          </div>
        </details>
      </div>

      <div>
        <h2>Pick a demo</h2>
        <ul className={styles.DemoPicker}>
          {DEMOS.map((demo, i) => (
            <li key={i} data-checked={i == selectedDemoIndex}>
              <label>
                <input
                  type="radio"
                  name="demoPicker"
                  value={i}
                  defaultChecked={i == selectedDemoIndex}
                  className={utilStyles.HiddenInput}
                  onChange={setDemoCallback}
                />
                <h3>{demo.title}</h3>
                <p>{demo.description}</p>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <selectedDemo.component
        demo={selectedDemo}
        dataset={dataset}
        columnTypes={columnTypes}
      />
    </div>
  )
}

export default App
