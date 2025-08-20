import { memo } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'

interface FooterProps {
  className?: string
}

export const Footer = memo<FooterProps>(({ className }) => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn(
      'theme-bg-surface theme-border border-t mt-auto',
      'py-8 px-4 sm:px-6 lg:px-8',
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <section className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold theme-text-primary">
              {t('appName')}
            </h3>
            <p className="text-sm theme-text-secondary max-w-xs">
              {t('homeSubtitle')}
            </p>
          </section>

          {/* Quick Links */}
          <section className="flex flex-col space-y-3">
            <h4 className="text-base font-medium theme-text-primary">
              Quick Links
            </h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="/" 
                    className="theme-text-secondary hover:theme-text-primary transition-colors"
                  >
                    {t('home')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/about" 
                    className="theme-text-secondary hover:theme-text-primary transition-colors"
                  >
                    {t('about')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/login" 
                    className="theme-text-secondary hover:theme-text-primary transition-colors"
                  >
                    {t('signIn')}
                  </a>
                </li>
              </ul>
            </nav>
          </section>

          {/* Technology */}
          <section className="flex flex-col space-y-3">
            <h4 className="text-base font-medium theme-text-primary">
              Technology
            </h4>
            <ul className="space-y-2 text-sm theme-text-secondary">
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Vite 6</li>
              <li>Tailwind CSS v4</li>
            </ul>
          </section>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 theme-border border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm theme-text-muted">
              © {currentYear} MyLife.AI. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <a 
                href="/privacy" 
                className="theme-text-muted hover:theme-text-secondary transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="theme-text-muted hover:theme-text-secondary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'