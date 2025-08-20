export type ThemeMode = 'light' | 'dark' | 'system'

export interface ColorPalette {
  primary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  gray: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  success: {
    50: string
    500: string
    700: string
  }
  warning: {
    50: string
    500: string
    700: string
  }
  error: {
    50: string
    500: string
    700: string
  }
}

export interface Typography {
  fontFamily: {
    sans: string
    mono: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  fontWeight: {
    normal: string
    medium: string
    semibold: string
    bold: string
  }
}

export interface Spacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
}

export interface BorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface Theme {
  name: string
  colors: ColorPalette
  typography: Typography
  spacing: Spacing
  borderRadius: BorderRadius
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export interface ThemeContextType {
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'
  theme: Theme
  setMode: (mode: ThemeMode) => void
  setTheme: (theme: Theme) => void
}