import { describe, expect, test } from 'vitest'

import { selectGroup } from "./modeParser"

describe('selectGroup', () => {
  describe('empty modeSpec', () => {
    test('section not present', () => {
      const out = selectGroup(
        'foo',
        null,
        {},
      )

      expect(out).toBeFalsy()
    })

    test('section not present, with else=false', () => {
      const out = selectGroup(
        'foo',
        null,
        { else: false },
      )

      expect(out).toBeFalsy()
    })

    test('section not present, with else=true', () => {
      const out = selectGroup(
        'foo',
        null,
        { else: true },
      )

      expect(out).toBeTruthy()
    })
  })

  describe('section not present', () => {
    test('without else', () => {
      const out = selectGroup(
        'foo',
        null,
        {},
      )

      expect(out).toBeFalsy()
    })

    test('with else=false', () => {
      const out = selectGroup(
        'foo',
        null,
        { else: false },
      )

      expect(out).toBeFalsy()
    })

    test('with else=true', () => {
      const out = selectGroup(
        'foo',
        null,
        { else: true },
      )

      expect(out).toBeTruthy()
    })
  })

  describe('section present and false', () => {
    test('no else', () => {
      const out = selectGroup(
        'foo',
        null,
        { foo: false },
      )

      expect(out).toBeFalsy()
    })

    test('with else=false', () => {
      const out = selectGroup(
        'foo',
        null,
        { foo: false, else: false },
      )

      expect(out).toBeFalsy()
    })

    test('with else=true', () => {
      const out = selectGroup(
        'foo',
        null,
        { foo: false, else: true },
      )

      expect(out).toBeFalsy()
    })
  })

  describe('section present and true', () => {
    test('no else', () => {
      const out = selectGroup(
        'foo',
        null,
        { foo: true },
      )

      expect(out).toBeTruthy()
    })

    test('with else=false', () => {
      const out = selectGroup(
        'foo',
        null,
        { foo: true, else: false },
      )

      expect(out).toBeTruthy()
    })

    test('with else=true', () => {
      const out = selectGroup(
        'foo',
        null,
        { foo: true, else: true },
      )

      expect(out).toBeTruthy()
    })
  })

  describe('section is empty array', () => {
    describe('with no groupName', () => {
      test('no else', () => {
        const out = selectGroup(
          'foo',
          null,
          { foo: [] },
        )

        expect(out).toBeTruthy()
      })

      test('with else=false', () => {
        const out = selectGroup(
          'foo',
          null,
          { foo: [], else: false },
        )

        expect(out).toBeTruthy()
      })

      test('with else=true', () => {
        const out = selectGroup(
          'foo',
          null,
          { foo: [], else: true },
        )

        expect(out).toBeTruthy()
      })
    })

    describe('with groupName set', () => {
      test('no else', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: [] },
        )

        expect(out).toBeFalsy()
      })

      test('with else=false', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: [], else: false },
        )

        expect(out).toBeFalsy()
      })

      test('with else=true', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: [], else: true },
        )

        expect(out).toBeFalsy()
      })
    })
  })

  describe('section is array', () => {
    describe('with no groupName', () => {
      test('no else', () => {
        const out = selectGroup(
          'foo',
          null,
          { foo: [] },
        )

        expect(out).toBeTruthy()
      })

      test('with else=false', () => {
        const out = selectGroup(
          'foo',
          null,
          { foo: [], else: false },
        )

        expect(out).toBeTruthy()
      })

      test('with else=true', () => {
        const out = selectGroup(
          'foo',
          null,
          { foo: [], else: true },
        )

        expect(out).toBeTruthy()
      })
    })

    describe('with matching groupName', () => {
      test('no else', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: ['baz', 'buzz'] },
        )

        expect(out).toBeTruthy()
      })

      test('with else=false', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: ['baz', 'buzz'], else: false },
        )

        expect(out).toBeTruthy()
      })

      test('with else=true', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: ['baz', 'buzz'], else: true },
        )

        expect(out).toBeTruthy()
      })
    })

    describe('with non-matching groupName', () => {
      test('no else', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: ['boz', 'buzz'] },
        )

        expect(out).toBeFalsy()
      })

      test('with else=false', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: ['boz', 'buzz'], else: false },
        )

        expect(out).toBeFalsy()
      })

      test('with else=true', () => {
        const out = selectGroup(
          'foo',
          'baz',
          { foo: ['boz', 'buzz'], else: true },
        )

        expect(out).toBeFalsy()
      })
    })
  })
})
