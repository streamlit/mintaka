import React from "react"
import { VegaLite } from "react-vega"


interface PreviewProps {
  data: any,
  spec: any,
  className: str,
}

export function PreviewPane(props: PreviewProps): React.Node {
  return (
      <VegaLite
        className={props.className}
        spec={props.spec}
        data={props.data}
      />
  )
}

