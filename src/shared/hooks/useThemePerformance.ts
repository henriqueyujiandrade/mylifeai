import { useEffect, useRef } from 'react'
import { useTheme } from './useTheme'

interface PerformanceMetrics {
  themeChangeCount: number
  averageApplyTime: number
  lastApplyTime: number
  totalApplyTime: number
}

export const useThemePerformance = (enableLogging = false) => {
  const { theme, resolvedMode } = useTheme()
  const metricsRef = useRef<PerformanceMetrics>({
    themeChangeCount: 0,
    averageApplyTime: 0,
    lastApplyTime: 0,
    totalApplyTime: 0,
  })
  
  const startTimeRef = useRef<number>(0)
  const prevThemeRef = useRef(theme)
  const prevModeRef = useRef(resolvedMode)

  useEffect(() => {
    // Start timing when theme or mode changes
    const themeChanged = prevThemeRef.current !== theme
    const modeChanged = prevModeRef.current !== resolvedMode
    
    if (themeChanged || modeChanged) {
      startTimeRef.current = performance.now()
      
      // Use requestAnimationFrame to measure after theme application
      requestAnimationFrame(() => {
        const endTime = performance.now()
        const applyTime = endTime - startTimeRef.current
        
        const metrics = metricsRef.current
        metrics.themeChangeCount += 1
        metrics.lastApplyTime = applyTime
        metrics.totalApplyTime += applyTime
        metrics.averageApplyTime = metrics.totalApplyTime / metrics.themeChangeCount
        
        if (enableLogging) {
          console.group('🎨 Theme Performance Metrics')
          console.log(`Theme apply time: ${applyTime.toFixed(2)}ms`)
          console.log(`Average apply time: ${metrics.averageApplyTime.toFixed(2)}ms`)
          console.log(`Total theme changes: ${metrics.themeChangeCount}`)
          console.log(`Theme changed: ${themeChanged}`)
          console.log(`Mode changed: ${modeChanged}`)
          console.groupEnd()
        }
        
        // Warning for slow theme applications
        if (applyTime > 50 && enableLogging) {
          console.warn(`⚠️ Slow theme application detected: ${applyTime.toFixed(2)}ms`)
        }
      })
      
      prevThemeRef.current = theme
      prevModeRef.current = resolvedMode
    }
  }, [theme, resolvedMode, enableLogging])

  return metricsRef.current
}