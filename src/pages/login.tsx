import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { useSEO } from '@/shared/hooks/useSEO'
import type { LoginFormData } from '@/entities/auth/login.schema'

// Lazy load the LoginForm component for better code splitting
const LoginForm = lazy(() => 
  import('@/features/auth/components/LoginForm').then(module => ({
    default: module.LoginForm
  }))
)

// Loading component for better UX
const LoginFormSkeleton = () => (
  <div className="w-full max-w-md mx-auto px-4 sm:px-0">
    <div className="theme-bg-surface py-6 sm:py-8 px-4 sm:px-6 lg:px-10 theme-shadow-sm sm:theme-shadow rounded-lg">
      <div className="animate-pulse">
        <div className="h-8 theme-bg-surface-secondary rounded mb-6"></div>
        <div className="space-y-6">
          <div className="h-12 theme-bg-surface-secondary rounded"></div>
          <div className="h-12 theme-bg-surface-secondary rounded"></div>
          <div className="h-12 theme-bg-surface-secondary rounded"></div>
        </div>
      </div>
    </div>
  </div>
)

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  useSEO('/login')
  
  const handleLogin = async (data: LoginFormData) => {
    // TODO: Implement actual login logic with API call
    console.log('Login attempt:', data)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For now, just show success message
    alert(`Login attempt with: ${data.emailOrUsername}`)
  }

  return (
    <div className="flex items-center justify-center theme-bg-primary py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <main role="main" className="w-full">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm onSubmit={handleLogin} />
        </Suspense>
      </main>
    </div>
  )
}