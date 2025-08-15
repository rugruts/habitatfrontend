#!/usr/bin/env node

/**
 * Production Deployment Script for Habitat Lobby
 * Builds the application for production deployment to habitatlobby.com
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production deployment build for habitatlobby.com...\n');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Previous build cleaned');
  }
} catch (error) {
  console.log('⚠️  No previous build to clean');
}

// Step 2: Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 3: Run TypeScript checks
console.log('\n🔍 Running TypeScript checks...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript checks passed');
} catch (error) {
  console.error('❌ TypeScript errors found. Please fix before deploying.');
  process.exit(1);
}

// Step 4: Run linting
console.log('\n🔧 Running ESLint checks...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.warn('⚠️  Linting warnings found, but continuing...');
}

// Step 5: Build for production
console.log('\n🏗️  Building for production...');
try {
  execSync('npm run build:prod', { stdio: 'inherit' });
  console.log('✅ Production build completed');
} catch (error) {
  console.error('❌ Production build failed:', error.message);
  process.exit(1);
}

// Step 6: Verify build output
console.log('\n✅ Verifying build output...');
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Build output directory not found!');
  process.exit(1);
}

const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in build output!');
  process.exit(1);
}

// Step 7: Display build info
const stats = fs.statSync(distPath);
const files = fs.readdirSync(distPath);
console.log(`📊 Build completed successfully!`);
console.log(`📁 Output directory: ${distPath}`);
console.log(`📄 Files generated: ${files.length}`);
console.log(`📅 Build time: ${stats.mtime.toISOString()}`);

// Step 8: Display deployment instructions
console.log('\n🎯 DEPLOYMENT INSTRUCTIONS:');
console.log('==========================================');
console.log('1. Upload the contents of the "dist/" folder to your web server');
console.log('2. Point your domain (habitatlobby.com) to the uploaded files');
console.log('3. Ensure your web server serves index.html for all routes (SPA routing)');
console.log('4. Configure SSL certificate for HTTPS');
console.log('5. Update Stripe keys to live/production keys in .env.production');
console.log('6. Test the live site thoroughly');
console.log('==========================================');

console.log('\n✨ Production build ready for deployment to habitatlobby.com! ✨');
