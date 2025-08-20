#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

async function buildWithAnalysis() {
  console.log('🚀 Starting optimized build with analysis...\n')
  
  const startTime = Date.now()
  
  try {
    // Clean previous build
    console.log('🧹 Cleaning previous build...')
    await execAsync('rm -rf dist')
    
    // Run TypeScript check
    console.log('🔍 Type checking...')
    await execAsync('tsc -b')
    
    // Build with Vite
    console.log('📦 Building with Vite...')
    const buildResult = await execAsync('vite build')
    console.log(buildResult.stdout)
    
    // Analyze build output
    console.log('📊 Analyzing build output...')
    await analyzeBuildOutput()
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    
    console.log(`\n✅ Build completed successfully in ${duration.toFixed(2)}s`)
    console.log('📊 Bundle analysis available at: dist/stats.html')
    console.log('🚀 Run "npm run preview" to preview the build')
    
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

async function analyzeBuildOutput() {
  try {
    const distPath = './dist'
    const files = await fs.readdir(distPath, { recursive: true })
    
    const jsFiles = files.filter(f => f.endsWith('.js') && !f.includes('.map'))
    const cssFiles = files.filter(f => f.endsWith('.css'))
    
    console.log('\n📋 Build Summary:')
    console.log('================')
    
    let totalSize = 0
    let totalGzipSize = 0
    
    for (const file of jsFiles) {
      const filePath = path.join(distPath, file)
      const stats = await fs.stat(filePath)
      const sizeKB = (stats.size / 1024).toFixed(2)
      totalSize += stats.size
      
      // Estimate gzip size (roughly 1/3 of original)
      const estimatedGzipKB = (stats.size / 3 / 1024).toFixed(2)
      totalGzipSize += stats.size / 3
      
      console.log(`📄 ${file}: ${sizeKB}KB (${estimatedGzipKB}KB gzipped)`)
    }
    
    for (const file of cssFiles) {
      const filePath = path.join(distPath, file)
      const stats = await fs.stat(filePath)
      const sizeKB = (stats.size / 1024).toFixed(2)
      totalSize += stats.size
      totalGzipSize += stats.size / 3
      
      console.log(`🎨 ${file}: ${sizeKB}KB`)
    }
    
    console.log('================')
    console.log(`📊 Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`)
    console.log(`🗜️  Estimated gzipped: ${(totalGzipSize / 1024).toFixed(2)}KB`)
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:')
    if (totalSize > 500 * 1024) {
      console.log('⚠️  Bundle size is large (>500KB). Consider code splitting.')
    } else {
      console.log('✅ Bundle size is optimal (<500KB)')
    }
    
    if (jsFiles.length > 10) {
      console.log('⚠️  Many JS chunks. Consider consolidating similar functionality.')
    } else {
      console.log('✅ Good chunk distribution')
    }
    
  } catch (error) {
    console.warn('⚠️  Could not analyze build output:', error.message)
  }
}

// Run the build
buildWithAnalysis()