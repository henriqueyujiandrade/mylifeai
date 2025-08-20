import React, { Component, ErrorInfo, ReactNode } from 'react'
import { errorReportingService } from '../../services/errorReporting'

interface Props {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  level?: 'page' | 'feature' | 'component'
  identifier?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

export class AdvancedErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Report error to monitoring service
    this.reportError(error, errorInfo)

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Auto-retry for component-level errors
    if (this.props.level === 'component' && this.state.retryCount < this.maxRetries) {
      this.scheduleRetry()
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    const context = {
      level: this.props.level || 'unknown',
      identifier: this.props.identifier,
      componentStack: errorInfo.componentStack || undefined,
      retryCount: this.state.retryCount,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    errorReportingService.reportError(error, context)
  }

  private scheduleRetry = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, this.state.retryCount) * 1000

    this.retryTimeoutId = window.setTimeout(() => {
      this.retry()
    }, delay)
  }

  private retry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  private manualRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    })
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.manualRetry)
      }

      // Default fallback based on error level
      return this.renderDefaultFallback()
    }

    return this.props.children
  }

  private renderDefaultFallback = () => {
    const { level = 'component' } = this.props
    const { error, retryCount } = this.state

    const isRetrying = retryCount > 0 && retryCount < this.maxRetries
    const canRetry = retryCount < this.maxRetries

    switch (level) {
      case 'page':
        return (
          <div className="min-h-screen flex items-center justify-center theme-bg-primary">
            <div className="max-w-md mx-auto text-center p-8">
              <div className="text-6xl mb-4">🚨</div>
              <h1 className="text-2xl font-bold theme-text-primary mb-4">
                Page Error
              </h1>
              <p className="theme-text-secondary mb-6">
                Something went wrong loading this page.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer theme-text-secondary">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-4 bg-red-50 text-red-800 text-xs rounded overflow-auto">
                    {error?.message}
                    {error?.stack}
                  </pre>
                </details>
              )}
              <div className="space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="theme-button-primary px-6 py-2 rounded-md"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="theme-button-secondary px-6 py-2 rounded-md"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )

      case 'feature':
        return (
          <div className="p-6 theme-bg-surface theme-border border rounded-lg">
            <div className="text-center">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold theme-text-primary mb-2">
                Feature Unavailable
              </h3>
              <p className="theme-text-secondary mb-4">
                This feature is temporarily unavailable.
              </p>
              {isRetrying && (
                <p className="text-sm theme-text-secondary mb-4">
                  Retrying... (Attempt {retryCount}/{this.maxRetries})
                </p>
              )}
              {canRetry && !isRetrying && (
                <button
                  onClick={this.manualRetry}
                  className="theme-button-primary px-4 py-2 rounded-md text-sm"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )

      default: // component
        return (
          <div className="p-4 theme-bg-surface theme-border border rounded">
            <div className="text-center">
              <div className="text-xl mb-2">⚠️</div>
              <p className="theme-text-secondary text-sm mb-3">
                Component failed to load
              </p>
              {isRetrying && (
                <p className="text-xs theme-text-secondary mb-2">
                  Retrying...
                </p>
              )}
              {canRetry && !isRetrying && (
                <button
                  onClick={this.manualRetry}
                  className="theme-button-secondary px-3 py-1 rounded text-xs"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )
    }
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <AdvancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </AdvancedErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}