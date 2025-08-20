/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // App Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: 'development' | 'staging' | 'production'
  
  // Auth Configuration
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_REFRESH_TOKEN_KEY: string
  
  // Feature Flags
  readonly VITE_ENABLE_DEV_TOOLS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
  
  // Theme Configuration
  readonly VITE_DEFAULT_THEME: 'light' | 'dark' | 'system'
  readonly VITE_ENABLE_THEME_PERSISTENCE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}