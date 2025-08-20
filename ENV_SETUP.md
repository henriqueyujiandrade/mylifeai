# Environment Configuration Guide

## 🔧 Environment Files Overview

This project uses Vite's environment variable system with proper TypeScript support and multiple environment configurations.

### Environment Files

| File | Purpose | Committed to Git |
|------|---------|------------------|
| `.env` | Default values for all environments | ✅ Yes |
| `.env.example` | Template for developers | ✅ Yes |
| `.env.production` | Production-specific values | ✅ Yes |
| `.env.local` | Local development overrides | ❌ No |
| `.env.development.local` | Development-specific secrets | ❌ No |
| `.env.staging.local` | Staging-specific secrets | ❌ No |
| `.env.production.local` | Production secrets | ❌ No |

## 🚀 Quick Setup

1. **Copy the example file for local development:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update values in `.env.local` for your local setup:**
   ```bash
   # Example customizations
   VITE_API_URL=http://localhost:8000/api
   VITE_ENABLE_DEV_TOOLS=true
   ```

## 📝 Environment Variables

### API Configuration
- `VITE_API_URL` - API base URL
- `VITE_API_TIMEOUT` - Request timeout in milliseconds

### App Configuration
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_APP_ENVIRONMENT` - Current environment (development/staging/production)

### Authentication
- `VITE_AUTH_TOKEN_KEY` - LocalStorage key for auth token
- `VITE_AUTH_REFRESH_TOKEN_KEY` - LocalStorage key for refresh token

### Feature Flags
- `VITE_ENABLE_DEV_TOOLS` - Enable development tools
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking
- `VITE_ENABLE_ERROR_REPORTING` - Enable error reporting

### Theme Configuration
- `VITE_DEFAULT_THEME` - Default theme (light/dark/system)
- `VITE_ENABLE_THEME_PERSISTENCE` - Enable theme persistence

## 🔐 TypeScript Support

Environment variables are fully typed in `src/types/env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  // ... other variables with proper types
}
```

## 🛠️ Usage in Code

### Direct Access
```typescript
// Direct access (not recommended for complex logic)
const apiUrl = import.meta.env.VITE_API_URL
```

### Centralized Configuration (Recommended)
```typescript
import { env } from '@/lib/config/env'

// Type-safe access with defaults and parsing
console.log(env.API_URL)           // string
console.log(env.API_TIMEOUT)       // number
console.log(env.ENABLE_DEV_TOOLS)  // boolean
console.log(env.isDevelopment)     // computed boolean
```

## 🌍 Environment Precedence

Vite loads environment variables in this order (highest to lowest priority):

1. `.env.local` - Always ignored by git
2. `.env.development.local` / `.env.production.local` / `.env.staging.local`
3. `.env.development` / `.env.production` / `.env.staging`
4. `.env`

## 🔍 Environment Utilities

The `src/lib/config/env.ts` file provides:

- **Type Safety**: All variables properly typed
- **Default Values**: Fallbacks for missing variables
- **Type Conversion**: Automatic parsing of booleans and numbers
- **Computed Properties**: Convenient environment checks

```typescript
import { env } from '@/lib/config/env'

// Type-safe boolean parsing
env.ENABLE_DEV_TOOLS // boolean, not string

// Computed environment checks
if (env.isDevelopment) {
  console.log('Development mode')
}

// Safe number parsing
env.API_TIMEOUT // number with fallback
```

## 🚨 Security Best Practices

### ✅ DO
- Use `VITE_` prefix for public variables
- Keep sensitive data in `.env.local` files
- Use different API URLs for different environments
- Validate environment variables at startup

### ❌ DON'T
- Commit `.env.local` or `.env.*.local` files
- Store secrets in environment variables prefixed with `VITE_`
- Use production values in development files
- Access `import.meta.env` directly in production code

## 🐛 Troubleshooting

### Environment Variables Not Loading
1. Ensure variable names start with `VITE_`
2. Restart the development server after changing `.env` files
3. Check that the variable is declared in `src/types/env.d.ts`

### TypeScript Errors
1. Update `src/types/env.d.ts` when adding new variables
2. Use the centralized `env` object for type safety
3. Ensure proper type annotations for complex values

### Build Issues
1. Verify all required variables are set in production
2. Check that `.env.production` contains all necessary values
3. Ensure no references to development-only variables in production builds

## 📚 Further Reading

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript Environment Types](https://vitejs.dev/guide/env-and-mode.html#typescript)
- [Environment Security Best Practices](https://vitejs.dev/guide/env-and-mode.html#security)