import { ReactNode } from "react"
import { Vega, VisualizationSpec } from "react-vega"

import {
  VLSpec,
} from "../types"

interface PreviewProps {
  data: any,
  spec: VLSpec,
  className: string,
}

export function PreviewPane({
  data,
  spec,
  className,
}: PreviewProps): ReactNode {
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
      spec={spec as VisualizationSpec}
      data={{ dataset1: data }}
      />
  )
}
