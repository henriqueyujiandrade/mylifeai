import { ButtonHTMLAttributes, memo, useMemo } from 'react'
import { cn } from '@/shared/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

// Memoized style objects to prevent recreation on every render
const BASE_CLASSES = 'font-medium rounded-lg transition-all duration-200 theme-focus-ring disabled:opacity-50 disabled:cursor-not-allowed'

const VARIANT_CLASSES = {
  primary: 'theme-button-primary theme-shadow-sm hover:theme-shadow-md',
  secondary: 'theme-bg-surface-secondary hover:theme-bg-surface theme-text-primary theme-border border'
} as const

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-sm sm:text-base min-h-[40px]',
  lg: 'px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg min-h-[44px] sm:min-h-[48px]'
} as const

export const Button = memo<ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  className = '',
  children,
  ...props 
}) => {
  // Memoize className computation to avoid recalculation
  const buttonClassName = useMemo(() => 
    cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className),
    [variant, size, className]
  )
  
  return (
    <button 
      className={buttonClassName} 
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'