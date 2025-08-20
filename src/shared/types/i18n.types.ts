export type Language = 'en' | 'pt-br'

export interface TranslationKeys {
  // Navigation
  home: string
  about: string
  signIn: string
  
  // Theme
  light: string
  dark: string
  system: string
  
  // Common
  loading: string
  error: string
  errorTitle: string
  errorMessage: string
  tryAgain: string
  success: string
  cancel: string
  save: string
  edit: string
  delete: string
  
  // App specific
  appName: string
  welcomeMessage: string
  
  // Home Page
  homeTitle: string
  homeSubtitle: string
  featuresTitle: string
  getStartedTitle: string
  tryLoginForm: string
  learnMore: string
  advancedThemingNote: string
  advancedThemingDescription: string
  modernDevelopmentStack: string
  modernDevelopmentDescription: string
  fast: string
  typeSafe: string
  responsive: string
  themeable: string
  modern: string
  
  // Features list
  react19Features: string
  vite6SwcBuilds: string
  tailwindCss: string
  tanstackRouterQuery: string
  typescriptStrict: string
  vitestTesting: string
  zodReactHookForm: string
  featureBasedArchitecture: string
  fullyResponsiveDesign: string
  advancedThemingSystem: string
  
  // Login Page
  signInToAccount: string
  usernameOrEmail: string
  password: string
  enterUsernameOrEmail: string
  enterPassword: string
  rememberMe: string
  forgotPassword: string
  signingIn: string
  dontHaveAccount: string
  createNewAccount: string
  
  // About Page
  aboutTitle: string
  aboutSubtitle: string
  technologyStack: string
  technologyDescription: string
  frontend: string
  libraries: string
  react19Concurrent: string
  typescriptStrictMode: string
  vite6SwcCompiler: string
  tailwindV4: string
  tanstackRouter: string
  tanstackQuery: string
  reactHookFormZod: string
  lucideReact: string
  advancedThemingSystemTitle: string
  advancedThemingSystemDescription: string
  themeModes: string
  lightMode: string
  darkMode: string
  systemPreference: string
  persistentStorage: string
  customization: string
  multipleColorSchemes: string
  typographyControls: string
  spacingVariations: string
  cssCustomProperties: string
  responsiveDesign: string
  responsiveDesignDescription: string
  mobile: string
  tablet: string
  desktop: string
  keyFeatures: string
  advancedThemingFeature: string
  mobileFirstResponsive: string
  typeSafeDevelopment: string
  modernFormHandling: string
  performanceOptimized: string
  designSystemArchitecture: string
}

export interface LanguageContext {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: keyof TranslationKeys) => string
}