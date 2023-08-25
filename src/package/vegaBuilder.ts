import merge from "lodash/merge"

import {
  BuilderState,
  ColumnTypes,
  Config,
  JsonRecord,
  PlainRecord,
  VLSpec,
  VlFieldType,
  json,
} from "./types"

import { isElementOf, haveAnyElementsInCommon } from "./array"
import { RANDOM_FIELD_NAME } from "./config"

export function generateVegaSpec(
  builderState: BuilderState,
  columnTypes: ColumnTypes,
  config: Config,
): VLSpec {
  const mark: PlainRecord<json> = Object.fromEntries(
    Object.entries(builderState.mark)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => v != null)
      .filter(([_, name]) =>
        config.selectMarkProperty(name, builderState)))

  const encoding: PlainRecord<PlainRecord<json>> = Object.fromEntries(
    Object.entries(builderState.encoding)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => v != null)
      .filter(([name]) =>
        config.selectChannel(name, builderState))
      .map(([name, channelState]) => {
        const channelSpec = buildChannelSpec(name, builderState, columnTypes, config)
        if (channelSpec) return [name, channelSpec]
        return []
      }))

  patchChannelSpec(encoding, builderState)

  const builderSpec: JsonRecord = {
    mark: {
      clip: true,
      ...mark,
    },

    encoding,

    params: [{
      name: "grid",
      select: "interval",
      bind: "scales"
    }],

    data: {
      name: "dataset1",
    },
  }

  const transforms = []
  convertFieldListToStrAndMaybeFold(encoding, transforms)
  addJitterColumn(encoding, transforms)

  if (transforms.length > 0) {
    builderSpec.transform = transforms
  }

  const outSpec = merge({}, builderSpec)

  // The row, column, and facet encodings use the chart-wide size,
  // which is usually not what users want. Besides, they don't work when
  // width/height are set to "container". So we just delete the chart
  // width/height and let Vega pick the best dimensions instead.
  if (haveAnyElementsInCommon(Object.keys(encoding), ["row", "column", "facet"])) {
    delete outSpec.width
    delete outSpec.height
  }

  return outSpec
}

function buildChannelSpec(
  channelName: string,
  builderState: BuilderState,
  columnTypes: ColumnTypes,
  config: Config,
): json {
  const channelSpec: JsonRecord = {}

  const channelState: JsonRecord = builderState?.encoding?.[channelName] ?? {}

  const s = Object.fromEntries(Object.entries(channelState)
    .filter(([_, name]) => config.selectChannelProperty(name, channelName, builderState)))

  if (s.aggregate != null) channelSpec.aggregate = s.aggregate

  if (s.bin) {
    if (s.bin == "binned") {
      channelSpec.bin = "binned"
    } else if (s.binStep != null) {
      channelSpec.bin = { step: s.binStep }
    } else if (s.maxBins != null) {
      channelSpec.bin = { maxbins: s.maxBins }
    } else {
      channelSpec.bin = true
    }
  }

  channelSpec.field = s.field

  if (s.legend != null) channelSpec.legend = s.legend

  if (s.scaleType ?? s.scheme ?? s.domain ?? s.range ?? s.zero != null) {
    channelSpec.scale = {}

    if (s.scaleType != null) channelSpec.scale.type = s.scaleType
    if (s.scheme != null) channelSpec.scale.scheme = s.scheme
    if (s.domain != null) channelSpec.scale.domain = s.domain
    if (s.range != null) channelSpec.scale.range = s.range
    if (s.zero != null) channelSpec.scale.zero = s.zero
  }

  if (s.sortBy == null) {
    if (s.sort != null) channelSpec.sort = s.sort
  } else {
    const sortSymbol = s.sort == "descending" ? "-" : ""
    const sortEnc = s.sortBy ?? ""
    channelSpec.sort = `${sortSymbol}${sortEnc}`
  }

  if (s.stack != null) channelSpec.stack = s.stack
  if (s.type == "temporal") channelSpec.timeUnit = s.timeUnit
  if (s.title != null) channelSpec.title = s.title

  if (Array.isArray(s.field)) {
    // Guess type based on 0th field.
    channelSpec.type = getColType(
      channelName,
      s.type as VlFieldType|null,
      s.field[0] as string,
      columnTypes,
    )
  } else {
    channelSpec.type = getColType(
      channelName,
      s.type as VlFieldType|null,
      s.field as string,
      columnTypes,
    )
  }

  if (s.value != null) channelSpec.value = s.value

  return Object.keys(channelSpec).length > 0 ? channelSpec : null
}

function patchChannelSpec(
  encoding: PlainRecord<PlainRecord<json>>,
  builderState: BuilderState,
) {
  if (encoding?.color?.field != null) {
    if (encoding?.x?.stack == false && builderState?.mark?.type == "bar") {
      if (!isElementOf(encoding.y.type, ["nominal", "ordinal"]))
        encoding.y.type = "nominal"

      if (encoding.yOffset == null) encoding.yOffset = {}

      if (encoding.yOffset.field == null)
        encoding.yOffset.field = encoding.color.field
    }

    if (encoding?.y?.stack == false && builderState?.mark?.type == "bar") {
      if (!isElementOf(encoding.x.type, ["nominal", "ordinal"]))
        encoding.x.type = "nominal"

      if (encoding.xOffset == null) encoding.xOffset = {}

      if (encoding.xOffset.field == null)
        encoding.xOffset.field = encoding.color.field
    }
  }
}

function getColType(
  channelName: string,
  colType: VlFieldType|null,
  colName: string,
  columnTypes: ColumnTypes,
): VlFieldType {
  if (colType != null) return colType
  if (colName == RANDOM_FIELD_NAME) return "quantitative"

  return columnTypes[colName]?.type
}

const KEYS = "vlcb--folded-keys-"
const VALUES = "vlcb--folded-values-"

function convertFieldListToStrAndMaybeFold(
  encoding: PlainRecord<PlainRecord<json>>,
  transforms: Array<PlainRecord<json>>,
) {
  Object.entries(encoding)
    .forEach(([channelName, channelSpec]) => {
      if (!Array.isArray(channelSpec?.field)) return

      if (channelSpec.field.length > 1) {
        foldChannel(channelName, channelSpec, encoding, transforms)
      } else {
        channelSpec.field = channelSpec.field[0]
      }
    })
}

function foldChannel(channelName, channelSpec, encoding, transforms) {
  const fields = channelSpec.field

  const values = VALUES + channelName
  const keys = KEYS + channelName

  channelSpec.field = values

  if (!encoding?.color) encoding.color = {}
  encoding.color.field = keys
  encoding.color.type = "nominal"

  if (!channelSpec.title) channelSpec.title = "value"  // TODO: Make customizable.
  if (!encoding?.color?.title) encoding.color.title = "color"  // TODO: Make customizable.

  transforms.push(
    { fold: fields, as: [ keys, values ] }
  )
}

function addJitterColumn(
  encoding: PlainRecord<PlainRecord<json>>,
  transforms: Array<PlainRecord<json>>,
): void {
  const hasRandomField = Object.values(encoding)
    .some(channelSpec => channelSpec?.field == RANDOM_FIELD_NAME)

  if (!hasRandomField) return

  transforms.push(
    { calculate: "random()", as: RANDOM_FIELD_NAME },
  )
}
