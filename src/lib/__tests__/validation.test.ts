import { describe, it, expect } from 'vitest'
import {
  isValidE164Phone,
  validatePhone,
  formatPhoneForDisplay,
  formatPhoneForApi,
  validateEmail,
} from '../validation'

describe('isValidE164Phone', () => {
  it('accepts a clean E.164 number', () => {
    expect(isValidE164Phone('+12125551234')).toBe(true)
  })

  it('accepts a number without +', () => {
    expect(isValidE164Phone('12125551234')).toBe(true)
  })

  it('accepts a formatted number with spaces, dashes, and parens', () => {
    expect(isValidE164Phone('+1 (212) 555-1234')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isValidE164Phone('')).toBe(false)
  })

  it('rejects letters', () => {
    expect(isValidE164Phone('abc')).toBe(false)
  })

  it('rejects a number starting with 0', () => {
    expect(isValidE164Phone('+0123456789')).toBe(false)
  })

  it('accepts international numbers', () => {
    expect(isValidE164Phone('+442071234567')).toBe(true)
    expect(isValidE164Phone('+81312345678')).toBe(true)
  })
})

describe('validatePhone', () => {
  it('returns valid for an empty string (optional field)', () => {
    const result = validatePhone('')
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('returns valid for a whitespace-only string', () => {
    expect(validatePhone('   ').valid).toBe(true)
  })

  it('returns valid for a correct E.164 number', () => {
    expect(validatePhone('+12125551234').valid).toBe(true)
  })

  it('returns valid for a formatted number', () => {
    expect(validatePhone('+1 (604) 555-7890').valid).toBe(true)
  })

  it('returns error for a single digit', () => {
    const result = validatePhone('5')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too short')
  })

  it('returns error for invalid characters', () => {
    const result = validatePhone('not-a-phone')
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })
})

describe('formatPhoneForDisplay', () => {
  it('formats a 10-digit number as North American', () => {
    expect(formatPhoneForDisplay('6045551234')).toBe('+1 (604) 555-1234')
  })

  it('formats an 11-digit number starting with 1 as North American', () => {
    expect(formatPhoneForDisplay('+16045551234')).toBe('+1 (604) 555-1234')
  })

  it('formats a number with spaces and dashes', () => {
    expect(formatPhoneForDisplay('+1 (604) 555-1234')).toBe('+1 (604) 555-1234')
  })

  it('returns international numbers with + prefix', () => {
    expect(formatPhoneForDisplay('+442071234567')).toBe('+442071234567')
  })

  it('adds + prefix to international numbers without one', () => {
    expect(formatPhoneForDisplay('442071234567')).toBe('+442071234567')
  })
})

describe('formatPhoneForApi', () => {
  it('strips formatting and adds + prefix', () => {
    expect(formatPhoneForApi('+1 (604) 555-1234')).toBe('+16045551234')
  })

  it('adds + prefix when missing', () => {
    expect(formatPhoneForApi('16045551234')).toBe('+16045551234')
  })

  it('keeps + prefix if already present', () => {
    expect(formatPhoneForApi('+16045551234')).toBe('+16045551234')
  })
})

describe('validateEmail', () => {
  it('returns valid for an empty string (optional field)', () => {
    expect(validateEmail('').valid).toBe(true)
  })

  it('returns valid for a whitespace-only string', () => {
    expect(validateEmail('   ').valid).toBe(true)
  })

  it('returns valid for a standard email', () => {
    expect(validateEmail('user@example.com').valid).toBe(true)
  })

  it('returns valid for a subdomain email', () => {
    expect(validateEmail('admin@mail.example.co.uk').valid).toBe(true)
  })

  it('returns error when @ is missing', () => {
    const result = validateEmail('userexample.com')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('@')
  })

  it('returns error when domain is missing', () => {
    const result = validateEmail('user@')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('domain')
  })

  it('returns error when local part is missing', () => {
    const result = validateEmail('@example.com')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('username')
  })

  it('returns error when domain has no dot', () => {
    const result = validateEmail('user@example')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('dot')
  })

  it('returns error when TLD is too short', () => {
    const result = validateEmail('user@example.c')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too short')
  })
})
