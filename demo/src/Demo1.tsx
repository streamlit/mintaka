import { useState } from "react"

import { Mintaka } from "mintaka"

import DemoInfo from "./DemoInfo"
import DemoOutput from "./DemoOutput"
import PreviewPane from "./PreviewPane"
import { PRESETS } from "./presets"
import { DemoProps } from "./demoProps"

import {
  MintakaContainer,
  ChannelContainer,
  EmptyBlock,
  EncodingContainer,
  GenericPickerWidget,
  LayerBuilder,
  MarkContainer,
  MegaToolbar,
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
              BottomUtilBlock: MegaToolbar,
            }}
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
