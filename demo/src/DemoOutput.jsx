import styles from "./demo.module.css"

export default function DemoOutput({ generatedSpec }) {
  return (
    <div styled={styles.TitledContainer}>
      <h2>
        Demo output
      </h2>

      <code className={styles.OutputCode}>
        { JSON.stringify(generatedSpec, undefined, 4) }
      </code>
    </div>
  )
}
