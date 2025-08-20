# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Production build using TypeScript + Vite with production config
- `pnpm build:analyze` - Build with bundle analysis
- `pnpm preview` - Preview production build locally

### Code Quality
- `pnpm lint` - ESLint check (max 20 warnings allowed)
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm type-check` - TypeScript compilation check without output

### Testing
- `pnpm test` - Run Vitest tests
- `pnpm test:ui` - Run tests with UI interface

### Bundle Analysis
- `pnpm build:stats` - Build and analyze bundle with serve on port 3001

## Architecture Overview

This is a **React 19 optimized application** implementing **Domain-Driven Design (DDD)** architecture with advanced performance monitoring and state management.

### Core Technologies
- **React 19** with latest features (`use` hook, `useOptimistic`, `startTransition`)
- **TypeScript 5.8+** with strict configuration
- **Vite 7.1.2** with optimized production config
- **TanStack Router** for type-safe routing
- **TanStack Query** for server state management
- **Tailwind CSS v4** for styling

### Folder Structure (DDD Pattern)
```
src/
├── app/              # App-level configuration (providers, themes, config)
├── features/         # Feature modules (auth, dashboard) - isolated business logic
├── entities/         # Domain entities and schemas
├── shared/           # Reusable components, hooks, utilities
├── pages/            # Route components (TanStack Router)
├── infrastructure/   # External integrations (API, monitoring, storage)
└── types/            # Global type definitions
```

### State Management Architecture

**Custom React 19 Store System** (`src/shared/stores/createStore.ts`):
- Uses `useSyncExternalStore` for optimal React 19 performance
- Built-in optimistic updates with `useOptimistic`
- Automatic persistence and DevTools integration
- Middleware system for performance monitoring and error boundaries
- Type-safe with full TypeScript support

Example store creation:
```typescript
const authStore = createStore(initialState, {
  name: 'auth',
  persistKey: 'auth-state',
  middleware: [errorBoundaryMiddleware, performanceMiddleware]
})
```

### Performance Monitoring System

**Comprehensive performance tracking** (`src/shared/hooks/usePerformanceMonitoring.tsx`):
- Web Vitals integration (CLS, LCP, FCP, TTFB, INP)
- Component render time tracking
- Memory usage monitoring
- Slow component detection
- Performance dashboard (development only)

Key hooks:
- `usePerformanceMonitoring(componentName)` - Track component performance
- `useWebVitals()` - Monitor Core Web Vitals
- `useMemoryMonitoring()` - Track memory usage

### Error Handling Strategy

**Multi-layered error boundaries**:
- `AsyncBoundary` - Combines Suspense + ErrorBoundary
- `AdvancedErrorBoundary` - Retry logic with exponential backoff
- Global error reporting service
- Context-aware error recovery

### Build Optimization

**Intelligent code splitting** in `vite.config.production.ts`:
- React vendor chunk (react, react-dom)
- Feature-based chunks (auth, dashboard)
- Library chunks (forms, router, state)
- Optimized bundle naming and compression

**Performance targets**:
- React vendor: ~230KB → ~73KB gzipped
- Feature chunks: <10KB each
- Total initial load: <100KB gzipped

## Development Guidelines

### Adding New Features
1. Create feature module in `src/features/[feature-name]/`
2. Include: components/, hooks/, services/, stores/, types/
3. Export main functionality from feature index.ts
4. Add route in `src/pages/`
5. Update Vite config for code splitting if needed

### React 19 Patterns Used
- **Async Data**: Use `useAsyncData` hook instead of useEffect patterns
- **Optimistic Updates**: Use `useOptimisticStore` for immediate UI feedback
- **Error Boundaries**: Wrap async components in `AsyncBoundary`
- **Concurrent Features**: Use `startTransition` for non-urgent updates

### Performance Best Practices
- Always add `usePerformanceMonitoring` to new page components
- Use feature-based code splitting for large modules
- Implement optimistic updates for user interactions
- Monitor bundle size impact with `pnpm build:analyze`

### Type Safety Notes
- All stores must extend `Record<string, unknown>` for middleware compatibility
- Use `/* eslint-disable-next-line @typescript-eslint/no-explicit-any */` for complex generic types where necessary
- Interface definitions should be co-located with implementation

## Important Implementation Details

### Theme System
- Dynamic theme switching with CSS custom properties
- Performance-optimized theme application with change detection
- Supports system preference detection
- Theme customizer available in header (not bottom-right to avoid Performance Dashboard conflict)

### Router Configuration
- File-based routing with TanStack Router
- Routes generated from `src/pages/` directory
- Type-safe navigation and parameters
- Route tree auto-generated in `src/routeTree.gen.ts`

### Development vs Production
- Performance monitoring tools only appear in development
- Console logs dropped in production builds
- Source maps only in development
- Bundle analysis available for optimization

### Critical Dependencies
- React 19 (bleeding edge features)
- Vite 7.1.2 (latest build optimizations)
- TanStack ecosystem (Router v1.131+, Query v5.85+)
- Web Vitals v5.1.0 (latest API)

This architecture is designed for scalability, maintainability, and optimal React 19 performance. The project follows modern best practices and is production-ready with comprehensive monitoring and error handling.