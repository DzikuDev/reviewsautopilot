#!/usr/bin/env node

/**
 * Reviews Autopilot Testing Script
 * This script helps you systematically test different parts of the app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Reviews Autopilot Testing Script\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// Test functions
const tests = {
  // Phase 1: Free Testing
  'lint': () => {
    console.log('🔍 Running ESLint...');
    try {
      execSync('npm run lint', { stdio: 'inherit' });
      console.log('✅ Linting passed\n');
    } catch (error) {
      console.log('⚠️  Linting issues found (check output above)\n');
    }
  },

  'types': () => {
    console.log('📝 Checking TypeScript types...');
    try {
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      console.log('✅ TypeScript types are valid\n');
    } catch (error) {
      console.log('⚠️  TypeScript issues found (check output above)\n');
    }
  },

  'build': () => {
    console.log('🏗️  Building the app...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build successful\n');
    } catch (error) {
      console.log('❌ Build failed (check output above)\n');
      return false;
    }
    return true;
  },

  'dev-server': () => {
    console.log('🚀 Starting development server...');
    console.log('📱 Open http://localhost:3000 in your browser');
    console.log('🔄 Press Ctrl+C to stop the server\n');
    
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      console.log('✅ Development server stopped');
    }
  }
};

// Main testing flow
async function runTests() {
  console.log('🎯 Starting Phase 1 Testing (Free)\n');

  // Run basic checks
  tests.lint();
  tests.types();
  
  const buildSuccess = tests.build();
  
  if (buildSuccess) {
    console.log('🎉 All basic tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open http://localhost:3000');
    console.log('3. Follow the testing checklist in TESTING_CHECKLIST.md');
    console.log('4. Test all pages and interactions');
    
    console.log('\n❓ Would you like to start the development server now? (y/n)');
    
    // Simple input handling
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
      const input = data.trim().toLowerCase();
      if (input === 'y' || input === 'yes') {
        console.log('\n🚀 Starting development server...\n');
        tests.dev-server();
      } else {
        console.log('\n✅ You can start the server later with: npm run dev');
        console.log('📖 Check TESTING_CHECKLIST.md for detailed testing steps');
        process.exit(0);
      }
    });
  } else {
    console.log('❌ Build failed - please fix the issues before testing');
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/test-app.js [options]');
  console.log('\nOptions:');
  console.log('  --help, -h     Show this help message');
  console.log('  --lint         Run only linting');
  console.log('  --types        Run only TypeScript check');
  console.log('  --build        Run only build check');
  console.log('  --dev          Start development server');
  console.log('\nExamples:');
  console.log('  node scripts/test-app.js              # Run all tests');
  console.log('  node scripts/test-app.js --lint       # Run only linting');
  console.log('  node scripts/test-app.js --dev        # Start dev server');
  process.exit(0);
}

if (args.includes('--lint')) {
  tests.lint();
  process.exit(0);
}

if (args.includes('--types')) {
  tests.types();
  process.exit(0);
}

if (args.includes('--build')) {
  const success = tests.build();
  process.exit(success ? 0 : 1);
}

if (args.includes('--dev')) {
  tests.dev-server();
  process.exit(0);
}

// Run full test suite if no specific flags
runTests();

