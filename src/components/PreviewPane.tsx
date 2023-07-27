import React from "react"
import { VegaLite } from "react-vega"
import merge from "lodash/merge"


interface PreviewProps {
  data: any,
  spec: any,
  className: str,
}

export function PreviewPane(props: PreviewProps): React.Node {
  const spec = merge({}, props.spec, {
    data: {
      values: props.data,
    }
  })

  return (
      <VegaLite
        className={props.className}
        spec={spec}
      />
  )
}

