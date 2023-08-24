export type json =
    | string
    | number
    | boolean
    | null
    | json[]
    | { [key: string]: json }

export type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>
export type PlainRecord<T> = Record<string, T>
export type JsonRecord = Record<string, json>
export type Grouping<T> = Record<string, T>

export type JsonSetter = (value: json) => void
