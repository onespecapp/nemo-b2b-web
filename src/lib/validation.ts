// Phone number validation utilities (E.164 format)

const E164_PHONE_REGEX = /^\+?[1-9]\d{1,14}$/

/**
 * Strips common formatting characters (spaces, dashes, parentheses, dots) from a phone string.
 */
function cleanPhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '')
}

/**
 * Returns true if the phone string is a valid E.164 number
 * after stripping spaces, dashes, and parentheses.
 *
 * Accepts formats like:
 *   +12125551234
 *   +1 (212) 555-1234
 *   12125551234
 */
export function isValidE164Phone(phone: string): boolean {
  const cleaned = cleanPhone(phone)
  return E164_PHONE_REGEX.test(cleaned)
}

/**
 * Formats a phone string for display as (XXX) XXX-XXXX for North American
 * numbers or returns the cleaned E.164 string for international numbers.
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = cleanPhone(phone)
  const digits = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned

  // North American: 11 digits starting with 1, or 10 digits
  if (digits.length === 11 && digits.startsWith('1')) {
    const area = digits.slice(1, 4)
    const prefix = digits.slice(4, 7)
    const line = digits.slice(7)
    return `+1 (${area}) ${prefix}-${line}`
  }

  if (digits.length === 10) {
    const area = digits.slice(0, 3)
    const prefix = digits.slice(3, 6)
    const line = digits.slice(6)
    return `+1 (${area}) ${prefix}-${line}`
  }

  // International: just return with + prefix
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

/**
 * Validates a phone string and returns an object with validity and optional error message.
 *
 * Empty strings are considered valid (field may be optional).
 * Use `required` checks separately if the field is mandatory.
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone.trim()) {
    return { valid: true }
  }

  const cleaned = cleanPhone(phone)

  if (cleaned.length < 2) {
    return { valid: false, error: 'Phone number is too short.' }
  }

  if (!E164_PHONE_REGEX.test(cleaned)) {
    return { valid: false, error: 'Enter a valid phone number (e.g. +1 212 555 1234).' }
  }

  return { valid: true }
}

/**
 * Cleans a phone string and ensures it has a + prefix, ready for API/database storage.
 */
export function formatPhoneForApi(phone: string): string {
  const cleaned = cleanPhone(phone)
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

// Email validation utilities

/**
 * Validates an email string and returns an object with validity and optional error message.
 *
 * Empty strings are considered valid (field may be optional).
 * Use `required` checks separately if the field is mandatory.
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email.trim()) {
    return { valid: true }
  }

  const trimmed = email.trim()

  if (!trimmed.includes('@')) {
    return { valid: false, error: 'Email must include an @ symbol.' }
  }

  const [local, ...rest] = trimmed.split('@')
  const domain = rest.join('@')

  if (!local) {
    return { valid: false, error: 'Email is missing a username before the @.' }
  }

  if (!domain) {
    return { valid: false, error: 'Email is missing a domain after the @.' }
  }

  if (!domain.includes('.')) {
    return { valid: false, error: 'Email domain must include a dot (e.g. example.com).' }
  }

  const domainParts = domain.split('.')
  const tld = domainParts[domainParts.length - 1]

  if (tld.length < 2) {
    return { valid: false, error: 'Email domain ending is too short.' }
  }

  // Basic format check: no spaces, reasonable characters
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email address (e.g. name@example.com).' }
  }

  return { valid: true }
}
