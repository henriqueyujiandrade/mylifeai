/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compressionPlugin } from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react({
      // React 19 optimizations
      jsxImportSource: undefined, // Use automatic JSX runtime
      plugins: [
        // Enable React Compiler (when available)
        // ['babel-plugin-react-compiler', {}]
      ]
    }),
    tailwindcss(),
    
    // Bundle analyzer
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    
    // Compression
    compressionPlugin({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compressionPlugin({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
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
    target: 'es2022', // Modern target for React 19
    sourcemap: true,
    minify: 'terser',
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false, // Remove comments
      }
    },
    
    rollupOptions: {
      output: {
        // Advanced code splitting
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom'],
          
          // Router
          'router': ['@tanstack/react-router'],
          
          // Data fetching
          'query': ['@tanstack/react-query'],
          
          // Forms
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // UI libraries
          'ui': ['lucide-react', 'clsx', 'tailwind-merge'],
          
          // Utilities
          'utils': ['axios'],
          
          // Feature chunks
          'auth': ['./src/features/auth/index.ts'],
          'dashboard': ['./src/features/dashboard/index.ts'],
        },
        
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          
          if (facadeModuleId) {
            // Create meaningful names for feature chunks
            if (facadeModuleId.includes('/features/')) {
              const feature = facadeModuleId.split('/features/')[1].split('/')[0]
              return `features/${feature}-[hash].js`
            }
            
            if (facadeModuleId.includes('/shared/')) {
              return `shared/[name]-[hash].js`
            }
          }
          
          return `chunks/[name]-[hash].js`
        },
        
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`
          }
          
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          }
          
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    
    // Improve build performance
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Faster builds
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      
      // Alias for smaller builds
      'react/jsx-runtime': 'react/jsx-runtime',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime',
    }
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
      'react-hook-form',
      'zod'
    ],
    exclude: [
      // Exclude large optional dependencies
      '@tanstack/react-query-devtools',
      '@tanstack/react-router-devtools'
    ]
  },
  
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts' // Barrel exports
      ]
    }
  },
  
  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // CSS optimizations
  css: {
    devSourcemap: true,
    modules: {
      // CSS Modules optimization
      generateScopedName: process.env.NODE_ENV === 'production' 
        ? '[hash:base64:5]' 
        : '[name]__[local]___[hash:base64:5]'
    }
  }
})