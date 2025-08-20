import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { env } from '../../app/config/env'

// API client configuration
export const client = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(env.AUTH_TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem(env.AUTH_TOKEN_KEY)
      localStorage.removeItem(env.AUTH_REFRESH_TOKEN_KEY)
      // Optionally redirect to login page
      window.location.href = '/login'
    }
    
    // Handle other common errors
    if (error.response?.status === 403) {
      console.warn('Access forbidden:', error.response?.data || 'No additional error details')
    }
    
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response?.data || 'No additional error details')
    }
    
    return Promise.reject(error)
  }
)

// Generic request wrapper with better error handling
const request = async <T = unknown>(options: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await client(options)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Re-throw with enhanced error information
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'An unexpected error occurred'
      )
    }
    throw error
  }
}

export default request