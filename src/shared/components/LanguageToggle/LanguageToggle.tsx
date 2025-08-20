import { Languages } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { Language } from '../../types/i18n.types'
import { cn } from '../../utils/cn'
import { memo, useMemo, useCallback } from 'react'

interface LanguageToggleProps {
  className?: string
  showLabels?: boolean
}

// Memoized language configurations to prevent recreation
const LANGUAGES = [
  { value: 'en' as const, label: 'English', flag: '🇺🇸' },
  { value: 'pt-br' as const, label: 'Português', flag: '🇧🇷' },
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

export const LanguageToggle = memo<LanguageToggleProps>(({ className, showLabels = false }) => {
  const { language, setLanguage } = useLanguage()

  // Memoize current language to prevent unnecessary recalculations
  const currentLanguage = useMemo(() => 
    LANGUAGES.find(lang => lang.value === language) || LANGUAGES[0], 
    [language]
  )

  // Memoize the toggle handler to prevent recreation
  const handleToggle = useCallback(() => {
    const currentIndex = LANGUAGES.findIndex(lang => lang.value === language)
    const nextIndex = (currentIndex + 1) % LANGUAGES.length
    setLanguage(LANGUAGES[nextIndex].value)
  }, [language, setLanguage])

  // Memoize the select change handler
  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language)
  }, [setLanguage])

  if (showLabels) {
    // Dropdown style for desktop
    return (
      <div className={cn('relative', className)}>
        <select
          value={language}
          onChange={handleSelectChange}
          className={SELECT_CLASSES}
        >
          {LANGUAGES.map((langOption) => (
            <option key={langOption.value} value={langOption.value}>
              {langOption.flag} {langOption.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none theme-text-muted">
          <Languages className="h-4 w-4" />
        </div>
      </div>
    )
  }

  // Toggle button style for mobile/simple usage
  return (
    <button
      onClick={handleToggle}
      className={cn(BUTTON_CLASSES, className)}
      title={`Current: ${currentLanguage.label}. Click to switch.`}
    >
      <span className="text-sm">{currentLanguage.flag}</span>
    </button>
  )
})

LanguageToggle.displayName = 'LanguageToggle'