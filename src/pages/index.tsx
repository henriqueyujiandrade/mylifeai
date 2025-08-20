import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/shared/components/Button'
import { useLanguage } from '@/shared/hooks/useLanguage'
import { useSEO } from '@/shared/hooks/useSEO'

function HomePage() {
  const { t } = useLanguage()
  useSEO('/')
  
  return (
    <div className="theme-bg-primary">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-12 lg:mb-16" aria-labelledby="hero-title">
          <h1 id="hero-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold theme-text-primary mb-4">
            {t('homeTitle')}
          </h1>
          <p className="text-lg sm:text-xl theme-text-secondary max-w-3xl mx-auto">
            {t('homeSubtitle')}
          </p>
        </section>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Features Section */}
          <section className="theme-bg-surface p-6 sm:p-8 rounded-lg theme-shadow-sm hover:theme-shadow-md transition-shadow" aria-labelledby="features-title">
            <h2 id="features-title" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 theme-text-primary">
              {t('featuresTitle')}
            </h2>
            <ul className="space-y-3 theme-text-secondary">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('react19Features')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('vite6SwcBuilds')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('tailwindCss')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('tanstackRouterQuery')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('typescriptStrict')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('vitestTesting')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('zodReactHookForm')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('featureBasedArchitecture')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span>{t('fullyResponsiveDesign')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span><strong>{t('advancedThemingSystem')}</strong></span>
              </li>
            </ul>
          </section>
          
          {/* Get Started Section */}
          <section className="theme-bg-surface p-6 sm:p-8 rounded-lg theme-shadow-sm hover:theme-shadow-md transition-shadow" aria-labelledby="get-started-title">
            <h2 id="get-started-title" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 theme-text-primary">
              {t('getStartedTitle')}
            </h2>
            <div className="space-y-4">
              <Link to="/login">
                <Button variant="primary" size="lg" className="w-full">
                  {t('tryLoginForm')}
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg" className="w-full">
                  {t('learnMore')}
                </Button>
              </Link>
            </div>
            <div className="mt-6 p-4 theme-bg-surface-secondary rounded-lg">
              <p className="text-sm theme-text-primary">
                <strong>🎨 {t('advancedThemingNote')}</strong>
              </p>
            </div>
            <div className="mt-4 text-sm theme-text-secondary">
              <p>
                {t('advancedThemingDescription')}
              </p>
            </div>
          </section>
        </div>

        {/* Technology Stack Section */}
        <section className="mt-12 sm:mt-16 lg:mt-20" aria-labelledby="tech-stack-title">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 lg:p-12 text-white theme-shadow-lg">
            <div className="text-center">
              <h3 id="tech-stack-title" className="text-2xl sm:text-3xl font-bold mb-4">
                {t('modernDevelopmentStack')}
              </h3>
              <p className="text-blue-100 text-lg mb-6 sm:mb-8 max-w-3xl mx-auto">
                {t('modernDevelopmentDescription')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">⚡</div>
                  <div className="text-sm sm:text-base">{t('fast')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">🛡️</div>
                  <div className="text-sm sm:text-base">{t('typeSafe')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">📱</div>
                  <div className="text-sm sm:text-base">{t('responsive')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">🎨</div>
                  <div className="text-sm sm:text-base">{t('themeable')}</div>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl sm:text-3xl font-bold">✨</div>
                  <div className="text-sm sm:text-base">{t('modern')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})