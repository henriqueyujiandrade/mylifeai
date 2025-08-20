import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { ThemeCustomizer } from '@/shared/components/ThemeCustomizer'
import { LanguageToggle } from '@/shared/components/LanguageToggle'
import { Footer } from '@/shared/components/Footer'
import { AsyncBoundary } from '@/shared/components/AsyncBoundary'
import { useLanguage } from '@/shared/hooks/useLanguage'
import { usePerformanceMonitoring, useWebVitals, PerformanceDebugger } from '@/shared/hooks/usePerformanceMonitoring.tsx'
import { PerformanceDashboard } from '@/shared/components/PerformanceDashboard'

function RootComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()
  
  // Performance monitoring
  usePerformanceMonitoring('RootComponent')
  useWebVitals()
  
  return (
      <div className="min-h-screen flex flex-col theme-bg-primary">
        <header role="banner">
          <nav className="theme-bg-surface theme-shadow-sm theme-border border-b sticky top-0 z-50" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                {/* Desktop and mobile logo */}
                <div className="flex items-center">
                  <Link 
                    to="/" 
                    className="text-lg sm:text-xl font-bold theme-text-primary hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label={`${t('appName')} - Go to homepage`}
                  >
                    {t('appName')}
                  </Link>
                </div>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  <div className="flex space-x-1" role="menubar">
                    <Link 
                      to="/" 
                      className="theme-text-secondary hover:theme-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors [&.active]:theme-text-primary [&.active]:font-semibold"
                      role="menuitem"
                    >
                      {t('home')}
                    </Link>
                    <Link 
                      to="/about" 
                      className="theme-text-secondary hover:theme-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors [&.active]:theme-text-primary [&.active]:font-semibold"
                      role="menuitem"
                    >
                      {t('about')}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2" role="toolbar" aria-label="Theme and language controls">
                    <LanguageToggle showLabels />
                    <ThemeToggle showLabels />
                    <ThemeCustomizer inline showLabels />
                  </div>
                  <Link 
                    to="/login" 
                    className="theme-button-primary px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    role="menuitem"
                  >
                    {t('signIn')}
                  </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center space-x-2">
                  <LanguageToggle />
                  <ThemeToggle />
                  <ThemeCustomizer inline />
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="theme-text-secondary hover:theme-text-primary p-2 rounded-md transition-colors"
                    aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile menu */}
              {isMobileMenuOpen && (
                <div 
                  id="mobile-menu"
                  className="md:hidden theme-border border-t py-4"
                  role="menu"
                  aria-labelledby="mobile-menu-button"
                >
                  <div className="flex flex-col space-y-3">
                    <Link 
                      to="/" 
                      className="theme-text-secondary hover:theme-text-primary px-3 py-2 rounded-md text-base font-medium transition-colors [&.active]:theme-text-primary [&.active]:font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                    >
                      {t('home')}
                    </Link>
                    <Link 
                      to="/about" 
                      className="theme-text-secondary hover:theme-text-primary px-3 py-2 rounded-md text-base font-medium transition-colors [&.active]:theme-text-primary [&.active]:font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                    >
                      {t('about')}
                    </Link>
                    <Link 
                      to="/login" 
                      className="theme-button-primary px-3 py-2 rounded-md text-base font-medium transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                    >
                      {t('signIn')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </header>
        
        <main role="main" className="flex-1 theme-bg-primary">
          <AsyncBoundary
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="theme-text-secondary">{t('loading')}</p>
                </div>
              </div>
            }
            errorFallback={() => (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8">
                  <div className="text-red-500 text-2xl mb-4">⚠️</div>
                  <h2 className="text-xl font-semibold theme-text-primary mb-2">
                    {t('errorTitle')}
                  </h2>
                  <p className="theme-text-secondary mb-4">
                    {t('errorMessage')}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="theme-button-primary px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {t('tryAgain')}
                  </button>
                </div>
              </div>
            )}
          >
            <Outlet />
          </AsyncBoundary>
        </main>
        
        <Footer />
        
        {/* Performance debugger - only shown in development */}
        <PerformanceDebugger />
        
        {/* Performance dashboard - only shown in development */}
        <PerformanceDashboard />
      </div>
    )
}

export const Route = createRootRoute({
  component: RootComponent,
})