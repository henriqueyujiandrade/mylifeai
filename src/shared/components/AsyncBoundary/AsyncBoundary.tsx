import { Suspense, ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface AsyncBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: (error: Error) => ReactNode
  onError?: (error: Error) => void
}

/**
 * React 19 enhanced AsyncBoundary that combines Suspense + ErrorBoundary
 * Provides better UX for async operations with proper loading and error states
 */
export function AsyncBoundary({
  children,
  fallback = <DefaultLoadingFallback />,
  errorFallback = (error) => <DefaultErrorFallback error={error} />,
  onError
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={errorFallback}
      onError={onError}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

/**
 * Default loading component with better UX
 */
function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label="Loading content">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Default error component with retry functionality
 */
function DefaultErrorFallback({ error }: { error: Error }) {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="text-center p-8 theme-bg-surface rounded-lg theme-border border" role="alert">
      <div className="text-red-500 text-xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold theme-text-primary mb-2">
        Something went wrong
      </h3>
      <p className="theme-text-secondary mb-4">
        {error.message || 'An unexpected error occurred'}
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
 * Specialized AsyncBoundary for data fetching
 */
export function DataBoundary({
  children,
  loadingMessage = "Loading data...",
  errorMessage = "Failed to load data"
}: {
  children: ReactNode
  loadingMessage?: string
  errorMessage?: string
}) {
  return (
    <AsyncBoundary
      fallback={
        <div className="flex items-center justify-center p-4">
          <div className="animate-pulse flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span className="theme-text-secondary">{loadingMessage}</span>
          </div>
        </div>
      }
      errorFallback={(error) => (
        <div className="p-4 theme-bg-red-50 dark:theme-bg-red-900/20 rounded-md">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {errorMessage}: {error.message}
          </p>
        </div>
      )}
    >
      {children}
    </AsyncBoundary>
  )
}