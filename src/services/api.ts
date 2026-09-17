import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { STORAGE_KEYS, ROUTE_PATHS } from '@/constants'

/**
 * Configured Axios HTTP client instance.
 * Automatically handles:
 * 1. Base URL prefix (`/api`, proxied via Vite dev server to ASP.NET Core backend).
 * 2. Request Interceptor: Automatically injects JWT Bearer token into Authorization header.
 * 3. Response Interceptor: Catches HTTP 401 Unauthorized responses, clears session, and redirects to login.
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds request timeout
})

// =========================================================================
// Request Interceptor: Inject JWT Bearer Token
// =========================================================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// =========================================================================
// Response Interceptor: Handle Global HTTP 401 Unauthorized
// =========================================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored credentials
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER)

      // Redirect to login page unless already on an auth page
      if (window.location.pathname !== ROUTE_PATHS.LOGIN && window.location.pathname !== ROUTE_PATHS.REGISTER) {
        window.location.href = ROUTE_PATHS.LOGIN
      }
    }
    return Promise.reject(error)
  }
)

export default api
