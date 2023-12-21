import { VlFieldType } from "./types/index.ts"

// TODO: Use Arrow fields to guess columnTypes:
// arrowdata.schema.fields[0].name
// arrowdata.schema.fields[0].type
// arrowjs.type :: DataType.isDate, isTime, isTimestamp, isBool, isInt, isFloat

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function simpleColumnTypeDetector(exampleValue: any): VlFieldType {
  switch (getTypeAsStr(exampleValue)) {
    case "number":
      return "quantitative"

    case "date":
      return "temporal"

    default:
      return "nominal"
  }
}

type TypeStr =
  | "object"
  | "date"
  | "unknown"
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "string"
  | "symbol"
  | "undefined"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTypeAsStr(obj: any): TypeStr {
  const simple_type = typeof obj
  if (simple_type != "object") return simple_type

  if (obj instanceof Date) return "date"
  if (obj instanceof Object) return "object"

  return "unknown"
}
