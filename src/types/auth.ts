/**
 * Authentication and User-related TypeScript interfaces.
 */

/**
 * Represents the public authenticated user profile.
 */
export interface User {
  /** Unique user database identifier */
  id: number
  /** User's unique handle / display username */
  username: string
  /** User's registered email address */
  email: string
}

/**
 * Server response payload returned upon successful login or registration.
 */
export interface LoginResponse {
  /** Signed JWT Bearer token used for subsequent authenticated HTTP calls */
  token: string
  /** UTC timestamp string of token expiration */
  expiration: string
  /** Profile details of the logged in user */
  user: User
}

/**
 * Form data payload for creating a new account.
 */
export interface RegisterRequest {
  /** Desired username (3-50 characters) */
  username: string
  /** Valid email address */
  email: string
  /** Password (minimum 6 characters) */
  password: string
}

/**
 * Form data payload for logging in.
 */
export interface LoginRequest {
  /** Registered email address or username */
  emailOrUsername: string
  /** Account password */
  password: string
}
