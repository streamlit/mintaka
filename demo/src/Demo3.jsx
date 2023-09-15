import { useState, useEffect } from "react"

import {
  BuilderPane,
  PreviewPane,
  simpleColumnTypeDetector,
} from "../../src"

import * as ui from "./ui"

import styles from "./demo.module.css"

function Demo3({ dataset, columnTypes }) {
  const [generatedSpec, setGeneratedSpec] = useState()

  return (
    <div className={styles.DemoWrapper}>
      <h1 className={styles.DemoTitle}>
        Demo 3: Custom modes
      </h1>

      <div className={styles.BuilderWrapper}>
        <BuilderPane
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
  "Default": {
    mark: new Set(["type", "shape", "filled"]),
    encoding: new Set(["x", "y", "color", "size", "opacity"]),
    channelProperties: new Set(["field", "aggregate", "bin", "stack", "sort", "scale"]),
    else: false,
  },
}

export default Demo3
