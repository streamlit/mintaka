import { PlainRecord, json } from "./util"

export interface VLSpec extends PlainRecord<json> {
  encoding?: PlainRecord<json>,
}
