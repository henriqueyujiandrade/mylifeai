import { createContext } from 'react'
import type { LanguageContext as ILanguageContext } from '../../shared/types/i18n.types'

export const LanguageContext = createContext<ILanguageContext | undefined>(undefined)