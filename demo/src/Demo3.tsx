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
  EmptyBlock,
  EncodingContainer,
  GenericPickerWidget,
  LayerBuilder,
  MarkContainer,
  PresetsContainer,
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
              LayerBuilder,
              LayerPicker,
              MarkContainer,
              PresetsContainer,
              TopUtilBlock: EmptyBlock,
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
  "Default": {
    mark: new Set(["type", "shape", "filled"]),
    encoding: new Set(["x", "y", "color", "size", "opacity"]),
    channelProperties: new Set([
      "field", "value", "type", "aggregate", "bin", "binStep", "maxBins",
      "stack", "sort", "scale",
    ]),
    else: false,
  },
}
