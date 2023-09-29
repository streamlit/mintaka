import { useState, useEffect } from "react"

import { BuilderPane } from "deneb"

import * as ui from "./ui"
import DemoOutput from "./DemoOutput"
import DemoInfo from "./DemoInfo"
import PreviewPane from "./PreviewPane"

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
            modes={modes}
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
