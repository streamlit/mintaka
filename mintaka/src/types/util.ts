export type json =
    | string
    | number
    | boolean
    | null
    | undefined // Not quite JSON, but convertible to null, so OK.
    | json[]
    | { [key: string]: json }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>
export type PlainRecord<T> = Record<string, T>
export type JsonRecord = PlainRecord<json>
export type Grouping<T> = PlainRecord<T>

export type JsonSetter = (value: json) => void

export type ValueOf<T> = T[keyof T]
