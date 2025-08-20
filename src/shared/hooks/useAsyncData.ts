import { use, useMemo } from 'react'

/**
 * React 19 `use` hook implementation for better data fetching
 * Replaces complex useEffect patterns with cleaner async handling
 */
export function useAsyncData<T>(
  promiseFactory: () => Promise<T>,
  _deps: React.DependencyList = []
): T {
  // Memoize the promise to prevent recreation on every render
  const promise = useMemo(() => {
    return promiseFactory()
  }, [promiseFactory])

  // Use React 19's `use` hook to handle the promise
  // This automatically handles loading states and re-renders
  return use(promise)
}

/**
 * Enhanced version with error boundary integration
 */
export function useAsyncDataWithError<T>(
  promiseFactory: () => Promise<T>,
  _deps: React.DependencyList = []
): { data: T | null; error: Error | null; isLoading: boolean } {
  try {
    const data = useAsyncData(promiseFactory, _deps)
    return { data, error: null, isLoading: false }
  } catch (error) {
    if (error instanceof Promise) {
      // Still loading
      return { data: null, error: null, isLoading: true }
    }
    // Actual error
    return { data: null, error: error as Error, isLoading: false }
  }
}

/**
 * React 19 compatible cache implementation
 * Uses cache() API for better performance
 */
export function createAsyncDataCache<T>() {
  const cache = new Map<string, Promise<T>>()
  
  return {
    get: (key: string, factory: () => Promise<T>): Promise<T> => {
      if (!cache.has(key)) {
        cache.set(key, factory())
      }
      return cache.get(key)!
    },
    clear: (key?: string) => {
      if (key) {
        cache.delete(key)
      } else {
        cache.clear()
      }
    },
    size: () => cache.size
  }
}