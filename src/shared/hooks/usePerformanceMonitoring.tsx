import { useEffect, useRef, useCallback } from 'react'

interface PerformanceMetrics {
  componentName: string
  renderTime: number
  mountTime: number
  updateCount: number
  lastUpdate: number
  memoryUsage?: number
}

interface PerformanceConfig {
  enableProfiling: boolean
  sampleRate: number
  enableMemoryMonitoring: boolean
  logThreshold: number // Log renders slower than this (ms)
}

const defaultConfig: PerformanceConfig = {
  enableProfiling: process.env.NODE_ENV === 'development',
  sampleRate: process.env.NODE_ENV === 'development' ? 0.05 : 0.01, // 5% dev, 1% prod
  enableMemoryMonitoring: false,
  logThreshold: 50 // More reasonable threshold - 50ms
}

class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetrics>()
  private config: PerformanceConfig
  private startTimes = new Map<string, number>()

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  startMeasure(componentName: string, phase: 'mount' | 'update' = 'update') {
    if (!this.shouldMeasure()) return

    const key = `${componentName}-${phase}`
    this.startTimes.set(key, performance.now())
  }

  endMeasure(componentName: string, phase: 'mount' | 'update' = 'update') {
    if (!this.shouldMeasure()) return

    const key = `${componentName}-${phase}`
    const startTime = this.startTimes.get(key)
    
    if (!startTime) return

    const endTime = performance.now()
    const renderTime = endTime - startTime

    this.updateMetrics(componentName, renderTime, phase)
    this.startTimes.delete(key)

    // Log slow renders only in development
    if (process.env.NODE_ENV === 'development' && renderTime > this.config.logThreshold) {
      console.warn(`🐌 Slow ${phase}: ${componentName} (${renderTime.toFixed(1)}ms)`)
    }
  }

  private shouldMeasure(): boolean {
    return this.config.enableProfiling && 
           Math.random() < this.config.sampleRate
  }

  private updateMetrics(componentName: string, renderTime: number, phase: 'mount' | 'update') {
    const existing = this.metrics.get(componentName) || {
      componentName,
      renderTime: 0,
      mountTime: 0,
      updateCount: 0,
      lastUpdate: 0
    }

    const updated: PerformanceMetrics = {
      ...existing,
      renderTime: (existing.renderTime + renderTime) / 2, // Moving average
      lastUpdate: Date.now(),
      ...(phase === 'mount' 
        ? { mountTime: renderTime }
        : { updateCount: existing.updateCount + 1 }
      )
    }

    if (this.config.enableMemoryMonitoring && 'memory' in performance) {
      updated.memoryUsage = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize
    }

    this.metrics.set(componentName, updated)
  }

  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }

  getSlowComponents(threshold = 16): PerformanceMetrics[] {
    return this.getMetrics().filter(metric => metric.renderTime > threshold)
  }

  exportMetrics(): string {
    const metrics = this.getMetrics()
    return JSON.stringify(metrics, null, 2)
  }

  reset(): void {
    this.metrics.clear()
    this.startTimes.clear()
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor()

/**
 * React 19 enhanced performance monitoring hook
 */
export function usePerformanceMonitoring(
  componentName: string,
  config?: Partial<PerformanceConfig>
) {
  const renderCount = useRef(0)
  const isMounted = useRef(false)

  // Update config if provided
  useEffect(() => {
    if (config) {
      Object.assign(performanceMonitor['config'], config)
    }
  }, [config])

  // Measure component mount
  useEffect(() => {
    if (!isMounted.current) {
      performanceMonitor.startMeasure(componentName, 'mount')
      isMounted.current = true
      
      return () => {
        performanceMonitor.endMeasure(componentName, 'mount')
      }
    }
  }, [componentName])

  // Measure component updates
  useEffect(() => {
    if (isMounted.current) {
      renderCount.current++
      performanceMonitor.startMeasure(componentName, 'update')
      
      // Use scheduler to measure after paint
      const timeoutId = setTimeout(() => {
        performanceMonitor.endMeasure(componentName, 'update')
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  })

  return {
    renderCount: renderCount.current,
    getMetrics: useCallback(() => performanceMonitor.getMetrics(), []),
    getSlowComponents: useCallback((threshold?: number) => 
      performanceMonitor.getSlowComponents(threshold), []),
    exportMetrics: useCallback(() => performanceMonitor.exportMetrics(), []),
    reset: useCallback(() => performanceMonitor.reset(), [])
  }
}

/**
 * Performance debugging component for development
 */
export function PerformanceDebugger() {
  const { getMetrics, getSlowComponents, reset } = usePerformanceMonitoring('PerformanceDebugger')

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const metrics = getMetrics()
  const slowComponents = getSlowComponents()

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Performance Monitor</h3>
        <button onClick={reset} className="text-red-400 hover:text-red-300">
          Reset
        </button>
      </div>
      
      <div className="space-y-1">
        <div>Components tracked: {metrics.length}</div>
        <div className="text-red-400">
          Slow components: {slowComponents.length}
        </div>
        
        {slowComponents.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-yellow-400">
              Show slow components
            </summary>
            <div className="mt-1 max-h-32 overflow-y-auto">
              {slowComponents.map((metric) => (
                <div key={metric.componentName} className="text-xs">
                  {metric.componentName}: {metric.renderTime.toFixed(1)}ms
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

/**
 * Web Vitals monitoring for React 19
 */
export function useWebVitals() {
  useEffect(() => {
    if ('web-vitals' in window || typeof window === 'undefined') return

    // Dynamic import of web-vitals library with updated API
    import('web-vitals').then((webVitals) => {
      const logMetric = (metric: { name: string; value: number; rating: string }) => {
        if (process.env.NODE_ENV === 'development') {
          const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
          console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(1)} (${metric.rating})`)
        }
      }

      // web-vitals v4+ API
      if (webVitals.onCLS) {
        webVitals.onCLS(logMetric)
        webVitals.onINP?.(logMetric)
        webVitals.onFCP(logMetric)
        webVitals.onLCP(logMetric) 
        webVitals.onTTFB(logMetric)
      } else {
        // Legacy API fallback (removed as these methods don't exist in web-vitals v5+)
        console.warn('Legacy web-vitals API not available in v5+. Use onCLS, onFCP, etc.')
      }
    }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Web Vitals not available:', error.message)
      }
    })
  }, [])
}

/**
 * Memory usage monitoring
 */
export function useMemoryMonitoring(intervalMs = 5000) {
  useEffect(() => {
    if (!('memory' in performance)) return

    const interval = setInterval(() => {
      const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory
      if (memory) {
        const used = Math.round(memory.usedJSHeapSize / 1048576) // MB
        const total = Math.round(memory.totalJSHeapSize / 1048576) // MB
        
        console.log(`Memory usage: ${used}MB / ${total}MB`)
        
        // Warn if memory usage is high
        if (used > 100) {
          console.warn('High memory usage detected:', used + 'MB')
        }
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])
}