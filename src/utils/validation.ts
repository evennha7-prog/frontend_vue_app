/**
 * Form input validation utility functions.
 */

/**
 * Validates that an email string conforms to a standard email format.
 * 
 * @param email The email string to test
 * @returns True if valid email format; otherwise false
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validates that a string value is present and not only whitespace.
 * 
 * @param value String to test
 * @returns True if non-empty; otherwise false
 */
export function validateRequired(value?: string | null): boolean {
  return !!value && value.trim().length > 0
}

/**
 * Validates that a string satisfies a minimum character length.
 * 
 * @param value String to test
 * @param minLength Minimum number of characters required
 * @returns True if meets or exceeds minLength; otherwise false
 */
export function validateMinLength(value: string, minLength: number): boolean {
  return !!value && value.trim().length >= minLength
}
