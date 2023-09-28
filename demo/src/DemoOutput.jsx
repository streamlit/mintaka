import styles from "./demo.module.css"

export default function DemoOutput({ generatedSpec }) {
  return (
    <div className={styles.DemoOutput}>
      <h2>
        Demo output
      </h2>

      <p>
        Deneb outputs a Vega-Lite chart spec, as shown below.
      </p>

      <code className={styles.OutputCode}>
        { JSON.stringify(generatedSpec, undefined, 4) }
      </code>
    </div>
  )
}
