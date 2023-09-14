import { describe, expect, test } from 'vitest'

import { showSection, filterSection } from "./modeParser"

describe('showSection', () => {
  test('null namedMode', () => {
    const out = showSection(
      'foo',
      null,
    )

    expect(out).toBeTruthy()
  })

  test('empty namedMode', () => {
    const out = showSection(
      'foo',
      ['name', {}],
    )

    expect(out).toBeTruthy()
  })

  describe('section not in namedMode', () => {
    test('no else', () => {
      const out = showSection(
        'foo',
        ['name', {
          bar: true,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else null', () => {
      const out = showSection(
        'foo',
        ['name', {
          bar: true,
          else: null,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else true', () => {
      const out = showSection(
        'foo',
        ['name', {
          bar: true,
          else: true,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else false', () => {
      const out = showSection(
        'foo',
        ['name', {
          bar: true,
          else: false,
        }],
      )

      expect(out).toBeFalsy()
    })
  })

  describe('section true in namedMode', () => {
    test('no else', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: true,
          bar: false,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else null', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: true,
          bar: false,
          else: null,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else true', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: true,
          bar: false,
          else: true,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else false', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: true,
          bar: false,
          else: false,
        }],
      )

      expect(out).toBeTruthy()
    })
  })

  describe('section false in namedMode', () => {
    test('no else', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: false,
          bar: true,
        }],
      )

      expect(out).toBeFalsy()
    })

    test('else null', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: false,
          bar: true,
          else: null,
        }],
      )

      expect(out).toBeFalsy()
    })

    test('else true', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: false,
          bar: true,
          else: true,
        }],
      )

      expect(out).toBeFalsy()
    })

    test('else false', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: false,
          bar: true,
          else: false,
        }],
      )

      expect(out).toBeFalsy()
    })
  })

  describe('section=Set in namedMode', () => {
    test('no else', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: new Set(['value1', 'value2']),
          bar: false,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else null', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: new Set(['value1', 'value2']),
          bar: false,
          else: null,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else true', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: new Set(['value1', 'value2']),
          bar: false,
          else: true,
        }],
      )

      expect(out).toBeTruthy()
    })

    test('else false', () => {
      const out = showSection(
        'foo',
        ['name', {
          foo: new Set(['value1', 'value2']),
          bar: false,
          else: false,
        }],
      )

      expect(out).toBeTruthy()
    })
  })

})


describe('filterSection', () => {
  const configSpec = {
    foo: { key1: 'value1', key2: 'value2', key3: 'value3' }
  }

  test('null namedMode', () => {
    const out = filterSection(
      'foo',
      configSpec,
      null,
      x => true,
    )

    expect(out).toEqual({
      key1: 'value1', key2: 'value2', key3: 'value3',
    })
  })

  test('empty namedMode', () => {
    const out = filterSection(
      'foo',
      configSpec,
      ['name', {}],
      x => true,
    )

    expect(out).toEqual({
      key1: 'value1', key2: 'value2', key3: 'value3',
    })
  })

  describe('section not in namedMode', () => {
    test('no else', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { bar: true, }],
        x => true,
      )

      expect(out).toEqual({
        key1: 'value1', key2: 'value2', key3: 'value3',
      })
    })

    test('else null', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { bar: true, else: null }],
        x => true,
      )

      expect(out).toEqual({
        key1: 'value1', key2: 'value2', key3: 'value3',
      })
    })

    test('else true', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { bar: true, else: true}],
        x => true,
      )

      expect(out).toEqual({
        key1: 'value1', key2: 'value2', key3: 'value3',
      })
    })

    test('else false', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { bar: true, else: false}],
        x => true,
      )

      expect(out).toEqual(null)
    })
  })

  describe('section true in namedMode', () => {
    test('no else', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: true, bar: false, }],
        x => true,
      )

      expect(out).toEqual({
        key1: 'value1', key2: 'value2', key3: 'value3',
      })
    })

    test('else null', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: true, bar: false, else: null }],
        x => true,
      )

      expect(out).toEqual({
        key1: 'value1', key2: 'value2', key3: 'value3',
      })
    })

    test('else true', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: true, bar: false, else: true }],
        x => true,
      )

      expect(out).toEqual({
        key1: 'value1', key2: 'value2', key3: 'value3',
      })
    })

    test('else false', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: true, bar: false, else: false }],
        x => true,
      )

      expect(out).toEqual({
        key1: 'value1', key2: 'value2', key3: 'value3',
      })
    })
  })

  describe('section false in namedMode', () => {
    test('no else', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: false, bar: false, }],
        x => true,
      )

      expect(out).toEqual(null)
    })

    test('else null', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: false, bar: false, else: null }],
        x => true,
      )

      expect(out).toEqual(null)
    })

    test('else true', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: false, bar: false, else: true }],
        x => true,
      )

      expect(out).toEqual(null)
    })

    test('else false', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', { foo: false, bar: false, else: false }],
        x => true,
      )

      expect(out).toEqual(null)
    })
  })

  describe('section=Set in namedMode, no intersection', () => {
    test('no else', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', {
          foo: new Set(['notValue1', 'notValue2']),
          bar: false,
        }],
        x => true,
      )

      expect(out).toEqual({})
    })

    test('else null', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', {
          foo: new Set(['notValue1', 'notValue2']),
          bar: false,
          else: null,
        }],
        x => true,
      )

      expect(out).toEqual({})
    })

    test('else true', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', {
          foo: new Set(['notValue1', 'notValue2']),
          bar: false,
          else: true,
        }],
        x => true,
      )

      expect(out).toEqual({})
    })

    test('else false', () => {
      const out = filterSection(
        'foo',
        configSpec,
        ['name', {
          foo: new Set(['notValue1', 'notValue2']),
          bar: false,
          else: false,
        }],
        x => true,
      )

      expect(out).toEqual({})
    })
  })

  describe('section=Set in namedMode, with intersection', () => {
    describe('filter true', () => {
      const filter = x => true

      test('no else', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
          }],
          filter,
        )

        expect(out).toEqual({
          key1: 'value1',
          key3: 'value3',
        })
      })

      test('else null', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
            else: null,
          }],
          filter,
        )

        expect(out).toEqual({
          key1: 'value1',
          key3: 'value3',
        })
      })

      test('else true', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
            else: true,
          }],
          filter,
        )

        expect(out).toEqual({
          key1: 'value1',
          key3: 'value3',
        })
      })

      test('else false', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
            else: false,
          }],
          filter,
        )

        expect(out).toEqual({
          key1: 'value1',
          key3: 'value3',
        })
      })
    })

    describe('filter out one value', () => {
      const filter = x => x == 'value3'

      test('no else', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
          }],
          filter,
        )

        expect(out).toEqual({
          key3: 'value3',
        })
      })

      test('else null', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
            else: null,
          }],
          filter,
        )

        expect(out).toEqual({
          key3: 'value3',
        })
      })

      test('else true', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
            else: true,
          }],
          filter,
        )

        expect(out).toEqual({
          key3: 'value3',
        })
      })

      test('else false', () => {
        const out = filterSection(
          'foo',
          configSpec,
          ['name', {
            foo: new Set(['value3', 'notValue1', 'value1', 'notValue2']),
            bar: false,
            else: false,
          }],
          filter,
        )

        expect(out).toEqual({
          key3: 'value3',
        })
      })
    })
  })
})
