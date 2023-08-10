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
        const channelSpec = buildChannelSpec(name, channelState, columnTypes)
        if (channelSpec) return [name, channelSpec]
        return []
      }))

  const builderSpec = {
    mark: {
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

function buildChannelSpec(channelName, state, columnTypes) {
  const channelSpec = {}
  // TODO: use selectChannelProperty here and make this whole thing more automated.

  if (state.title != null) channelSpec.title = state.title
  if (state.legend != null) channelSpec.legend = state.legend
  if (state.type == "temporal") channelSpec.timeUnit = state.timeUnit
  if (state.scale != null) channelSpec.scale = state.scale

  if (state.field == null) {
    if (state.value) {
      channelSpec.value = state.value
    }
  } else {
    if (Array.isArray(state.field)) {
      channelSpec.field = state.field
      // Guess type based on 0th field.
      channelSpec.type = getColType(
        channelName, state.type, state.field[0], columnTypes)
    } else {
      channelSpec.field = state.field
      channelSpec.type = getColType(
        channelName, state.type, state.field, columnTypes)
    }

    if (state.sortBy == null) {
      if (state.sort != null) {
        channelSpec.sort = state.sort
      }
    } else {
      const sortSymbol = state.sort == "descending" ? "-" : ""
      const sortEnc = state.sortBy ?? ""
      channelSpec.sort = `${sortSymbol}${sortEnc}`
    }

    if (state.aggregate != null) channelSpec.aggregate = state.aggregate
    if (state.stack != null) channelSpec.stack = state.stack

    if (state.bin) {
      if (state.bin == "binned") {
        channelSpec.bin = "binned"
      } else if (state.binStep != null) {
        channelSpec.bin = { step: state.binStep }
      } else if (state.maxBins != null) {
        channelSpec.bin = { maxbins: state.maxBins }
      } else {
        channelSpec.bin = true
      }
    }
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

  if (!channelSpec.title) {
    channelSpec.title = "value"  // TODO: Allow user to customize this.
  }

  encoding.color = {
    field: keys,
    title: "color",  // TODO: Allow user to customize this.
  }

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
