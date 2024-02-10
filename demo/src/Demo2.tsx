import { useState } from "react"

import { Mintaka } from "mintaka"

import DemoOutput from "./DemoOutput"
import DemoInfo from "./DemoInfo"
import PreviewPane from "./PreviewPane"
import { DemoProps } from "./demoProps"

import {
  MintakaContainer,
  ButtonToolbar,
  ChannelContainer,
  EncodingContainer,
  GenericPickerWidget,
  LayerContainer,
  MarkContainer,
  PresetsContainer,
  ViewModeToolbar,
  LayerPicker,
} from "./ui"

import styles from "./demo.module.css"

export default function Demo({ demo, dataset, columnTypes }: DemoProps) {
  const [generatedSpec, setGeneratedSpec] = useState({})

  return (
    <div className={styles.DemoWrapper}>
      <div>
        <DemoInfo demo={demo} />

        <div className={styles.BuilderWrapper}>
          <Mintaka
            columnTypes={columnTypes}
            setGeneratedSpec={setGeneratedSpec}
            ui={{
              MintakaContainer,
              ChannelContainer,
              EncodingContainer,
              GenericPickerWidget,
              LayerContainer,
              LayerPicker,
              MarkContainer,
              PresetsContainer,
              TopUtilBlock: ViewModeToolbar,
              BottomUtilBlock: ButtonToolbar,
            }}
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
