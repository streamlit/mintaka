import { ReactNode } from "react"

import { ColumnTypes } from "mintaka"

export interface DemoProps {
    demo: DemoMeta,
    dataset: object,
    columnTypes: ColumnTypes
}

export type DemoComponent = (props: DemoProps) => ReactNode

export interface DemoMeta {
    title: string,
    description: string,
    component: DemoComponent
}
