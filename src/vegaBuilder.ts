import merge from "lodash/merge"

import { haveAnyElementsInCommon } from "./array.ts"
import { AUTO_FIELD, RANDOM_FIELD_NAME } from "./config.ts"

export function generateVegaSpec(builderState, columnTypes, config) {
  const mark = Object.fromEntries(
    Object.entries(builderState.mark)
      .filter(([_, v]) => v != null)
      .filter(([name]) =>
        config.selectMarkProperty(name, builderState.mark)))

  const encoding = Object.fromEntries(
    Object.entries(builderState.encoding)
      .filter(([_, v]) => v != null)
      .filter(([name]) =>
        config.selectChannel(
          name, builderState.mark.type))
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

  const transforms = buildTransforms(builderState.encoding)

  if (transforms) {
    builderSpec.data = {
      ...builderSpec.data,
      transform: transforms,
    }
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
    if (state.field != null) {
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
      if (state.binStep != null) {
        channelSpec.bin = { step: state.binStep }
      } else {
        channelSpec.bin = true
      }
    }
  }

  return Object.keys(channelSpec).length > 0 ? channelSpec : null
}

function buildTransforms(channelStates) {
  const hasRandomField = Object.values(channelStates)
    .some(channelState => channelState?.field == RANDOM_FIELD_NAME)

  const transforms = []

  if (hasRandomField) {
    transforms.push(
      {"calculate": "random()", "as": RANDOM_FIELD_NAME},
    )
  }

  return transforms.length > 0 ? transforms : null
}

function getColType(channelName, colType, colName, columnTypes) {
  if (colType != null && colType != AUTO_FIELD) return colType
  if (colName == RANDOM_FIELD_NAME) return "quantitative"

  return columnTypes[colName].type
}
