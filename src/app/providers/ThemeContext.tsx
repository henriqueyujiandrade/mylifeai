/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react'
import { ThemeMode, ThemeContextType, Theme } from '../../shared/types/theme.types'
import { baseTheme } from '../config/themes'

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>('system')
  const [theme, setTheme] = useState<Theme>(baseTheme)
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light')
  
  // Refs to track previous values and prevent unnecessary updates
  const prevThemeRef = useRef<Theme>(theme)
  const prevResolvedModeRef = useRef<'light' | 'dark'>(resolvedMode)
  const isInitializedRef = useRef(false)

  // Memoized system preference getter
  const getSystemPreference = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }, [])

  // Memoized mode resolver
  const resolveMode = useCallback((currentMode: ThemeMode): 'light' | 'dark' => {
    if (currentMode === 'system') {
      return getSystemPreference()
    }
    return currentMode
  }, [getSystemPreference])

  // Optimized theme application with batched updates and change detection
  const applyTheme = useCallback((currentTheme: Theme, currentResolvedMode: 'light' | 'dark') => {
    const root = document.documentElement
    
    // Check if we actually need to update (prevents unnecessary DOM manipulations)
    const themeChanged = prevThemeRef.current !== currentTheme
    const modeChanged = prevResolvedModeRef.current !== currentResolvedMode
    
    if (!themeChanged && !modeChanged && isInitializedRef.current) {
      return
    }
    
    // Batch DOM updates for better performance
    const updateProperties = () => {
      // Update mode class only if changed
      if (modeChanged || !isInitializedRef.current) {
        root.classList.remove('light', 'dark')
        root.classList.add(currentResolvedMode)
      }
      
      // Update CSS custom properties only if theme changed
      if (themeChanged || !isInitializedRef.current) {
        const { colors, typography, spacing, borderRadius, shadows } = currentTheme
        
        // Optimize color updates by grouping them
        const colorUpdates = [
          ...Object.entries(colors.primary).map(([key, value]) => [`--color-primary-${key}`, value]),
          ...Object.entries(colors.gray).map(([key, value]) => [`--color-gray-${key}`, value]),
          ...Object.entries(colors.success).map(([key, value]) => [`--color-success-${key}`, value]),
          ...Object.entries(colors.warning).map(([key, value]) => [`--color-warning-${key}`, value]),
          ...Object.entries(colors.error).map(([key, value]) => [`--color-error-${key}`, value]),
          ...Object.entries(typography.fontFamily).map(([key, value]) => [`--font-family-${key}`, value]),
          ...Object.entries(typography.fontSize).map(([key, value]) => [`--font-size-${key}`, value]),
          ...Object.entries(typography.fontWeight).map(([key, value]) => [`--font-weight-${key}`, value]),
          ...Object.entries(spacing).map(([key, value]) => [`--spacing-${key}`, value]),
          ...Object.entries(borderRadius).map(([key, value]) => [`--border-radius-${key}`, value]),
          ...Object.entries(shadows).map(([key, value]) => [`--shadow-${key}`, value]),
        ]
        
        // Apply all property updates in a single batch
        colorUpdates.forEach(([property, value]) => {
          root.style.setProperty(property, value)
        })
      }
    }
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      updateProperties()
      
      // Update refs after successful application
      prevThemeRef.current = currentTheme
      prevResolvedModeRef.current = currentResolvedMode
      isInitializedRef.current = true
    })
  }, [])

  // Load saved preferences with error handling and performance optimization
  useEffect(() => {
    const loadSavedPreferences = () => {
      try {
        const savedMode = localStorage.getItem('theme-mode') as ThemeMode
        const savedTheme = localStorage.getItem('theme-config')
        
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setMode(savedMode)
        }
        
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme)
          // Validate theme structure before applying
          if (parsedTheme && typeof parsedTheme === 'object' && parsedTheme.colors && parsedTheme.typography) {
            setTheme(parsedTheme)
          }
        }
      } catch (error) {
        console.warn('Failed to load saved theme preferences:', error)
        // Reset to defaults on error
        localStorage.removeItem('theme-mode')
        localStorage.removeItem('theme-config')
      }
    }
    
    loadSavedPreferences()
  }, [])

  // Optimized system preference listener with cleanup
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (event: MediaQueryListEvent) => {
      if (mode === 'system') {
        const newMode = event.matches ? 'dark' : 'light'
        setResolvedMode(newMode)
      }
    }
    
    // Set initial resolved mode
    const initialResolvedMode = resolveMode(mode)
    setResolvedMode(initialResolvedMode)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode, resolveMode])

  // Apply theme with debouncing and error handling
  useEffect(() => {
    let timeoutId: number
    
    const debouncedApplyTheme = () => {
      clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        try {
          applyTheme(theme, resolvedMode)
        } catch (error) {
          console.error('Failed to apply theme:', error)
        }
      }, 16) // ~60fps debouncing
    }
    
    debouncedApplyTheme()
    
    return () => clearTimeout(timeoutId)
  }, [theme, resolvedMode, applyTheme])

  // Memoized handlers to prevent unnecessary re-renders
  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode)
    try {
      localStorage.setItem('theme-mode', newMode)
    } catch (error) {
      console.warn('Failed to save theme mode:', error)
    }
  }, [])

  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
    try {
      localStorage.setItem('theme-config', JSON.stringify(newTheme))
    } catch (error) {
      console.warn('Failed to save theme config:', error)
    }
  }, [])

  // Memoized context value to prevent unnecessary provider re-renders
  const value: ThemeContextType = useMemo(() => ({
    mode,
    resolvedMode,
    theme,
    setMode: handleSetMode,
    setTheme: handleSetTheme,
  }), [mode, resolvedMode, theme, handleSetMode, handleSetTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}