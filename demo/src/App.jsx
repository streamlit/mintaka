import { useState, useEffect } from "react"
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import {
  BuilderPane,
  PreviewPane,
  simpleColumnTypeDetector,
} from "../../src"

import * as ui from "./ui"
import { PRESETS } from "./presets"

import Demo1 from "./Demo1"
import Demo2 from "./Demo2"
import Demo3 from "./Demo3"

import barleyDataset from "../data/barley.json"
import carsDataset from "../data/cars.json"
import disastersDataset from "../data/disasters.json"
import drivingDataset from "../data/driving.json"
import irisDataset from "../data/iris.json"
import moviesDataset from "../data/movies.json"
import populationDataset from "../data/population.json"

import './main.css'
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import styles from "./demo.module.css"

function App() {
  const [dataset, setDataset] = useState(irisDataset)
  const [columnTypes, setcolumnTypes] = useState({})
  const [agGridColumnDefs, setAgGridColumnDefs] = useState(null)
  const [key, setKey] = useState(0)

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

  return (
    <div className={styles.PageWrapper}>
      <div className={styles.DemoInput}>
        <div className={styles.DatasetPickerWrapper}>
          <ui.SelectBox
            label="Dataset for demos below:"
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

        <details className={styles.Details}>
          <summary className={styles.DetailsSummary}>
            Preview data
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

      <Demo1 dataset={dataset} columnTypes={columnTypes} key={`demo1-${key}`} />
      <Demo2 dataset={dataset} columnTypes={columnTypes} key={`demo2-${key}`} />
      <Demo3 dataset={dataset} columnTypes={columnTypes} key={`demo3-${key}`} />
    </div>
  )
}

export default App
