import styles from "./demo.module.css"
import { DemoMeta } from "./demoProps"

interface DemoInfoProps {
  demo: DemoMeta
}

export default function DemoInfo({ demo }: DemoInfoProps) {
  return (
    <div className={styles.DemoInfo}>
      <h2>
        Selected demo: { demo.title }
      </h2>

      <p>
        { demo.description }
      </p>

      <p className={styles.Note}>
        Mintaka is the component on the left of the chart, but you can place it anywhere you want.
        And remember that the look-and-feel is completely configurable, since you can pass your own
        React components.
      </p>

    </div>
  )
}
