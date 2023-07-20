import React from 'react'
import { VegaLite } from 'react-vega'


interface PreviewProps {
  data: any,
  spec: any,
}

export function PreviewPane(props: PreviewProps): React.Node {
  return (
    <VegaLite spec={props.spec} data={props.data} />
  )
}

