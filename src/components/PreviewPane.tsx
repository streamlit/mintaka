import React from "react"
import { Vega } from "react-vega"

interface PreviewProps {
  data: any,
  spec: any,
  className: str,
}

export function PreviewPane({
  data,
  spec,
  className,
}: PreviewProps): React.Node {
  return (
    <Vega
      className={className}
      spec={spec}
      data={{ dataset1: data }}
      />
  )
}
