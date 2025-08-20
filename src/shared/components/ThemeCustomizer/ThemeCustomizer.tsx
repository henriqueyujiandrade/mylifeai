import { useState } from 'react'
import { Palette, Settings, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { availableThemes } from '../../../app/config/themes'
import { cn } from '../../utils/cn'

interface ThemeCustomizerProps {
  inline?: boolean
  showLabels?: boolean
}

export const ThemeCustomizer = ({ inline = false, showLabels = false }: ThemeCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          inline 
            ? 'theme-text-secondary hover:theme-text-primary p-2 rounded-md transition-colors theme-focus-ring'
            : 'fixed bottom-4 right-4 z-50 theme-bg-surface theme-text-primary theme-border p-3 rounded-full border theme-shadow-lg hover:theme-bg-surface-secondary transition-all theme-focus-ring'
        )}
        title="Customize Theme"
      >
        <Palette className={cn(inline ? "h-4 w-4" : "h-5 w-5")} />
        {showLabels && inline && (
          <span className="ml-1 text-sm hidden lg:inline">Themes</span>
        )}
      </button>

      {/* Customizer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className={cn(
            'relative w-full max-w-md',
            'theme-bg-surface theme-border',
            'rounded-lg border theme-shadow-xl',
            'max-h-[80vh] overflow-y-auto'
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 theme-border border-b">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 theme-text-primary" />
                <h2 className="text-lg font-semibold theme-text-primary">
                  Theme Customizer
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  'p-1 rounded theme-text-muted',
                  'hover:theme-bg-surface-secondary theme-focus-ring'
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Current Theme Info */}
              <div>
                <h3 className="text-sm font-medium theme-text-primary mb-2">
                  Current Theme
                </h3>
                <div className={cn(
                  'p-3 rounded theme-bg-surface-secondary theme-border border'
                )}>
                  <p className="text-sm theme-text-primary font-medium">
                    {theme.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {/* Primary color preview */}
                    <div 
                      className="w-6 h-6 rounded border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.primary[500] }}
                    />
                    <div 
                      className="w-6 h-6 rounded border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.primary[600] }}
                    />
                    <div 
                      className="w-6 h-6 rounded border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.primary[700] }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Presets */}
              <div>
                <h3 className="text-sm font-medium theme-text-primary mb-3">
                  Theme Presets
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {availableThemes.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setTheme(preset)}
                      className={cn(
                        'p-3 rounded border text-left transition-all',
                        'hover:theme-bg-surface-secondary theme-focus-ring',
                        theme.name === preset.name
                          ? 'theme-border border-2'
                          : 'theme-border border'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium theme-text-primary">
                            {preset.name}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div 
                              className="w-4 h-4 rounded border border-white/20"
                              style={{ backgroundColor: preset.colors.primary[500] }}
                            />
                            <div 
                              className="w-4 h-4 rounded border border-white/20"
                              style={{ backgroundColor: preset.colors.primary[600] }}
                            />
                            <div 
                              className="w-4 h-4 rounded border border-white/20"
                              style={{ backgroundColor: preset.colors.primary[700] }}
                            />
                          </div>
                        </div>
                        {theme.name === preset.name && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Info */}
              <div>
                <h3 className="text-sm font-medium theme-text-primary mb-2">
                  Typography
                </h3>
                <div className={cn(
                  'p-3 rounded theme-bg-surface-secondary theme-border border'
                )}>
                  <p className="text-xs theme-text-secondary">Font Family</p>
                  <p className="text-sm theme-text-primary" style={{ fontFamily: theme.typography.fontFamily.sans }}>
                    {theme.typography.fontFamily.sans.split(',')[0].replace(/"/g, '')}
                  </p>
                  
                  <div className="mt-3 space-y-1">
                    <p className="text-xs theme-text-secondary">Size Examples</p>
                    <p style={{ fontSize: theme.typography.fontSize.sm }} className="theme-text-primary">
                      Small text ({theme.typography.fontSize.sm})
                    </p>
                    <p style={{ fontSize: theme.typography.fontSize.base }} className="theme-text-primary">
                      Base text ({theme.typography.fontSize.base})
                    </p>
                    <p style={{ fontSize: theme.typography.fontSize.lg }} className="theme-text-primary">
                      Large text ({theme.typography.fontSize.lg})
                    </p>
                  </div>
                </div>
              </div>

              {/* Spacing Info */}
              <div>
                <h3 className="text-sm font-medium theme-text-primary mb-2">
                  Spacing Scale
                </h3>
                <div className={cn(
                  'p-3 rounded theme-bg-surface-secondary theme-border border'
                )}>
                  <div className="space-y-2">
                    {Object.entries(theme.spacing).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div 
                          className="bg-blue-500 h-4"
                          style={{ width: value }}
                        />
                        <span className="text-xs theme-text-secondary min-w-0">
                          {key}: {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}