/**
 * Browser LocalStorage key definitions used across the application.
 * Centralizing keys prevents typos and ensures single point of configuration.
 */
export const STORAGE_KEYS = {
  /** JWT access bearer token */
  AUTH_TOKEN: 'notes_auth_token',
  /** Cached JSON user profile object */
  AUTH_USER: 'notes_auth_user',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
