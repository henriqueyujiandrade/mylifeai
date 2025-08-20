import { useCallback, useEffect } from 'react'
import { errorReportingService } from '../services/errorReporting'

/**
 * Hook for component-level error reporting and monitoring
 */
export function useErrorReporting(componentName?: string) {
  // Report component mount/unmount for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && componentName) {
      console.log(`📊 Component ${componentName} mounted`)
      return () => {
        console.log(`📊 Component ${componentName} unmounted`)
      }
    }
  }, [componentName])

  // Callback to report errors manually
  const reportError = useCallback((error: Error, context?: Record<string, unknown>) => {
    errorReportingService.reportError(error, {
      level: 'component',
      identifier: componentName,
      ...context
    })
  }, [componentName])

  // Callback to report performance issues
  const reportPerformanceIssue = useCallback((metric: string, value: number, threshold: number) => {
    errorReportingService.reportPerformanceIssue(metric, value, threshold)
  }, [])

  // Get error stats for debugging
  const getErrorStats = useCallback(() => {
    return errorReportingService.getErrorStats()
  }, [])

  return {
    reportError,
    reportPerformanceIssue,
    getErrorStats
  }
}

/**
 * Hook for automatic error tracking in async operations
 */
export function useAsyncErrorTracking() {
  const reportError = useCallback((error: Error, operation: string) => {
    errorReportingService.reportError(error, {
      level: 'async',
      identifier: operation,
      type: 'async_operation'
    })
  }, [])

  // Wrapper for async functions that automatically reports errors
  const trackAsync = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    operationName: string
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args)
      } catch (error) {
        reportError(error instanceof Error ? error : new Error(String(error)), operationName)
        throw error
      }
    }
  }, [reportError])

  return {
    reportError,
    trackAsync
  }
}

/**
 * Hook for performance monitoring with error reporting
 */
export function usePerformanceMonitoringWithErrors(componentName: string) {
  const { reportPerformanceIssue } = useErrorReporting(componentName)
  
  useEffect(() => {
    let renderStart: number
    let mounted = true

    const measureRender = () => {
      renderStart = performance.now()
    }

    const reportRender = () => {
      if (!mounted) return
      
      const renderTime = performance.now() - renderStart
      
      // Report slow renders as performance issues
      if (renderTime > 16) { // 16ms threshold for 60fps
        reportPerformanceIssue('component_render_time', renderTime, 16)
      }
    }

    // Measure initial render
    measureRender()
    
    // Use scheduler.postTask if available (React 19)
    if ('scheduler' in window && 'postTask' in ((window as unknown as Record<string, unknown>).scheduler as Record<string, unknown>)) {
      ((window as unknown as Record<string, unknown>).scheduler as { postTask: (callback: () => void, options: { priority: string }) => void }).postTask(reportRender, { priority: 'background' })
    } else {
      setTimeout(reportRender, 0)
    }

    return () => {
      mounted = false
    }
  }, [componentName, reportPerformanceIssue])

  // Memory usage monitoring
  useEffect(() => {
    if (!('memory' in performance)) return

    const checkMemory = () => {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
        reportPerformanceIssue(
          'memory_usage',
          memory.usedJSHeapSize,
          memory.jsHeapSizeLimit * 0.8
        )
      }
    }

    const interval = setInterval(checkMemory, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [reportPerformanceIssue])

  return {
    reportPerformanceIssue
  }
}