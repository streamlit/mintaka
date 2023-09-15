import { useState, useEffect } from "react"

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
import styles from "./demo.module.css"

function App() {
  const [dataset, setDataset] = useState(irisDataset)
  const [columnTypes, setcolumnTypes] = useState({})
  const [key, setKey] = useState(0)

  // Handle dataset changes gracefully.
  useEffect(() => {
    setKey(key + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dataset ])

  useEffect(() => {
    setcolumnTypes(Object.fromEntries(
      Object.entries(dataset[0]).map(([colName, value]) => ([
        colName,
        { type: simpleColumnTypeDetector(value), unique: null }
      ]))))
  }, [dataset])

  return (
    <div className={styles.DemoWrapper}>
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

      <div className={styles.PageWrapper}>
        <Demo1 dataset={dataset} columnTypes={columnTypes} key={`demo1-${key}`} />
        <Demo2 dataset={dataset} columnTypes={columnTypes} key={`demo2-${key}`} />
        <Demo3 dataset={dataset} columnTypes={columnTypes} key={`demo3-${key}`} />
      </div>
    </div>
  )
}

export default App
