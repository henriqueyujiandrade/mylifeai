import { forwardRef, InputHTMLAttributes, useMemo, memo } from 'react'
import { cn } from '@/shared/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

// Memoized base classes to prevent recreation
const BASE_INPUT_CLASSES = cn(
  'w-full px-3 py-2 theme-bg-surface theme-border border rounded-md theme-shadow-sm',
  'theme-text-primary placeholder:theme-text-muted',
  'theme-focus-ring transition-colors',
  'disabled:theme-bg-surface-secondary disabled:theme-text-muted'
)

const ERROR_CLASSES = 'border-red-300 focus:ring-red-500 focus:border-red-500'

// Memoized label component to prevent unnecessary re-renders
const InputLabel = memo<{ htmlFor?: string; children: React.ReactNode }>(({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium theme-text-primary">
    {children}
  </label>
))

// Memoized error message component
const ErrorMessage = memo<{ children: React.ReactNode }>(({ children }) => (
  <p className="text-sm text-red-600">{children}</p>
))

// Memoized hint message component
const HintMessage = memo<{ children: React.ReactNode }>(({ children }) => (
  <p className="text-sm theme-text-muted">{children}</p>
))

InputLabel.displayName = 'InputLabel'
ErrorMessage.displayName = 'ErrorMessage'
HintMessage.displayName = 'HintMessage'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    // Memoize input className computation
    const inputClassName = useMemo(() => 
      cn(BASE_INPUT_CLASSES, error && ERROR_CLASSES, className),
      [error, className]
    )

    return (
      <div className="space-y-1">
        {label && <InputLabel htmlFor={props.id}>{label}</InputLabel>}
        <input
          ref={ref}
          className={inputClassName}
          {...props}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {hint && !error && <HintMessage>{hint}</HintMessage>}
      </div>
    )
  }
)

Input.displayName = 'Input'