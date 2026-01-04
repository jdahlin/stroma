import { describe, expect, it } from 'vitest'
import { clamp, generateId, identity, isDefined, noop } from './utils'

describe('utils', () => {
  describe('clamp', () => {
    it('clamps value to min', () => {
      expect(clamp(0, 5, 10)).toBe(5)
    })

    it('clamps value to max', () => {
      expect(clamp(15, 5, 10)).toBe(10)
    })

    it('returns value if within range', () => {
      expect(clamp(7, 5, 10)).toBe(7)
    })
  })

  describe('generateId', () => {
    it('generates a string of expected format', () => {
      const id = generateId()
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('generates unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()))
      expect(ids.size).toBe(100)
    })
  })

  describe('noop', () => {
    it('does nothing', () => {
      expect(noop()).toBeUndefined()
    })
  })

  describe('identity', () => {
    it('returns the same value', () => {
      const obj = { a: 1 }
      expect(identity(obj)).toBe(obj)
      expect(identity(5)).toBe(5)
    })
  })

  describe('isDefined', () => {
    it('returns true for defined values', () => {
      expect(isDefined(0)).toBe(true)
      expect(isDefined('')).toBe(true)
      expect(isDefined(false)).toBe(true)
      expect(isDefined({})).toBe(true)
    })

    it('returns false for null or undefined', () => {
      expect(isDefined(null)).toBe(false)
      expect(isDefined(undefined)).toBe(false)
    })
  })
})
