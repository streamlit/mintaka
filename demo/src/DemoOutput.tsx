import styles from "./demo.module.css"

import { VLSpec } from "mintaka"

export default function DemoOutput({ generatedSpec }: VLSpec) {
  return (
    <div className={styles.DemoOutput}>
      <h2>
        Demo output
      </h2>

      <p>
        Mintaka outputs a Vega-Lite chart spec, as shown below.
      </p>

      <code className={styles.OutputCode}>
        { JSON.stringify(generatedSpec, undefined, 4) }
      </code>
    </div>
  )
}
