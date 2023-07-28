import React from "react"
import { Vega } from "react-vega"

interface PreviewProps {
  data: any,
  spec: any,
  className: str,
}

export function PreviewPane(props: PreviewProps): React.Node {
  return (
    <Vega
      className={props.className}
      spec={props.spec}
      data={{ dataset1: props.data }}
      />
  )
}
