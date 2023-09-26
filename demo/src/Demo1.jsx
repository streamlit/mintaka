import { useState, useEffect } from "react"

import { BuilderPane } from "deneb"

import * as ui from "./ui"
import DemoInfo from "./DemoInfo"
import DemoOutput from "./DemoOutput"
import PreviewPane from "./PreviewPane"
import { PRESETS } from "./presets"

import styles from "./demo.module.css"

export default function Demo({ demo, dataset, columnTypes }) {
  const [generatedSpec, setGeneratedSpec] = useState()

  return (
    <div className={styles.DemoWrapper}>
      <div>
        <DemoInfo demo={demo} />

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
      </div>

      <DemoOutput generatedSpec={generatedSpec} />
    </div>
  )
}
