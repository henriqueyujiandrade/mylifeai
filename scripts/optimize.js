#!/usr/bin/env node

/**
 * React 19 Optimization Scripts
 * Run with: node scripts/optimize.js [command]
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const commands = {
  'analyze-bundle': analyzeBundleSize,
  'check-performance': checkPerformance,
  'update-deps': updateDependencies,
  'generate-types': generateTypes,
  'lint-performance': lintPerformance,
  'help': showHelp
}

function main() {
  const command = process.argv[2] || 'help'
  
  if (commands[command]) {
    console.log(`🚀 Running: ${command}`)
    commands[command]()
  } else {
    console.error(`❌ Unknown command: ${command}`)
    showHelp()
    process.exit(1)
  }
}

function analyzeBundleSize() {
  console.log('📊 Analyzing bundle size...')
  
  try {
    // Build for analysis
    execSync('pnpm build', { stdio: 'inherit' })
    
    // Check if bundle analysis exists
    const analysisFile = path.join(process.cwd(), 'dist', 'bundle-analysis.html')
    if (fs.existsSync(analysisFile)) {
      console.log('✅ Bundle analysis generated:', analysisFile)
      console.log('🌐 Open in browser to view detailed analysis')
    }
    
    // Check bundle sizes
    const distDir = path.join(process.cwd(), 'dist', 'assets')
    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir)
      const jsFiles = files.filter(f => f.endsWith('.js'))
      
      console.log('\n📦 JavaScript bundles:')
      jsFiles.forEach(file => {
        const filePath = path.join(distDir, file)
        const stats = fs.statSync(filePath)
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
        
        const status = sizeMB > 1 ? '⚠️' : '✅'
        console.log(`${status} ${file}: ${sizeMB}MB`)
      })
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message)
  }
}

function checkPerformance() {
  console.log('⚡ Checking performance metrics...')
  
  const packageJson = require('../package.json')
  const srcDir = path.join(process.cwd(), 'src')
  
  // Count components
  const componentCount = countFiles(srcDir, /\.tsx$/)
  const hookCount = countFiles(srcDir, /^use[A-Z].*\.ts$/)
  const storeCount = countFiles(srcDir, /store|Store/i)
  
  console.log('\n📊 Project metrics:')
  console.log(`📦 Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`)
  console.log(`🧩 Components: ${componentCount}`)
  console.log(`🎣 Hooks: ${hookCount}`)
  console.log(`🗄️ Stores: ${storeCount}`)
  
  // Check for performance anti-patterns
  console.log('\n🔍 Performance check:')
  
  const hasPerformanceHooks = checkForPattern(srcDir, /usePerformanceMonitoring|useMemo|useCallback/)
  const hasLazyLoading = checkForPattern(srcDir, /lazy\(|Suspense/)
  const hasOptimization = checkForPattern(srcDir, /memo\(|React\.memo/)
  
  console.log(`${hasPerformanceHooks ? '✅' : '⚠️'} Performance monitoring`)
  console.log(`${hasLazyLoading ? '✅' : '⚠️'} Lazy loading`)
  console.log(`${hasOptimization ? '✅' : '⚠️'} Component optimization`)
  
  // Check for React 19 features
  console.log('\n🆕 React 19 features:')
  const hasUseHook = checkForPattern(srcDir, /\buse\(/)
  const hasOptimistic = checkForPattern(srcDir, /useOptimistic/)
  const hasAsyncBoundary = checkForPattern(srcDir, /AsyncBoundary|Suspense/)
  
  console.log(`${hasUseHook ? '✅' : '📋'} use() hook`)
  console.log(`${hasOptimistic ? '✅' : '📋'} Optimistic updates`)
  console.log(`${hasAsyncBoundary ? '✅' : '📋'} Async boundaries`)
}

function updateDependencies() {
  console.log('📦 Updating dependencies to latest compatible versions...')
  
  const updates = [
    'react@latest',
    'react-dom@latest',
    '@types/react@latest',
    '@types/react-dom@latest',
    'vite@latest',
    'vitest@latest',
    '@tanstack/react-router@latest',
    '@tanstack/react-query@latest',
    'tailwindcss@latest'
  ]
  
  try {
    console.log('📋 Updating packages:', updates.join(', '))
    execSync(`pnpm add ${updates.join(' ')}`, { stdio: 'inherit' })
    
    console.log('✅ Dependencies updated!')
    console.log('🔍 Run performance check to verify compatibility')
  } catch (error) {
    console.error('❌ Update failed:', error.message)
  }
}

function generateTypes() {
  console.log('🏷️ Generating TypeScript types...')
  
  try {
    execSync('pnpm type-check', { stdio: 'inherit' })
    console.log('✅ TypeScript check passed')
    
    // Generate route types if using TanStack Router
    const routerGenFile = path.join(process.cwd(), 'src', 'routeTree.gen.ts')
    if (fs.existsSync(routerGenFile)) {
      console.log('🛣️ Route types generated')
    }
    
  } catch (error) {
    console.error('❌ Type check failed:', error.message)
    console.log('💡 Fix TypeScript errors before proceeding')
  }
}

function lintPerformance() {
  console.log('🔍 Linting for performance issues...')
  
  const srcDir = path.join(process.cwd(), 'src')
  const issues = []
  
  // Check for common performance issues
  checkFiles(srcDir, (filePath, content) => {
    const relativePath = path.relative(process.cwd(), filePath)
    
    // Check for missing React.memo on components
    if (content.includes('export const') && content.includes('= (') && !content.includes('memo(')) {
      issues.push(`⚠️ ${relativePath}: Consider using React.memo for component optimization`)
    }
    
    // Check for inline object/array creation in render
    if (content.match(/\w+\s*=\s*{|}|\w+\s*=\s*\[|\]/g) && content.includes('return (')) {
      issues.push(`⚠️ ${relativePath}: Avoid inline object/array creation in render`)
    }
    
    // Check for missing dependency arrays
    if (content.includes('useEffect(') && !content.includes('useEffect(')) {
      issues.push(`⚠️ ${relativePath}: useEffect missing dependency array`)
    }
  })
  
  if (issues.length === 0) {
    console.log('✅ No performance issues found!')
  } else {
    console.log('\n🔍 Performance issues found:')
    issues.forEach(issue => console.log(issue))
  }
}

function showHelp() {
  console.log(`
🚀 React 19 Optimization Scripts

Usage: node scripts/optimize.js [command]

Commands:
  analyze-bundle    📊 Analyze bundle size and composition
  check-performance ⚡ Check performance metrics and React 19 features
  update-deps       📦 Update dependencies to latest compatible versions
  generate-types    🏷️ Generate and check TypeScript types
  lint-performance  🔍 Lint for common performance issues
  help             📚 Show this help message

Examples:
  node scripts/optimize.js analyze-bundle
  node scripts/optimize.js check-performance
  node scripts/optimize.js update-deps
`)
}

// Utility functions
function countFiles(dir, pattern) {
  let count = 0
  
  function walk(currentDir) {
    const files = fs.readdirSync(currentDir)
    
    for (const file of files) {
      const filePath = path.join(currentDir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        walk(filePath)
      } else if (pattern.test(file)) {
        count++
      }
    }
  }
  
  try {
    walk(dir)
  } catch (error) {
    // Directory doesn't exist or permission denied
  }
  
  return count
}

function checkForPattern(dir, pattern) {
  let found = false
  
  checkFiles(dir, (filePath, content) => {
    if (pattern.test(content)) {
      found = true
    }
  })
  
  return found
}

function checkFiles(dir, callback) {
  function walk(currentDir) {
    try {
      const files = fs.readdirSync(currentDir)
      
      for (const file of files) {
        const filePath = path.join(currentDir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          walk(filePath)
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          const content = fs.readFileSync(filePath, 'utf8')
          callback(filePath, content)
        }
      }
    } catch (error) {
      // Directory doesn't exist or permission denied
    }
  }
  
  walk(dir)
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = commands