import api from './api'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth'

/**
 * Authentication API Service.
 * Interacts with backend `/api/auth` endpoints.
 */
export const authService = {
  /**
   * Registers a new user account.
   * 
   * @param data Username, email, and password payload
   * @returns LoginResponse containing JWT token and UserDto
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data)
    return response.data
  },

  /**
   * Authenticates an existing user by email/username and password.
   * 
   * @param data Email/username and password payload
   * @returns LoginResponse containing JWT token and UserDto
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  /**
   * Retrieves profile of currently authenticated user.
   * 
   * @returns User profile data
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },
}
