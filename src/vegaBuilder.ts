import merge from "lodash/merge"

import { haveAnyElementsInCommon } from "./array.ts"
import { RANDOM_FIELD_NAME } from "./config.ts"

export function generateVegaSpec(builderState, columnTypes, config) {
  const mark = Object.fromEntries(
    Object.entries(builderState.mark)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => v != null)
      .filter(([name]) =>
        config.selectMarkProperty(name, builderState)))

  const encoding = Object.fromEntries(
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

  const builderSpec = {
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

function buildChannelSpec(channelName, state, columnTypes, config) {
  const channelSpec = {}

  const channelState = state?.encoding?.[channelName]

  const s = Object.fromEntries(Object.entries(channelState)
    .filter(([name]) => config.selectChannelProperty(name, channelName, state)))

  if (Array.isArray(s.field)) {
    channelSpec.field = s.field
    // Guess type based on 0th field.
    channelSpec.type = getColType(
      channelName, s.type, s.field[0], columnTypes)
  } else {
    channelSpec.field = s.field
    channelSpec.type = getColType(
      channelName, s.type, s.field, columnTypes)
  }

  if (s.value) {
    channelSpec.value = s.value
  }

  if (s.sortBy == null) {
    if (s.sort != null) channelSpec.sort = s.sort
  } else {
    const sortSymbol = s.sort == "descending" ? "-" : ""
    const sortEnc = s.sortBy ?? ""
    channelSpec.sort = `${sortSymbol}${sortEnc}`
  }

  if (s.aggregate != null) channelSpec.aggregate = s.aggregate
  if (s.stack != null) channelSpec.stack = s.stack

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

  if (s.title != null) channelSpec.title = s.title
  if (s.legend != null) channelSpec.legend = s.legend
  if (s.type == "temporal") channelSpec.timeUnit = s.timeUnit

  if (s.scaleType ?? s.scheme ?? s.domain ?? s.range != null) {
    channelSpec.scale = {}

    if (s.scaleType != null) channelSpec.scale.type = s.scaleType
    if (s.scheme != null) channelSpec.scale.scheme = s.scheme
    if (s.domain != null) channelSpec.scale.domain = s.domain
    if (s.range != null) channelSpec.scale.range = s.range
  }

  return Object.keys(channelSpec).length > 0 ? channelSpec : null
}

function getColType(channelName, colType, colName, columnTypes) {
  if (colType != null) return colType
  if (colName == RANDOM_FIELD_NAME) return "quantitative"

  return columnTypes[colName]?.type
}

const KEYS = "vlcb--folded-keys-"
const VALUES = "vlcb--folded-values-"

function convertFieldListToStrAndMaybeFold(encoding, transforms) {
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

function addJitterColumn(encoding, transforms) {
  const hasRandomField = Object.values(encoding)
    .some(channelSpec => channelSpec?.field == RANDOM_FIELD_NAME)

  if (!hasRandomField) return

  transforms.push(
    { calculate: "random()", as: RANDOM_FIELD_NAME },
  )
}
