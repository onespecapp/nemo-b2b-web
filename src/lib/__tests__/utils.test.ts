import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parseUTCDate, formatDuration, formatRelativeTime, formatDateTime } from '../utils'

describe('parseUTCDate', () => {
  it('returns a Date from an ISO string with Z suffix', () => {
    const result = parseUTCDate('2025-06-15T10:30:00Z')
    expect(result).toBeInstanceOf(Date)
    expect(result.toISOString()).toBe('2025-06-15T10:30:00.000Z')
  })

  it('appends Z to a string without timezone info', () => {
    const result = parseUTCDate('2025-06-15T10:30:00')
    expect(result.toISOString()).toBe('2025-06-15T10:30:00.000Z')
  })

  it('preserves a string with timezone offset', () => {
    const result = parseUTCDate('2025-06-15T10:30:00+05:00')
    expect(result).toBeInstanceOf(Date)
    // +05:00 means 10:30 local = 05:30 UTC
    expect(result.getUTCHours()).toBe(5)
    expect(result.getUTCMinutes()).toBe(30)
  })
})

describe('formatDuration', () => {
  it('returns "-" for null', () => {
    expect(formatDuration(null)).toBe('-')
  })

  it('returns "-" for 0', () => {
    expect(formatDuration(0)).toBe('-')
  })

  it('formats seconds-only durations', () => {
    expect(formatDuration(45)).toBe('0:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2:05')
  })

  it('formats exact minutes', () => {
    expect(formatDuration(60)).toBe('1:00')
  })

  it('pads seconds to two digits', () => {
    expect(formatDuration(63)).toBe('1:03')
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for recent timestamps', () => {
    expect(formatRelativeTime('2025-06-15T11:59:45Z')).toBe('just now')
  })

  it('returns minutes ago for timestamps within the hour', () => {
    expect(formatRelativeTime('2025-06-15T11:30:00Z')).toBe('30m ago')
  })

  it('returns hours ago for timestamps within the day', () => {
    expect(formatRelativeTime('2025-06-15T06:00:00Z')).toBe('6h ago')
  })

  it('returns days ago for timestamps beyond 24 hours', () => {
    expect(formatRelativeTime('2025-06-12T12:00:00Z')).toBe('3d ago')
  })

  it('returns months for timestamps beyond 30 days', () => {
    expect(formatRelativeTime('2025-04-15T12:00:00Z')).toBe('2mo ago')
  })

  it('returns "in X" for future timestamps', () => {
    expect(formatRelativeTime('2025-06-15T14:00:00Z')).toBe('in 2h')
  })
})

describe('formatDateTime', () => {
  it('formats a date string to a readable format', () => {
    const result = formatDateTime('2025-06-15T10:30:00Z')
    // The exact output depends on locale, but should contain key parts
    expect(result).toContain('Jun')
    expect(result).toContain('15')
    expect(result).toContain('2025')
  })
})
