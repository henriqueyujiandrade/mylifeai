/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
// import { visualizer } from 'rollup-plugin-visualizer'
// import { compression } from 'vite-plugin-compression2'  
// import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/pages',
      generatedRouteTree: './src/routeTree.gen.ts'
    }),
    react({
      // React 19 optimizations
    }),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
    warmup: {
      clientFiles: [
        './src/shared/components/**/*.tsx',
        './src/shared/hooks/**/*.ts',
        './src/features/**/*.tsx'
      ]
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: process.env.NODE_ENV === 'development',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Intelligent chunk splitting
        manualChunks: (id) => {
          // React core
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor'
          }
          
          // Router and navigation
          if (id.includes('@tanstack/react-router')) {
            return 'router'
          }
          
          // State management and data fetching
          if (id.includes('@tanstack/react-query') || id.includes('zustand')) {
            return 'state'
          }
          
          // Form handling
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'forms'
          }
          
          // UI components and icons
          if (id.includes('lucide-react') || id.includes('@radix-ui')) {
            return 'ui'
          }
          
          // Feature-based chunks
          if (id.includes('/src/features/auth/')) {
            return 'feature-auth'
          }
          
          if (id.includes('/src/features/dashboard/')) {
            return 'feature-dashboard'
          }
          
          // Shared utilities
          if (id.includes('/src/shared/')) {
            return 'shared'
          }
          
          // Third-party vendor chunks
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        
        // Optimize chunk naming
        chunkFileNames: () => {
          return `js/[name]-[hash].js`
        },
        
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      },
      
      // Tree shaking optimization
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    
    // Terser options for advanced minification
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        unsafe_math: true,
        unsafe_methods: true
      },
      mangle: {
        safari10: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-router',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env'],
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      }
    }
  },
  
  esbuild: {
    target: 'esnext',
    platform: 'browser',
    format: 'esm',
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
