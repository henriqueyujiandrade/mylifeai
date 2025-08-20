import { lazy, ComponentType, LazyExoticComponent } from 'react'
import { AsyncBoundary } from '../AsyncBoundary'

interface LazyComponentOptions {
  fallback?: React.ReactNode
  errorFallback?: (error: Error) => React.ReactNode
  preload?: boolean
  retryCount?: number
}

/**
 * Enhanced lazy loading with preloading, error handling, and retry logic
 */
export function createLazyComponent<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> & { preload: () => void } {
  
  const {
    fallback = <LazyFallback />,
    errorFallback = (error) => <LazyErrorFallback error={error} />,
    preload = false,
    retryCount = 3
  } = options

  // Create lazy component with retry logic
  const LazyComponent = lazy(() => 
    retryImport(importFn, retryCount)
  ) as LazyExoticComponent<T> & { preload: () => void }

  // Add preload method
  LazyComponent.preload = () => {
    importFn().catch(() => {
      // Ignore preload errors - they'll be handled when actually loading
    })
  }

  // Auto-preload if requested
  if (preload) {
    LazyComponent.preload()
  }

  // Return wrapper component with enhanced error handling
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <AsyncBoundary
      fallback={fallback}
      errorFallback={errorFallback}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <LazyComponent {...props as any} />
    </AsyncBoundary>
  )

  // Copy preload method to wrapper
  WrappedComponent.preload = LazyComponent.preload

  return WrappedComponent as LazyExoticComponent<T> & { preload: () => void }
}

/**
 * Retry import with exponential backoff
 */
async function retryImport<T>(
  importFn: () => Promise<T>,
  retryCount: number
): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    if (retryCount > 0) {
      // Wait with exponential backoff
      const delay = Math.pow(2, 3 - retryCount) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      return retryImport(importFn, retryCount - 1)
    }
    throw error
  }
}

/**
 * Loading fallback with better UX
 */
function LazyFallback() {
  return (
    <div className="flex items-center justify-center p-8 min-h-32">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-2 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * Error fallback with retry functionality
 */
function LazyErrorFallback({ error }: { error: Error }) {
  const isNetworkError = error.message.includes('Loading chunk') || 
                         error.message.includes('Failed to fetch')

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-4xl mb-4">
        {isNetworkError ? '🌐' : '⚠️'}
      </div>
      <h3 className="text-lg font-semibold theme-text-primary mb-2">
        {isNetworkError ? 'Connection Issue' : 'Loading Failed'}
      </h3>
      <p className="theme-text-secondary mb-4 max-w-md">
        {isNetworkError 
          ? 'Unable to load this section. Please check your connection and try again.'
          : error.message
        }
      </p>
      <button
        onClick={handleRetry}
        className="theme-button-primary px-4 py-2 rounded-md text-sm font-medium"
      >
        Try Again
      </button>
    </div>
  )
}

/**
 * Hook for lazy loading with intersection observer
 */
export function useLazyLoad<T extends ComponentType<Record<string, unknown>>>(
  LazyComponent: LazyExoticComponent<T> & { preload: () => void },
  threshold = 0.1
) {
  const handleIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        LazyComponent.preload()
      }
    })
  }

  return {
    preload: LazyComponent.preload,
    observerCallback: handleIntersect,
    observerOptions: { threshold }
  }
}

/**
 * Route-based lazy loading with preloading on hover
 */
export function createLazyRoute<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  preloadOnHover = true
) {
  const LazyComponent = createLazyComponent(importFn, {
    fallback: <RouteFallback />,
    retryCount: 2
  })

  if (preloadOnHover) {
    // Add hover preloading to navigation links
    const originalPreload = LazyComponent.preload
    LazyComponent.preload = () => {
      // Add small delay to avoid excessive preloading
      setTimeout(originalPreload, 100)
    }
  }

  return LazyComponent
}

/**
 * Route loading fallback
 */
function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="theme-text-secondary">Loading page...</p>
      </div>
    </div>
  )
}