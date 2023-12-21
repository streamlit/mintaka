import React from "react"
import { Vega, VisualizationSpec } from "react-vega"
import { VLSpec } from "mintaka"

interface PreviewPaneProps {
  data: any,
  spec: VLSpec,
  className?: string,
}

export default function PreviewPane({ data, spec, className }: PreviewPaneProps): React.ReactNode {
  if (!spec.encoding?.column
    && !spec.encoding?.row
    && !spec.encoding?.facet) {
    if (!spec.height) spec.height = "container"
    if (!spec.width) spec.width = "container"
  }

  return (
    <Vega
      className={className}
      spec={spec as VisualizationSpec}
      data={{ dataset1: data }}
      />
  )
}
