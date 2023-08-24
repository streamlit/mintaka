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
  if (!spec) spec = {}

  if (!spec.encoding?.column
    && !spec.encoding?.row
    && !spec.encoding?.facet) {
    if (!spec.height) spec.height = "container"
    if (!spec.width) spec.width = "container"
  }

  return (
    <Vega
      className={className}
      spec={spec}
      data={{ dataset1: data }}
      />
  )
}
