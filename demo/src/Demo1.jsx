import { useState, useEffect } from "react"

import { Mintaka } from "mintaka"

import DemoInfo from "./DemoInfo"
import DemoOutput from "./DemoOutput"
import PreviewPane from "./PreviewPane"
import { PRESETS } from "./presets"

import {
  MintakaContainer,
  ChannelContainer,
  EmptyBlock,
  EncodingContainer,
  GenericPickerWidget,
  LayerContainer,
  MarkContainer,
  MegaToolbar,
  PresetsContainer,
} from "./ui"

import styles from "./demo.module.css"

export default function Demo({ demo, dataset, columnTypes }) {
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
