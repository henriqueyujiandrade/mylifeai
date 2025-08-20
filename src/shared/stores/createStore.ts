import { useSyncExternalStore, useCallback, useMemo } from 'react'
import { useOptimistic, startTransition } from 'react'

/**
 * React 19 optimized store implementation
 * Uses useSyncExternalStore for better performance and consistency
 */
type Listener = () => void
type Selector<T, R> = (state: T) => R

export interface Store<T> {
  getState: () => T
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void
  subscribe: (listener: Listener) => () => void
  destroy: () => void
}

interface StoreOptions<T> {
  name?: string
  persistKey?: string
  devtools?: boolean
  middleware?: Array<(store: Store<T>) => Store<T>>
}

export function createStore<T extends Record<string, unknown> = Record<string, unknown>>(
  initialState: T,
  options: StoreOptions<T> = {}
): Store<T> {
  let state = initialState
  const listeners = new Set<Listener>()
  const { name = 'store', persistKey, devtools = process.env.NODE_ENV === 'development' } = options

  // Load persisted state
  if (persistKey && typeof window !== 'undefined') {
    try {
      const persisted = localStorage.getItem(persistKey)
      if (persisted) {
        state = { ...state, ...JSON.parse(persisted) }
      }
    } catch (error) {
      console.warn(`Failed to load persisted state for ${name}:`, error)
    }
  }

  const getState = () => state

  const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial
    const newState = { ...state, ...nextState }
    
    // Only update if state actually changed
    if (!shallowEqual(state, newState)) {
      const prevState = state
      state = newState
      
      // Persist state
      if (persistKey && typeof window !== 'undefined') {
        try {
          localStorage.setItem(persistKey, JSON.stringify(state))
        } catch (error) {
          console.warn(`Failed to persist state for ${name}:`, error)
        }
      }

      // Notify listeners
      listeners.forEach((listener) => listener())

      // DevTools integration
      if (devtools && typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).__REDUX_DEVTOOLS_EXTENSION__) {
        const devtools = ((window as unknown as Record<string, unknown>).__REDUX_DEVTOOLS_EXTENSION__ as { connect: (config: { name: string }) => { send: (action: string, data: unknown) => void } }).connect({ name })
        devtools.send(`setState`, { prevState, newState, partial })
      }
    }
  }

  const subscribe = (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const destroy = () => {
    listeners.clear()
    if (persistKey && typeof window !== 'undefined') {
      localStorage.removeItem(persistKey)
    }
  }

  let store: Store<T> = { getState, setState, subscribe, destroy }

  // Apply middleware
  if (options.middleware) {
    store = options.middleware.reduce((acc, middleware) => middleware(acc), store)
  }

  return store
}

/**
 * React 19 optimized hook for consuming store state
 */
export function useStore<T, R>(
  store: Store<T>,
  selector: Selector<T, R> = (state) => state as unknown as R
): R {
  const selectedState = useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()) // SSR fallback
  )

  // Memoize the selected state to prevent unnecessary re-renders
  return useMemo(() => selectedState, [selectedState])
}

/**
 * Optimistic updates hook for React 19
 */
export function useOptimisticStore<T, R>(
  store: Store<T>,
  selector: Selector<T, R>,
  optimisticFn: (state: R, optimisticValue: unknown) => R
) {
  const currentState = useStore(store, selector)
  const [optimisticState, setOptimisticState] = useOptimistic(
    currentState,
    optimisticFn
  )

  const mutate = useCallback((optimisticValue: unknown, asyncFn: () => Promise<void>) => {
    startTransition(() => {
      setOptimisticState(optimisticValue)
    })

    return asyncFn().catch((error) => {
      // Optimistic update will automatically revert on error
      throw error
    })
  }, [setOptimisticState])

  return [optimisticState, mutate] as const
}

/**
 * Store actions with automatic loading states
 */
export function createActions<T extends Record<string, unknown> = Record<string, unknown>>(store: Store<T>) {
  const createAsyncAction = <Args extends unknown[], Result>(
    name: string,
    asyncFn: (...args: Args) => Promise<Result>
  ) => {
    return async (...args: Args): Promise<Result> => {
      const loadingKey = `${name}Loading` as keyof T
      const errorKey = `${name}Error` as keyof T

      try {
        store.setState({ [loadingKey]: true, [errorKey]: null } as Partial<T>)
        const result = await asyncFn(...args)
        store.setState({ [loadingKey]: false } as Partial<T>)
        return result
      } catch (error) {
        store.setState({ 
          [loadingKey]: false, 
          [errorKey]: error 
        } as Partial<T>)
        throw error
      }
    }
  }

  const createOptimisticAction = <Args extends unknown[], Result>(
    _name: string,
    optimisticUpdate: (state: T, ...args: Args) => Partial<T>,
    asyncFn: (...args: Args) => Promise<Result>
  ) => {
    return async (...args: Args): Promise<Result> => {
      const currentState = store.getState()
      
      // Apply optimistic update
      startTransition(() => {
        store.setState(optimisticUpdate(currentState, ...args))
      })

      try {
        const result = await asyncFn(...args)
        return result
      } catch (error) {
        // Revert optimistic update
        store.setState(currentState)
        throw error
      }
    }
  }

  return { createAsyncAction, createOptimisticAction }
}

/**
 * Middleware for logging state changes
 */
export function loggerMiddleware<T>(store: Store<T>): Store<T> {
  const originalSetState = store.setState

  return {
    ...store,
    setState: (partial) => {
      const prevState = store.getState()
      originalSetState(partial)
      const nextState = store.getState()
      
      console.group('🏪 Store Update')
      console.log('Previous:', prevState)
      console.log('Update:', partial)
      console.log('Next:', nextState)
      console.groupEnd()
    }
  }
}

/**
 * Middleware for performance monitoring
 */
export function performanceMiddleware<T>(store: Store<T>): Store<T> {
  const originalSetState = store.setState

  return {
    ...store,
    setState: (partial) => {
      const start = performance.now()
      originalSetState(partial)
      const end = performance.now()
      
      if (end - start > 1) {
        console.warn(`Slow store update: ${(end - start).toFixed(2)}ms`)
      }
    }
  }
}

// Export advanced middleware
export {
  advancedPerformanceMiddleware,
  memoryMonitoringMiddleware,
  concurrentMiddleware,
  errorBoundaryMiddleware,
  batchingMiddleware,
  advancedPersistenceMiddleware
} from './middleware'

/**
 * Utility function for shallow equality comparison
 */
function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true
  
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false
    }
  }

  return true
}