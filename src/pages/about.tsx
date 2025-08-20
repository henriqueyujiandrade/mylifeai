import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '@/shared/hooks/useLanguage'
import { useSEO } from '@/shared/hooks/useSEO'

function AboutPage() {
  const { t } = useLanguage()
  useSEO('/about')
  
  return (
    <div className="theme-bg-primary">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold theme-text-primary mb-4">
            {t('aboutTitle')}
          </h1>
          <p className="text-lg sm:text-xl theme-text-secondary max-w-2xl mx-auto">
            {t('aboutSubtitle')}
          </p>
        </header>

        {/* Main Content */}
        <article className="theme-bg-surface rounded-lg theme-shadow-sm p-6 sm:p-8 lg:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Technology Stack Section */}
            <section aria-labelledby="tech-stack">
              <h2 id="tech-stack" className="text-xl sm:text-2xl font-semibold theme-text-primary mb-4">
                {t('technologyStack')}
              </h2>
              <p className="theme-text-secondary mb-6">
                {t('technologyDescription')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                <h3 className="text-lg font-semibold theme-text-primary mb-3">{t('frontend')}</h3>
                <ul className="space-y-2 theme-text-secondary">
                  <li>• {t('react19Concurrent')}</li>
                  <li>• {t('typescriptStrictMode')}</li>
                  <li>• {t('vite6SwcCompiler')}</li>
                  <li>• {t('tailwindV4')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold theme-text-primary mb-3">{t('libraries')}</h3>
                <ul className="space-y-2 theme-text-secondary">
                  <li>• {t('tanstackRouter')}</li>
                  <li>• {t('tanstackQuery')}</li>
                  <li>• {t('reactHookFormZod')}</li>
                  <li>• {t('lucideReact')}</li>
                </ul>
              </div>
              </div>
            </section>

            {/* Advanced Theming Section */}
            <section aria-labelledby="theming-system">
              <h2 id="theming-system" className="text-xl sm:text-2xl font-semibold theme-text-primary mb-4">
                {t('advancedThemingSystemTitle')}
              </h2>
            <p className="theme-text-secondary mb-6">
              {t('advancedThemingSystemDescription')}
            </p>
            
            <div className="theme-bg-surface-secondary p-4 sm:p-6 rounded-lg mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold theme-text-primary mb-3">{t('themeModes')}</h4>
                  <ul className="space-y-1 theme-text-secondary text-sm">
                    <li>• {t('lightMode')}</li>
                    <li>• {t('darkMode')}</li>
                    <li>• {t('systemPreference')}</li>
                    <li>• {t('persistentStorage')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold theme-text-primary mb-3">{t('customization')}</h4>
                  <ul className="space-y-1 theme-text-secondary text-sm">
                    <li>• {t('multipleColorSchemes')}</li>
                    <li>• {t('typographyControls')}</li>
                    <li>• {t('spacingVariations')}</li>
                    <li>• {t('cssCustomProperties')}</li>
                  </ul>
                </div>
              </div>
            </div>
            </section>

            {/* Responsive Design Section */}
            <section aria-labelledby="responsive-design">
              <h2 id="responsive-design" className="text-xl sm:text-2xl font-semibold theme-text-primary mb-4">
                {t('responsiveDesign')}
              </h2>
            <p className="theme-text-secondary mb-6">
              {t('responsiveDesignDescription')}
            </p>
            
            <div className="theme-bg-surface-secondary p-4 sm:p-6 rounded-lg mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-semibold theme-text-primary">{t('mobile')}</div>
                  <div className="text-sm theme-text-muted">&lt; 640px</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-semibold theme-text-primary">{t('tablet')}</div>
                  <div className="text-sm theme-text-muted">640px - 1024px</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🖥️</div>
                  <div className="font-semibold theme-text-primary">{t('desktop')}</div>
                  <div className="text-sm theme-text-muted">&gt; 1024px</div>
                </div>
              </div>
            </div>
            </section>

            {/* Key Features Section */}
            <section aria-labelledby="key-features">
              <h2 id="key-features" className="text-xl sm:text-2xl font-semibold theme-text-primary mb-4">
                {t('keyFeatures')}
              </h2>
            <ul className="space-y-3 theme-text-secondary">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span><strong>{t('advancedThemingFeature')}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span><strong>{t('mobileFirstResponsive')}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span><strong>{t('typeSafeDevelopment')}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span><strong>{t('modernFormHandling')}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span><strong>{t('performanceOptimized')}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✅</span>
                <span><strong>{t('designSystemArchitecture')}</strong></span>
              </li>
            </ul>
            </section>
          </div>
        </article>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/about')({
  component: AboutPage,
})