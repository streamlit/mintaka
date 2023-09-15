import { useState, useEffect } from "react"

import {
  BuilderPane,
  PreviewPane,
  simpleColumnTypeDetector,
} from "../../src"

import * as ui from "./ui"
import { PRESETS } from "./presets"

import styles from "./demo.module.css"

function Demo2({ dataset, columnTypes }) {
  const [generatedSpec, setGeneratedSpec] = useState()

  return (
    <div className={styles.DemoWrapper}>
      <h1 className={styles.DemoTitle}>
        Demo 2: Custom modes
      </h1>

      <div className={styles.BuilderWrapper}>
        <BuilderPane
          columnTypes={columnTypes}
          setGeneratedSpec={setGeneratedSpec}
          ui={ui}
          presets={PRESETS}
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
    else: true,
  },
}

export default Demo2
