// Environment configuration utilities

// Helper to safely parse boolean environment variables
export const parseBooleanEnv = (value: string | undefined, defaultValue = false): boolean => {
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true'
}

// Helper to safely parse number environment variables
export const parseNumberEnv = (value: string | undefined, defaultValue: number): number => {
  if (value === undefined) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

// Environment configuration object with type safety and defaults
export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseNumberEnv(import.meta.env.VITE_API_TIMEOUT, 10000),
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MyLife.AI',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  
  // Auth Configuration
  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  AUTH_REFRESH_TOKEN_KEY: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'refresh_token',
  
  // Feature Flags
  ENABLE_DEV_TOOLS: parseBooleanEnv(import.meta.env.VITE_ENABLE_DEV_TOOLS, true),
  ENABLE_ANALYTICS: parseBooleanEnv(import.meta.env.VITE_ENABLE_ANALYTICS, false),
  ENABLE_ERROR_REPORTING: parseBooleanEnv(import.meta.env.VITE_ENABLE_ERROR_REPORTING, false),
  
  // Theme Configuration
  DEFAULT_THEME: (import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark' | 'system') || 'system',
  ENABLE_THEME_PERSISTENCE: parseBooleanEnv(import.meta.env.VITE_ENABLE_THEME_PERSISTENCE, true),
  
  // Computed properties
  get isDevelopment() {
    return this.APP_ENVIRONMENT === 'development'
  },
  
  get isProduction() {
    return this.APP_ENVIRONMENT === 'production'
  },
  
  get isStaging() {
    return this.APP_ENVIRONMENT === 'staging'
  }
} as const

// Type for the environment configuration
export type EnvConfig = typeof env