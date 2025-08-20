import { useContext, useMemo } from 'react'
import { ThemeContext } from '../../app/providers/ThemeContext'

export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  // Memoize theme utilities for better performance
  const themeUtils = useMemo(() => ({
    isDark: context.resolvedMode === 'dark',
    isLight: context.resolvedMode === 'light',
    isSystemMode: context.mode === 'system',
    toggleMode: () => {
      const newMode = context.resolvedMode === 'light' ? 'dark' : 'light'
      context.setMode(newMode)
    },
    setSystemMode: () => context.setMode('system'),
  }), [context])
  
  return {
    ...context,
    ...themeUtils,
  }
}