import React from 'react'
import { VegaLite } from 'react-vega'


interface PreviewProps {
  data: any,
  state: {
    spec: any,
  },
}

export function PreviewPane(props: PreviewProps): React.Node {
  return (
    <VegaLite spec={props.state.spec} data={props.data} />
  )
}

