import merge from "lodash/merge"

import { haveAnyElementsInCommon } from "./array.ts"
import * as specConfig from "./specConfig.ts"

export function buildVegaSpec(builderState, columnTypes, baseSpec) {
  const mark = Object.fromEntries(
    Object.entries(builderState.mark.state)
      .filter(([_, v]) => v != null)
      .filter(([k]) =>
        specConfig.keepMarkProperty(k, builderState.mark.state.type)))

  const encoding = Object.fromEntries(
    Object.entries(builderState.encoding.states)
      .filter(([channel]) =>
        specConfig.keepChannel(
          channel, builderState.mark.state.type))
      .map(([channel, channelState]) => {
        const channelSpec = buildChannelSpec(channel, channelState, columnTypes)
        if (channelSpec) return [channel, channelSpec]
        return []
      }))

  const builderSpec = {
    mark: {
      tooltip: true,
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

  const transforms = buildTransforms(builderState.encoding.states)

  if (transforms) {
    builderSpec.data = {
      ...builderSpec.data,
      transform: transforms,
    }
  }

  const outSpec = merge({}, baseSpec, builderSpec)

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

function buildChannelSpec(channel, state, columnTypes) {
  const channelSpec = {}
  // TODO: use keepChannelProperty here and make this whole thing more automated.

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
        channel, state.type, state.field, columnTypes)
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
    .some(channelState => channelState.field == specConfig.RANDOM_FIELD_NAME)

  const transforms = []

  if (hasRandomField) {
    transforms.push(
      {"calculate": "random()", "as": specConfig.RANDOM_FIELD_NAME},
    )
  }

  return transforms.length > 0 ? transforms : null
}

function getColType(channel, colType, colName, columnTypes) {
  if (colType != null && colType != specConfig.AUTO_FIELD) return colType
  if (colName == specConfig.RANDOM_FIELD_NAME) return "quantitative"

  return columnTypes[colName].type
}
