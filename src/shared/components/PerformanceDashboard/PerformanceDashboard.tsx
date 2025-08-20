import { useState, useEffect } from 'react'
import { errorReportingService } from '../../services/errorReporting'

interface PerformanceStats {
  totalErrors: number
  errorsBySeverity: Record<string, number>
  errorsByLevel: Record<string, number>
  recentErrors: Array<{
    error: { name: string; message: string }
    context: { level?: string; timestamp?: string }
    severity: string
  }>
  webVitals: {
    fcp: number | null
    lcp: number | null
    cls: number | null
    ttfb: number | null
  }
  renderMetrics: {
    averageRenderTime: number
    slowRenders: number
    totalRenders: number
  }
}

export function PerformanceDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<PerformanceStats>({
    totalErrors: 0,
    errorsBySeverity: {},
    errorsByLevel: {},
    recentErrors: [],
    webVitals: {
      fcp: null,
      lcp: null,
      cls: null,
      ttfb: null
    },
    renderMetrics: {
      averageRenderTime: 0,
      slowRenders: 0,
      totalRenders: 0
    }
  })

  useEffect(() => {
    if (!isOpen) return

    const updateStats = () => {
      const errorStats = errorReportingService.getErrorStats()
      
      // Get performance metrics from performance observer
      const renderMetrics = getPerformanceMetrics()
      
      setStats({
        totalErrors: errorStats.total,
        errorsBySeverity: errorStats.bySeverity,
        errorsByLevel: errorStats.byLevel,
        recentErrors: errorStats.recent,
        webVitals: getWebVitals(),
        renderMetrics
      })
    }

    updateStats()
    const interval = setInterval(updateStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isOpen])

  const getPerformanceMetrics = () => {
    if (!('performance' in window)) {
      return { averageRenderTime: 0, slowRenders: 0, totalRenders: 0 }
    }

    const measures = performance.getEntriesByType('measure')
    const renderMeasures = measures.filter(m => m.name.includes('React'))
    
    if (renderMeasures.length === 0) {
      return { averageRenderTime: 0, slowRenders: 0, totalRenders: 0 }
    }

    const totalTime = renderMeasures.reduce((sum, measure) => sum + measure.duration, 0)
    const averageRenderTime = totalTime / renderMeasures.length
    const slowRenders = renderMeasures.filter(m => m.duration > 16).length

    return {
      averageRenderTime: Math.round(averageRenderTime * 100) / 100,
      slowRenders,
      totalRenders: renderMeasures.length
    }
  }

  const getWebVitals = () => {
    // This would normally come from the web-vitals library
    // For now, we'll return mock data
    return {
      fcp: 1200,
      lcp: 2100,
      cls: 0.05,
      ttfb: 150
    }
  }

  const getVitalRating = (metric: string, value: number | null): string => {
    if (value === null) return 'unknown'
    
    const thresholds: Record<string, { good: number; poor: number }> = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'unknown'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRatingEmoji = (rating: string): string => {
    switch (rating) {
      case 'good': return '✅'
      case 'needs-improvement': return '⚠️'
      case 'poor': return '❌'
      default: return '⚪'
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle Performance Dashboard"
      >
        📊
      </button>

      {/* Dashboard Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Web Vitals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Web Vitals</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.webVitals).map(([metric, value]) => {
                      const rating = getVitalRating(metric, value)
                      return (
                        <div key={metric} className="flex justify-between items-center">
                          <span className="font-medium">{metric.toUpperCase()}:</span>
                          <span className={`flex items-center gap-1 ${getRatingColor(rating)}`}>
                            {getRatingEmoji(rating)}
                            {value ? `${value}${metric === 'cls' ? '' : 'ms'}` : 'N/A'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Render Performance */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Render Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Render:</span>
                      <span className={stats.renderMetrics.averageRenderTime > 16 ? 'text-red-600' : 'text-green-600'}>
                        {stats.renderMetrics.averageRenderTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slow Renders:</span>
                      <span className={stats.renderMetrics.slowRenders > 0 ? 'text-yellow-600' : 'text-green-600'}>
                        {stats.renderMetrics.slowRenders}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Renders:</span>
                      <span>{stats.renderMetrics.totalRenders}</span>
                    </div>
                  </div>
                </div>

                {/* Error Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Error Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Errors:</span>
                      <span className={stats.totalErrors > 0 ? 'text-red-600' : 'text-green-600'}>
                        {stats.totalErrors}
                      </span>
                    </div>
                    {Object.entries(stats.errorsBySeverity).map(([severity, count]) => (
                      <div key={severity} className="flex justify-between text-sm">
                        <span className="capitalize">{severity}:</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Errors */}
                <div className="md:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Recent Errors</h3>
                  {stats.recentErrors.length === 0 ? (
                    <p className="text-green-600">No recent errors! 🎉</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {stats.recentErrors.map((error, index) => (
                        <div key={index} className="bg-white p-3 rounded border-l-4 border-red-400">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium text-red-600">{error.error.name}</span>
                              <p className="text-sm text-gray-600 mt-1">{error.error.message}</p>
                              <span className="text-xs text-gray-500">
                                {error.context.level} • {error.context.timestamp}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              error.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              error.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {error.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-2 lg:col-span-3 flex gap-4">
                  <button
                    onClick={() => errorReportingService.clearErrors()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Clear Errors
                  </button>
                  <button
                    onClick={() => window.open('/dist/stats.html', '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    View Bundle Analysis
                  </button>
                  <button
                    onClick={() => performance.clearMarks && performance.clearMarks()}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Clear Performance Marks
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}