/**
 * Error reporting service for React 19
 * Collects and reports errors for monitoring and debugging
 */

interface ErrorContext {
  level?: string
  identifier?: string
  componentStack?: string
  retryCount?: number
  userAgent?: string
  url?: string
  timestamp?: string
  userId?: string
  sessionId?: string
  [key: string]: unknown
}

interface ErrorReport {
  error: {
    name: string
    message: string
    stack?: string
  }
  context: ErrorContext
  fingerprint: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class ErrorReportingService {
  private errors: ErrorReport[] = []
  private maxErrors = 100
  private sessionId: string
  private isOnline = navigator.onLine

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
    this.setupOnlineStatusListener()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError(event.error || new Error(event.message), {
        level: 'global',
        identifier: 'unhandled_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          level: 'global',
          identifier: 'unhandled_promise_rejection'
        }
      )
    })

    // Handle React error boundaries (if not already handled)
    if ('addEventListener' in window) {
      window.addEventListener('react-error' as keyof WindowEventMap, (event: Event) => {
        const customEvent = event as CustomEvent<{ error: Error; errorInfo?: { componentStack?: string } }>
        this.reportError(customEvent.detail.error, {
          level: 'react',
          identifier: 'error_boundary',
          componentStack: customEvent.detail.errorInfo?.componentStack
        })
      })
    }
  }

  private setupOnlineStatusListener() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushPendingErrors()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  reportError(error: Error, context: ErrorContext = {}) {
    const errorReport: ErrorReport = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: {
        ...context,
        timestamp: context.timestamp || new Date().toISOString(),
        userAgent: context.userAgent || navigator.userAgent,
        url: context.url || window.location.href,
        sessionId: this.sessionId,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language
      },
      fingerprint: this.generateFingerprint(error, context),
      severity: this.determineSeverity(error, context)
    }

    this.storeError(errorReport)
    
    // Try to send immediately if online
    if (this.isOnline) {
      this.sendError(errorReport)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Report')
      console.error('Error:', error)
      console.log('Context:', context)
      console.log('Severity:', errorReport.severity)
      console.log('Fingerprint:', errorReport.fingerprint)
      console.groupEnd()
    }
  }

  private generateFingerprint(error: Error, context: ErrorContext): string {
    const key = `${error.name}_${error.message}_${context.level}_${context.identifier}`
    return btoa(key).replace(/[+/=]/g, '').substr(0, 16)
  }

  private determineSeverity(error: Error, context: ErrorContext): ErrorReport['severity'] {
    // Critical: page-level errors, authentication errors
    if (context.level === 'page' || error.message.includes('auth')) {
      return 'critical'
    }

    // High: feature-level errors, API failures
    if (context.level === 'feature' || error.message.includes('fetch') || error.message.includes('network')) {
      return 'high'
    }

    // Medium: component errors with retries
    if (context.level === 'component' && (context.retryCount || 0) > 0) {
      return 'medium'
    }

    // Low: other component errors
    return 'low'
  }

  private storeError(errorReport: ErrorReport) {
    this.errors.push(errorReport)

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('error_reports', JSON.stringify(this.errors.slice(-10)))
    } catch {
      // Ignore localStorage errors
    }
  }

  private async sendError(errorReport: ErrorReport) {
    try {
      // In a real app, this would send to your error reporting service
      // For now, we'll simulate the API call
      await this.mockErrorReportingAPI(errorReport)
    } catch (error) {
      // If sending fails, keep the error for later retry
      console.warn('Failed to send error report:', error)
    }
  }

  private async mockErrorReportingAPI(_errorReport: ErrorReport): Promise<void> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve()
        } else {
          reject(new Error('Network error'))
        }
      }, 100)
    })
  }

  private async flushPendingErrors() {
    const pendingErrors = [...this.errors]
    
    for (const error of pendingErrors) {
      try {
        await this.sendError(error)
      } catch {
        // Stop flushing on first failure
        break
      }
    }
  }

  // Public methods for debugging and monitoring
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      byLevel: {} as Record<string, number>,
      recent: this.errors.slice(-5)
    }

    this.errors.forEach(error => {
      stats.bySeverity[error.severity]++
      const level = error.context.level || 'unknown'
      stats.byLevel[level] = (stats.byLevel[level] || 0) + 1
    })

    return stats
  }

  clearErrors() {
    this.errors = []
    localStorage.removeItem('error_reports')
  }

  // Performance monitoring integration
  reportPerformanceIssue(metric: string, value: number, threshold: number) {
    if (value > threshold) {
      this.reportError(new Error(`Performance issue: ${metric}`), {
        level: 'performance',
        identifier: metric,
        value,
        threshold,
        severity: value > threshold * 2 ? 'high' : 'medium'
      })
    }
  }
}

export const errorReportingService = new ErrorReportingService()

// Global access for debugging
if (process.env.NODE_ENV === 'development') {
  (window as unknown as Record<string, unknown>).errorReporting = errorReportingService
}