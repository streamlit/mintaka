import { ReactNode } from "react"
import { Vega } from "react-vega"

export default function PreviewPane({ data, spec, className }) {
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
