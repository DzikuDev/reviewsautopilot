#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Reviews Autopilot Database...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file based on env.example and fill in your configuration.\n');
  process.exit(1);
}

try {
  // Install dependencies if not already installed
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Generate Prisma client
  console.log('\n🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('\n🗄️  Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Seed database with sample data (optional)
  console.log('\n🌱 Seeding database with sample data...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  No seed script found, skipping...');
  }
  
  console.log('\n✅ Database setup complete!');
  console.log('\nNext steps:');
  console.log('1. Fill in your .env file with your API keys');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Visit http://localhost:3000 to access your app');
  console.log('4. Sign in and create your organization');
  console.log('5. Connect your Google Business Profile to start syncing reviews');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Make sure your database is running and accessible');
  console.log('2. Check your DATABASE_URL in .env file');
  console.log('3. Ensure you have the necessary database permissions');
  process.exit(1);
}
