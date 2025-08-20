import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './app/providers/ThemeContext'
import { LanguageProvider } from './app/providers/LanguageContext'
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { queryClient } from './app/config/queryClient'

// Create a new router instance
const router = createRouter({ 
  routeTree,
  context: {
    queryClient,
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
