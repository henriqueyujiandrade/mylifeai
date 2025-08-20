import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import { ThemeMode } from '../../types/theme.types'
import { cn } from '../../utils/cn'
import { memo, useMemo, useCallback } from 'react'

interface ThemeToggleProps {
  className?: string
  showLabels?: boolean
}

// Theme mode configurations
const getThemeModes = (t: (key: keyof import('../../types/i18n.types').TranslationKeys) => string) => [
  { value: 'light' as const, label: t('light'), icon: <Sun className="h-4 w-4" /> },
  { value: 'dark' as const, label: t('dark'), icon: <Moon className="h-4 w-4" /> },
  { value: 'system' as const, label: t('system'), icon: <Monitor className="h-4 w-4" /> },
] as const

// Memoized styles to prevent recreation
const SELECT_CLASSES = cn(
  'theme-bg-surface theme-text-primary theme-border',
  'px-3 py-2 pr-8 rounded-lg text-sm font-medium',
  'border focus:outline-none theme-focus-ring',
  'cursor-pointer appearance-none'
)

const BUTTON_CLASSES = cn(
  'theme-bg-surface theme-text-primary theme-border',
  'p-2 rounded-lg border theme-focus-ring',
  'hover:theme-bg-surface-secondary transition-colors',
  'flex items-center justify-center'
)

export const ThemeToggle = memo<ThemeToggleProps>(({ className, showLabels = false }) => {
  const { mode, setMode } = useTheme()
  const { t } = useLanguage()

  // Memoize theme modes with translations
  const THEME_MODES = useMemo(() => getThemeModes(t), [t])

  // Memoize current mode to prevent unnecessary recalculations
  const currentMode = useMemo(() => 
    THEME_MODES.find(m => m.value === mode) || THEME_MODES[0], 
    [mode, THEME_MODES]
  )

  // Memoize the toggle handler to prevent recreation
  const handleToggle = useCallback(() => {
    const currentIndex = THEME_MODES.findIndex(m => m.value === mode)
    const nextIndex = (currentIndex + 1) % THEME_MODES.length
    setMode(THEME_MODES[nextIndex].value)
  }, [mode, setMode, THEME_MODES])

  // Memoize the select change handler
  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as ThemeMode)
  }, [setMode])

  if (showLabels) {
    // Dropdown style for desktop
    return (
      <div className={cn('relative', className)}>
        <select
          value={mode}
          onChange={handleSelectChange}
          className={SELECT_CLASSES}
        >
          {THEME_MODES.map((modeOption) => (
            <option key={modeOption.value} value={modeOption.value}>
              {modeOption.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none theme-text-muted">
          {currentMode.icon}
        </div>
      </div>
    )
  }

  // Toggle button style for mobile/simple usage
  return (
    <button
      onClick={handleToggle}
      className={cn(BUTTON_CLASSES, className)}
      title={`Current: ${currentMode.label}. Click to switch.`}
    >
      {currentMode.icon}
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'