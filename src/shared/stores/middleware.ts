import type { Store } from './createStore'

/**
 * Advanced performance monitoring middleware for React 19
 */
export function advancedPerformanceMiddleware<T>(store: Store<T>): Store<T> {
  const originalSetState = store.setState
  const updateTimes: number[] = []
  let totalUpdates = 0

  return {
    ...store,
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
      const start = performance.now()
      originalSetState(partial)
      const end = performance.now()
      
      const updateTime = end - start
      updateTimes.push(updateTime)
      totalUpdates++
      
      // Keep only last 100 measurements
      if (updateTimes.length > 100) {
        updateTimes.shift()
      }
      
      // Log performance issues
      if (updateTime > 5) {
        console.warn(`🐌 Slow store update: ${updateTime.toFixed(2)}ms`)
      }
      
      // Log performance stats every 50 updates
      if (totalUpdates % 50 === 0) {
        const avgTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length
        const maxTime = Math.max(...updateTimes)
        
        console.group('📊 Store Performance Stats')
        console.log(`Average update time: ${avgTime.toFixed(2)}ms`)
        console.log(`Max update time: ${maxTime.toFixed(2)}ms`)
        console.log(`Total updates: ${totalUpdates}`)
        console.groupEnd()
      }
    }
  }
}

/**
 * Memory monitoring middleware
 */
export function memoryMonitoringMiddleware<T>(store: Store<T>): Store<T> {
  const originalSetState = store.setState
  let stateSize = 0

  const calculateSize = (obj: unknown): number => {
    return JSON.stringify(obj).length
  }

  return {
    ...store,
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
      originalSetState(partial)
      
      const newStateSize = calculateSize(store.getState())
      const sizeDiff = newStateSize - stateSize
      stateSize = newStateSize
      
      if (sizeDiff > 1000) {
        console.warn(`📈 Large state growth: +${sizeDiff} bytes (total: ${stateSize} bytes)`)
      }
      
      if (stateSize > 100000) {
        console.warn(`🚨 Large state detected: ${(stateSize / 1000).toFixed(1)}KB`)
      }
    }
  }
}

/**
 * React 19 concurrent features middleware
 */
export function concurrentMiddleware<T>(store: Store<T>): Store<T> {
  const originalSetState = store.setState

  return {
    ...store,
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
      // Use scheduler.postTask if available (React 19 feature)
      if ('scheduler' in window && 'postTask' in ((window as unknown as Record<string, unknown>).scheduler as Record<string, unknown>)) {
        ((window as unknown as Record<string, unknown>).scheduler as { postTask: (callback: () => void, options: { priority: string }) => void }).postTask(() => {
          originalSetState(partial)
        }, { priority: 'user-blocking' })
      } else {
        // Fallback to immediate update
        originalSetState(partial)
      }
    }
  }
}

/**
 * Error boundary middleware
 */
export function errorBoundaryMiddleware<T>(store: Store<T>): Store<T> {
  const originalSetState = store.setState

  return {
    ...store,
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
      try {
        originalSetState(partial)
      } catch (error) {
        console.error('🚨 Store update error:', error)
        
        // Try to recover with previous state
        try {
          originalSetState({} as Partial<T>)
        } catch (recoveryError) {
          console.error('🚨 Failed to recover store state:', recoveryError)
        }
        
        throw error
      }
    }
  }
}

/**
 * Batch updates middleware for better performance
 */
export function batchingMiddleware<T>(store: Store<T>): Store<T> {
  const originalSetState = store.setState
  let pendingUpdates: Partial<T>[] = []
  let updateScheduled = false

  const flushUpdates = () => {
    if (pendingUpdates.length === 0) return
    
    // Merge all pending updates
    const mergedUpdate = pendingUpdates.reduce((acc, update) => ({ ...acc, ...update }), {} as Partial<T>)
    pendingUpdates = []
    updateScheduled = false
    
    originalSetState(mergedUpdate)
  }

  return {
    ...store,
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
      const update = typeof partial === 'function' ? partial(store.getState()) : partial
      pendingUpdates.push(update)
      
      if (!updateScheduled) {
        updateScheduled = true
        // Use React 19's scheduler if available
        if ('scheduler' in window && 'postTask' in ((window as unknown as Record<string, unknown>).scheduler as Record<string, unknown>)) {
          ((window as unknown as Record<string, unknown>).scheduler as { postTask: (callback: () => void, options: { priority: string }) => void }).postTask(flushUpdates, { priority: 'user-blocking' })
        } else {
          queueMicrotask(flushUpdates)
        }
      }
    }
  }
}

/**
 * Persistence middleware with compression
 */
export function advancedPersistenceMiddleware<T>(
  persistKey: string,
  options: {
    compress?: boolean
    ttl?: number // Time to live in milliseconds
  } = {}
): (store: Store<T>) => Store<T> {
  return (store: Store<T>) => {
    const originalSetState = store.setState
    const { compress = false, ttl } = options

    const saveToStorage = (state: T) => {
      try {
        const data = {
          state,
          timestamp: Date.now(),
          version: '1.0'
        }
        
        let serialized = JSON.stringify(data)
        
        // Simple compression using LZ-string if available
        if (compress && 'LZString' in window) {
          serialized = (window as Record<string, unknown> & { LZString: { compress: (str: string) => string } }).LZString.compress(serialized)
        }
        
        localStorage.setItem(persistKey, serialized)
      } catch (error) {
        console.warn(`Failed to persist state for ${persistKey}:`, error)
      }
    }

    const loadFromStorage = (): T | null => {
      try {
        let serialized = localStorage.getItem(persistKey)
        if (!serialized) return null
        
        // Decompress if needed
        if (compress && 'LZString' in window) {
          serialized = (window as Record<string, unknown> & { LZString: { decompress: (str: string) => string } }).LZString.decompress(serialized)
        }
        
        const data = JSON.parse(serialized)
        
        // Check TTL
        if (ttl && Date.now() - data.timestamp > ttl) {
          localStorage.removeItem(persistKey)
          return null
        }
        
        return data.state
      } catch (error) {
        console.warn(`Failed to load persisted state for ${persistKey}:`, error)
        localStorage.removeItem(persistKey)
        return null
      }
    }

    // Load initial state
    const persistedState = loadFromStorage()
    if (persistedState) {
      store.setState(persistedState)
    }

    return {
      ...store,
      setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
        originalSetState(partial)
        saveToStorage(store.getState())
      }
    }
  }
}