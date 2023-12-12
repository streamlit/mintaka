import { PlainRecord, json } from "./util.ts"

export interface VLSpec extends PlainRecord<json> {
  encoding?: PlainRecord<json>,
}
