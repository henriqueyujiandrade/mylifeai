import { useContext } from 'react'
import { LanguageContext } from '../../app/providers/LanguageContextDefinition'
import type { LanguageContext as ILanguageContext } from '../types/i18n.types'

export function useLanguage(): ILanguageContext {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}