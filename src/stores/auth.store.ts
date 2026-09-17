import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { STORAGE_KEYS } from '@/constants'
import type { LoginRequest, RegisterRequest, User } from '@/types/auth'

/**
 * Pinia Store for Authentication & User Session Management.
 * Handles login, registration, logout, session persistence across page reloads via localStorage,
 * and tracks loading and error states.
 */
export const useAuthStore = defineStore('auth', () => {
  // -------------------------------------------------------------
  // State
  // -------------------------------------------------------------
  /** JWT token read from browser localStorage on app startup */
  const token = ref<string | null>(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN))

  /** Cached user profile stored in localStorage */
  const user = ref<User | null>(
    localStorage.getItem(STORAGE_KEYS.AUTH_USER)
      ? JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_USER) as string)
      : null
  )

  /** Global loading state for authentication requests */
  const loading = ref<boolean>(false)

  /** Error message string from the latest failed authentication attempt */
  const error = ref<string | null>(null)

  // -------------------------------------------------------------
  // Getters (Computed)
  // -------------------------------------------------------------
  /** Computed boolean indicating if user currently holds an active token */
  const isAuthenticated = computed(() => !!token.value)

  // -------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------

  /**
   * Logs in user with credentials, saves token & user to localStorage,
   * and updates reactive store state.
   * 
   * @param credentials Email/username and password
   */
  async function login(credentials: LoginRequest) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user
      // Persist session to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user))
      return response
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Login failed. Please check your credentials.'
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  /**
   * Registers a new user, automatically logging them in upon success.
   * 
   * @param data Username, email, and password
   */
  async function register(data: RegisterRequest) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(data)
      token.value = response.token
      user.value = response.user
      // Persist session to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user))
      return response
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Registration failed.'
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  /**
   * Logs out the user by clearing state and wiping localStorage keys.
   */
  function logout() {
    token.value = null
    user.value = null
    error.value = null
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
  }

  /**
   * Verifies existing token validity by calling `/api/auth/me`.
   * Automatically logs out if token is expired or invalid.
   */
  async function checkAuth() {
    if (!token.value) return
    try {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser))
    } catch {
      logout()
    }
  }

  return {
    // State
    token,
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    login,
    register,
    logout,
    checkAuth,
  }
})
