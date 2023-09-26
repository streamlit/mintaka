import { useCallback, useState, useEffect } from "react"
import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import barleyDataset from "../data/barley.json"
import carsDataset from "../data/cars.json"
import disastersDataset from "../data/disasters.json"
import drivingDataset from "../data/driving.json"
import irisDataset from "../data/iris.json"
import populationDataset from "../data/population.json"

import { simpleColumnTypeDetector } from "deneb"

import * as ui from "./ui"

import Demo1 from "./Demo1"
import Demo2 from "./Demo2"
import Demo3 from "./Demo3"

import './main.css'
import '@ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import '@ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import styles from "./demo.module.css"
import utilStyles from "./util.module.css"

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
]);

const DEMOS = [
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
  const [dataset, setDataset] = useState(irisDataset)
  const [columnTypes, setcolumnTypes] = useState({})
  const [agGridColumnDefs, setAgGridColumnDefs] = useState(null)
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
    onFirstDataRendered: (ev) => ev.api.sizeColumnsToFit(),
  })

  const setDemoCallback = useCallback((ev) => {
    const valueStr = ev.target.value
    const index = parseInt(valueStr, 10)
    setSelectedDemoIndex(index)
  }, [ setSelectedDemoIndex ])

  return (
    <div className={styles.PageWrapper}>
      <div>
        <h1>
          Deneb demo
        </h1>

        <p>
          Deneb is a chart builder library for <a href="https://vega.github.io/vega-lite/">Vega-Lite</a>.
          For more information, see <a href="https://github.com/streamlit/deneb">Deneb's page on Github</a>.
        </p>
      </div>

      <div className={styles.DemoInput}>
        <div className={styles.DatasetPickerWrapper}>
          <h2>Pick a dataset</h2>
          <ui.SelectBox
            label={null}
            items={{
              iris: irisDataset,
              barley: barleyDataset,
              cars: carsDataset,
              disasters: disastersDataset,
              driving: drivingDataset,
              population: populationDataset,
            }}
            value={irisDataset}
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
        <ul className={styles.DemoPicker} onChange={setDemoCallback}>
          {DEMOS.map((demo, i) => (
            <li key={i} data-checked={i == selectedDemoIndex}>
              <label>
                <input
                  type="radio"
                  name="demoPicker"
                  value={i}
                  defaultChecked={i == selectedDemoIndex}
                  className={utilStyles.HiddenInput}
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
