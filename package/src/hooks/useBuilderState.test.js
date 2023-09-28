import { describe, expect, test } from 'vitest'
import { renderHook } from '@testing-library/react'

import * as configDefaults from '../config'

import { useBuilderState } from './useBuilderState'

describe('useBuilderState', () => {
  test('empty arguments', () => {
    const config = {}
    const initialState = {}

    const { result } = renderHook(() => useBuilderState(config, initialState))

    expect(typeof result.current.reset).toEqual('function')
    expect(typeof result.current.setPreset).toEqual('function')
    expect(typeof result.current.setMark).toEqual('function')
    expect(typeof result.current.setEncoding).toEqual('function')
    expect(typeof result.current.getMarkSetter).toEqual('function')
    expect(typeof result.current.getEncodingSetter).toEqual('function')

    expect(result.current.preset).toEqual({})
    expect(result.current.mark).toEqual({
      type: "point",
    })
    expect(result.current.encoding).toEqual({})
  })
})
