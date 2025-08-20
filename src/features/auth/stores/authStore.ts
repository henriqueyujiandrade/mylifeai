import { 
  createStore, 
  createActions, 
  useStore, 
  useOptimisticStore,
  advancedPerformanceMiddleware,
  errorBoundaryMiddleware,
  memoryMonitoringMiddleware
} from '@/shared/stores/createStore'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState extends Record<string, unknown> {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Loading states for specific actions
  loginLoading: boolean
  loginError: string | null
  logoutLoading: boolean
  updateProfileLoading: boolean
  updateProfileError: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginLoading: false,
  loginError: null,
  logoutLoading: false,
  updateProfileLoading: false,
  updateProfileError: null,
}

// Create store with persistence and devtools
export const authStore = createStore(initialState, {
  name: 'auth',
  persistKey: 'auth-state',
  devtools: true,
  middleware: [
    // Always include error boundary for stability
    errorBoundaryMiddleware,
    // Add performance monitoring in development
    ...(process.env.NODE_ENV === 'development' ? [
      advancedPerformanceMiddleware,
      memoryMonitoringMiddleware
    ] : [])
  ]
})

// Create typed actions
const { createAsyncAction, createOptimisticAction } = createActions(authStore)

// Auth actions
export const authActions = {
  // Login action with automatic loading states
  login: createAsyncAction(
    'login',
    async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) {
        throw new Error('Invalid credentials')
      }
      
      const { user: userData, token } = await response.json()
      
      // Update auth state on success
      authStore.setState({
        user: userData,
        isAuthenticated: true,
        error: null
      })
      
      // Store token
      localStorage.setItem('auth-token', token)
      
      return userData
    }
  ),

  // Logout action
  logout: createAsyncAction(
    'logout',
    async () => {
      await fetch('/api/auth/logout', { method: 'POST' })
      
      // Clear auth state
      authStore.setState({
        user: null,
        isAuthenticated: false,
        error: null
      })
      
      // Clear token
      localStorage.removeItem('auth-token')
    }
  ),

  // Update profile with optimistic updates
  updateProfile: createOptimisticAction(
    'updateProfile',
    (state, updates: Partial<User>) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }),
    async (updates: Partial<User>) => {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      
      const updatedUser = await response.json()
      
      // Update with server response
      authStore.setState({
        user: updatedUser
      })
      
      return updatedUser
    }
  ),

  // Initialize auth from token
  initializeAuth: createAsyncAction(
    'initialize',
    async () => {
      const token = localStorage.getItem('auth-token')
      if (!token) return null
      
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) {
        localStorage.removeItem('auth-token')
        throw new Error('Invalid token')
      }
      
      const userData = await response.json()
      
      authStore.setState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      })
      
      return userData
    }
  ),

  // Clear error states
  clearError: () => {
    authStore.setState({
      error: null,
      loginError: null,
      updateProfileError: null
    })
  }
}

// Typed selectors for better performance
export const authSelectors = {
  user: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  isLoading: (state: AuthState) => state.isLoading,
  loginState: (state: AuthState) => ({
    isLoading: state.loginLoading,
    error: state.loginError
  }),
  updateProfileState: (state: AuthState) => ({
    isLoading: state.updateProfileLoading,
    error: state.updateProfileError
  })
}

// Custom hooks for components
export function useAuth() {
  const user = useStore(authStore, authSelectors.user)
  const isAuthenticated = useStore(authStore, authSelectors.isAuthenticated)
  const isLoading = useStore(authStore, authSelectors.isLoading)
  
  return {
    user,
    isAuthenticated,
    isLoading,
    ...authActions
  }
}

export function useLoginForm() {
  const loginState = useStore(authStore, authSelectors.loginState)
  
  return {
    ...loginState,
    login: authActions.login,
    clearError: authActions.clearError
  }
}

export function useProfileEditor() {
  const updateState = useStore(authStore, authSelectors.updateProfileState)
  
  // Use optimistic updates for better UX
  const [optimisticUser, updateProfile] = useOptimisticStore(
    authStore,
    authSelectors.user,
    (currentUser, updates: unknown) => 
      currentUser ? { ...currentUser, ...(updates as Partial<User>) } : null
  )
  
  const handleUpdateProfile = async (updates: Partial<User>) => {
    try {
      await updateProfile(updates, () => authActions.updateProfile(updates))
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }
  
  return {
    user: optimisticUser,
    isLoading: updateState.isLoading,
    error: updateState.error,
    updateProfile: handleUpdateProfile,
    clearError: authActions.clearError
  }
}

