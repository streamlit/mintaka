import { PlainRecord, json } from "./typeUtil.ts"

export interface VLSpec extends PlainRecord<json> {
  encoding?: PlainRecord<json>,
}