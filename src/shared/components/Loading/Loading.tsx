import { memo } from 'react'
import { cn } from '@/shared/utils/cn'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

// Optimized spinner component with memoization
export const Spinner = memo<LoadingProps>(({ 
  size = 'md', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  } as const

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-sm theme-text-secondary animate-pulse">
          {text}
        </span>
      )}
    </div>
  )
})

// Skeleton loading component for content placeholders
export const Skeleton = memo<SkeletonProps>(({ 
  className,
  variant = 'rectangular' 
}) => {
  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-12',
    circular: 'rounded-full aspect-square'
  } as const

  return (
    <div 
      className={cn(
        'animate-pulse theme-bg-surface-secondary rounded',
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading content"
    />
  )
})

Spinner.displayName = 'Spinner'
Skeleton.displayName = 'Skeleton'