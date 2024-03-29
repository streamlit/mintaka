import includes from "lodash/includes"
import merge from "lodash/merge"

import {
  ChannelName,
  ChannelPropName,
  ChannelState,
  EncodingState,
  LayerState,
  StateValue,
} from "./stateTypes.ts"

import {
  ColumnTypes,
  Config,
  VlFieldType,
} from "./configTypes.ts"

import {
  JsonRecord,
  PlainRecord,
  json,
} from "./typeUtil.ts"

import { VLSpec } from "./vegaTypes.ts"

import { haveAnyElementsInCommon } from "./collectionUtils.ts"

export const DEFAULT_BASE_SPEC = {
  mark: {
    clip: true,
  },

  params: [{
    name: "grid",
    select: "interval",
    bind: "scales"
  }],

  data: {
    name: "dataset1",
  },
}

export function generateVegaSpec(
  stateValue: StateValue,
  columnTypes: ColumnTypes,
  config: Config,
  baseSpec: VLSpec,
): VLSpec {
  const layers = stateValue.layers.map(layer =>
    generateLayerSpec(
      layer,
      stateValue,
      columnTypes,
      config,
    )
  )

  const transforms: Array<PlainRecord<json>> = []
  layers.forEach((layer, i) => handleFieldListAndFolding(layer.encoding, transforms, i))
  layers.forEach(layer => handleStackSpec(layer.encoding))

  const builderSpec: JsonRecord = {
    layer: layers
  }

  if (transforms.length > 0) {
    builderSpec.transform = transforms
  }

  const outSpec = merge({}, baseSpec, builderSpec)

  if (layers.length == 1) {
    fixChartSizeIfFaceting(layers[0].encoding, outSpec)
  }

  return outSpec
}

function generateLayerSpec(
  layer: LayerState,
  stateValue: StateValue,
  columnTypes: ColumnTypes,
  config: Config,
) {
  const mark: PlainRecord<json> = Object.fromEntries(
    Object.entries(layer.mark)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => v != null)
      .filter(([name]) =>
        config.selectMarkProperty(name, layer, stateValue))
  )

  const encoding: PlainRecord<PlainRecord<json>> = Object.fromEntries(
    Object.entries(layer.encoding)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => v != null)
      .filter(([name]) =>
        config.selectChannel(name as ChannelName, layer, stateValue))
      .map(([name]) => {
        const channelSpec = buildChannelSpec(
          name as ChannelName,
          layer,
          stateValue,
          columnTypes,
          config,
        )
        if (channelSpec) return [name, channelSpec]
        return []
      })
  )

  return {
    mark,
    encoding,
  }
}

function buildChannelSpec(
  channelName: ChannelName,
  layer: LayerState,
  stateValue: StateValue,
  columnTypes: ColumnTypes,
  config: Config,
): json {
  const channelSpec: JsonRecord = {}

  const channelState: ChannelState = layer?.encoding?.[channelName] ?? {}

  const s = Object.fromEntries(Object.entries(channelState)
    .filter(([name]) => config.selectChannelProperty(
      name as ChannelPropName,
      channelName as ChannelName,
      layer,
      stateValue,
    ))
  )

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

  if (s.field != null) channelSpec.field = s.field
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
      s.type as VlFieldType|null,
      s.field[0] as string,
      columnTypes,
    )
  } else if (s.field) {
    channelSpec.type = getColType(
      s.type as VlFieldType|null,
      s.field as string,
      columnTypes,
    )
  }

  if (s.value != null) channelSpec.value = s.value
  if (s.datum != null) channelSpec.datum = s.datum

  return Object.keys(channelSpec).length > 0 ? channelSpec : null
}

function handleStackSpec(
  encoding: PlainRecord<PlainRecord<json>>,
) {
  if (encoding?.color?.field != null) {
    if (encoding?.x?.stack == "mintaka-dodge") {
      encoding.x.stack = false

      if (!includes(["nominal", "ordinal"], encoding.y.type)) {
        encoding.y.type = "nominal"
      }

      if (encoding.yOffset == null) encoding.yOffset = {}

      if (encoding.yOffset.field == null) {
        encoding.yOffset.field = encoding.color.field
      }
    }

    if (encoding?.y?.stack == "mintaka-dodge") {
      encoding.y.stack = false

      if (!includes(["nominal", "ordinal"], encoding.x.type)) {
        encoding.x.type = "nominal"
      }

      if (encoding.xOffset == null) encoding.xOffset = {}

      if (encoding.xOffset.field == null) {
        encoding.xOffset.field = encoding.color.field
      }
    }
  }
}

function getColType(
  colType: VlFieldType|null,
  colName: string,
  columnTypes: ColumnTypes,
): VlFieldType {
  if (colType != null) return colType

  return columnTypes[colName]?.type
}

const KEYS = "mtk--folded-keys-"
const VALUES = "mtk--folded-values-"

function handleFieldListAndFolding(
  encoding: PlainRecord<PlainRecord<json>>,
  transforms: Array<PlainRecord<json>>,
  layerIndex: number,
) {
  Object.entries(encoding)
    .forEach(([channelName, channelSpec]) => {
      if (!Array.isArray(channelSpec?.field)) return

      if (channelSpec.field.length > 1) {
        foldChannel(
          channelName as ChannelName,
          channelSpec,
          channelSpec.field as string[],
          encoding,
          transforms,
          layerIndex)
      } else {
        channelSpec.field = channelSpec.field[0]
      }
    })
}

function foldChannel(
  channelName: ChannelName,
  channelSpec: ChannelState,
  channelFields: string[],
  encoding: EncodingState,
  transforms: Array<PlainRecord<json>>,
  layerIndex: number,
): void {
  const fields = channelFields.filter(x => x != null)

  const values = VALUES + layerIndex + channelName
  const keys = KEYS + layerIndex + channelName

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

function fixChartSizeIfFaceting(encoding: PlainRecord<PlainRecord<json>>, outSpec: VLSpec): void {
  // The row, column, and facet encodings use the chart-wide size,
  // which is usually not what users want. Besides, they don't work when
  // width/height are set to "container". So we just delete the chart
  // width/height and let Vega pick the best dimensions instead.
  if (haveAnyElementsInCommon(Object.keys(encoding), ["row", "column", "facet"])) {
    delete outSpec.width
    delete outSpec.height
  }
}
