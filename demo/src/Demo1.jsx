import { useState, useEffect } from "react"

import {
  BuilderPane,
  PreviewPane,
  simpleColumnTypeDetector,
} from "../../src"

import * as ui from "./ui"
import { PRESETS } from "./presets"

import styles from "./demo.module.css"

function Demo1({ dataset, columnTypes }) {
  const [generatedSpec, setGeneratedSpec] = useState()

  return (
    <div className={styles.DemoWrapper}>
      <h1 className={styles.DemoTitle}>
        Demo 1: Default experience + presets
      </h1>

      <div className={styles.BuilderWrapper}>
        <BuilderPane
          columnTypes={columnTypes}
          setGeneratedSpec={setGeneratedSpec}
          ui={ui}
          presets={PRESETS}
        />

        <PreviewPane
          className={styles.PreviewPane}
          spec={generatedSpec}
          data={dataset}
        />
      </div>

      <details className={styles.Details}>
        <summary className={styles.DetailsSummary}>
          Demo output
        </summary>

        <code className={styles.OutputCode}>
          { JSON.stringify(generatedSpec, undefined, 4) }
        </code>
      </details>
    </div>
  )
}

export default Demo1
