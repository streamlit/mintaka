import { VlFieldType } from "./types/config"

// TODO: Use Arrow fields to guess columnTypes:
// arrowdata.schema.fields[0].name
// arrowdata.schema.fields[0].type
// arrowjs.type :: DataType.isDate, isTime, isTimestamp, isBool, isInt, isFloat

export function simpleColumnTypeDetector(exampleCell: any): VlFieldType {
  switch (getTypeAsStr(exampleCell)) {
    case "number":
      return "quantitative"

    case "date":
      return "temporal"

    default:
      return "nominal"
  }
}

export type TypeStr =
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

function getTypeAsStr(obj: any): TypeStr {
  const simple_type = typeof obj
  if (simple_type != "object") return simple_type

  if (obj instanceof Date) return "date"
  if (obj instanceof Object) return "object"

  return "unknown"
}
