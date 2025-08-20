import { ReactNode, useCallback, useMemo } from 'react'
import { Language, TranslationKeys } from '../../shared/types/i18n.types'
import { translations } from '../config/translations'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { LanguageContext } from './LanguageContextDefinition'

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en')

  const t = useCallback((key: keyof TranslationKeys): string => {
    return translations[language][key] || key
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

