import styles from "./demo.module.css"

export default function DemoInfo({ demo }) {
  return (
    <div styled={styles.DemoInfo}>
      <h2>
        Selected demo: { demo.title }
      </h2>

      <p>
        { demo.description }
      </p>

      <br />
    </div>
  )
}
