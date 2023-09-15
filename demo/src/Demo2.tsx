import { useState, useEffect } from "react"

import { formats } from "vega"

import {
  BuilderPane,
  PreviewPane,
  simpleColumnTypeDetector,
} from "../../src"

import * as ui from "./ui"

import barleyDataset from "../data/barley.json"
import carsDataset from "../data/cars.json"
import disastersDataset from "../data/disasters.json"
import drivingDataset from "../data/driving.json"
import irisDataset from "../data/iris.json"
import moviesDataset from "../data/movies.json"
import populationDataset from "../data/population.json"

import styles from "./demo.module.css"

function App() {
  const [dataset, setDataset] = useState(irisDataset)
  const [columnTypes, setcolumnTypes] = useState({})
  const [key, setKey] = useState(0)
  const [generatedSpec, setGeneratedSpec] = useState()

  // Handle dataset changes gracefully.
  useEffect(() => {
    setKey(key + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataset,
    // Not including:
    // key,
    // setKey,
  ])

  useEffect(() => {
    setcolumnTypes(Object.fromEntries(
      Object.entries(dataset[0]).map(([colName, value]) => ([
        colName,
        { type: simpleColumnTypeDetector(value), unique: null }
      ]))))
  }, [dataset])

  return (
    <div className={styles.DemoWrapper}>
      <h1 className={styles.DemoTitle}>
        Demo 2: Custom modes
      </h1>

      <div className={styles.BuilderWrapper}>
        <BuilderPane
          key={key}
          columnTypes={columnTypes}
          setGeneratedSpec={setGeneratedSpec}
          ui={ui}
          modes={modes}
        />

        <PreviewPane
          className={styles.PreviewPane}
          spec={generatedSpec}
          data={dataset}
        />
      </div>

      <details className={styles.Details}>
        <summary className={styles.DetailsSummary}>
          Demo input / output
        </summary>

        <div className={styles.DetailsChild}>

          <div className={styles.DatasetPickerWrapper}>
            <h3 className={styles.DatasetPickerLabel}>Input</h3>
            <ui.SelectBox
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

          <div className={styles.OutputWrapper}>
            <h3 className={styles.OutputLabel}>Output</h3>
            <code className={styles.OutputCode}>
              { JSON.stringify(generatedSpec, undefined, 4) }
            </code>
          </div>
        </div>
      </details>
    </div>
  )
}

const modes = {
  Base: {
    presets: true,
    encoding: new Set(["x", "y", "theta", "latitude", "longitude", "color"]),
    channelProperties: new Set(["field"]),
    else: false,
  },

  Agg: {
    encoding: new Set(["x", "y", "theta", "latitude", "longitude", "color"]),
    channelProperties: new Set(["aggregate", "bin", "binStep", "maxBins"]),
    else: false,
  },

  Axis: {
    encoding: new Set(["x", "y", "theta", "latitude", "longitude", "color"]),
    channelProperties: new Set([
      "scaleType", "scheme", "domain", "range", "zero", "sort", "stack",
      "timeUnit", "title", "legend",
    ]),
    else: false,
  },

  Mark: {
    mark: true,
    else: false,
  },

  Adv: {
    presets: false,
  },
}


export default App
