import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import { useLanguage } from '@/shared/hooks/useLanguage'
import { loginSchema, type LoginFormData } from '../../../../entities/auth/login.schema'

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>
  isLoading?: boolean
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useLanguage()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit?.(data)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const isSubmittingForm = isSubmitting || isLoading

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="theme-bg-surface py-6 sm:py-8 px-4 sm:px-6 lg:px-10 theme-shadow-sm sm:theme-shadow rounded-lg">
        <div className="mb-6">
          <h2 className="text-center text-2xl sm:text-3xl font-bold theme-text-primary">
            {t('signInToAccount')}
          </h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <Input
            {...register('emailOrUsername')}
            id="emailOrUsername"
            label={t('usernameOrEmail')}
            type="text"
            autoComplete="username"
            placeholder={t('enterUsernameOrEmail')}
            error={errors.emailOrUsername?.message}
            disabled={isSubmittingForm}
          />

          <div className="relative">
            <Input
              {...register('password')}
              id="password"
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t('enterPassword')}
              error={errors.password?.message}
              disabled={isSubmittingForm}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmittingForm}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 theme-text-muted hover:theme-text-secondary" />
              ) : (
                <Eye className="h-4 w-4 theme-text-muted hover:theme-text-secondary" />
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 theme-border rounded"
                disabled={isSubmittingForm}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm theme-text-secondary">
                {t('rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                {t('forgotPassword')}
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? t('signingIn') : t('signIn')}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t theme-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 theme-bg-surface theme-text-muted">{t('dontHaveAccount')}</span>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="#"
              className="w-full flex justify-center py-2 px-4 theme-border border rounded-md theme-shadow-sm text-sm font-medium theme-text-secondary theme-bg-surface hover:theme-bg-surface-secondary theme-focus-ring"
            >
              {t('createNewAccount')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}