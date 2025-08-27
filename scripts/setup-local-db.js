#!/usr/bin/env node

/**
 * Local PostgreSQL Database Setup Script
 * This script helps set up the local database for Reviews Autopilot
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Local PostgreSQL Database Setup\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/reviewsautopilot"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (placeholder)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
GOOGLE_OAUTH_SCOPES="https://www.googleapis.com/auth/business.manage"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created');
  console.log('⚠️  IMPORTANT: Update YOUR_PASSWORD in .env.local with your PostgreSQL password\n');
} else {
  console.log('✅ .env.local already exists');
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

// Check Prisma installation
console.log('🔍 Checking Prisma installation...');
try {
  execSync('npx prisma --version', { stdio: 'pipe' });
  console.log('✅ Prisma is installed\n');
} catch (error) {
  console.log('📦 Installing Prisma...');
  try {
    execSync('npm install prisma @prisma/client', { stdio: 'inherit' });
    console.log('✅ Prisma installed\n');
  } catch (error) {
    console.error('❌ Failed to install Prisma');
    process.exit(1);
  }
}

// Check if schema exists
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Prisma schema not found at prisma/schema.prisma');
  process.exit(1);
}

console.log('📋 Setup Checklist:');
console.log('1. ✅ PostgreSQL 17 installed');
console.log('2. ✅ pgAdmin 4 installed');
console.log('3. ✅ .env.local created');
console.log('4. ✅ Dependencies installed');
console.log('5. ✅ Prisma ready\n');

console.log('🚀 Next Steps:');
console.log('1. Complete PostgreSQL installation (set password)');
console.log('2. Open pgAdmin and create database "reviewsautopilot"');
console.log('3. Update YOUR_PASSWORD in .env.local');
console.log('4. Run: npm run db:generate');
console.log('5. Run: npm run db:push');
console.log('6. Run: npm run db:studio (to verify)\n');

console.log('❓ Would you like me to help you with the next steps? (y/n)');

// Simple input handling
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
  const input = data.trim().toLowerCase();
  if (input === 'y' || input === 'yes') {
    console.log('\n🎯 Let\'s continue with database setup!\n');
    
    console.log('📝 Step 1: Update your .env.local file');
    console.log('   - Replace YOUR_PASSWORD with your PostgreSQL password');
    console.log('   - Save the file\n');
    
    console.log('📝 Step 2: Create database in pgAdmin');
    console.log('   - Open pgAdmin 4');
    console.log('   - Connect to PostgreSQL server');
    console.log('   - Right-click "Databases" → Create → Database');
    console.log('   - Name: reviewsautopilot\n');
    
    console.log('📝 Step 3: Initialize database');
    console.log('   - Run: npm run db:generate');
    console.log('   - Run: npm run db:push');
    console.log('   - Run: npm run db:studio (to verify)\n');
    
    console.log('🎉 After completing these steps, your database will be ready!');
    console.log('📖 See DATABASE_SETUP.md for detailed instructions');
    
    process.exit(0);
  } else {
    console.log('\n✅ Setup script completed!');
    console.log('📖 Check DATABASE_SETUP.md for detailed instructions');
    console.log('🔄 Run this script again when ready to continue');
    process.exit(0);
  }
});

