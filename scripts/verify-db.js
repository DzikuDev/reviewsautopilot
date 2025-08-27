#!/usr/bin/env node

/**
 * Database Connection Verification Script
 * This script verifies that your local PostgreSQL database is working
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Database Connection Verification\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  console.log('💡 Run: npm run setup:local to create it');
  process.exit(1);
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.error('❌ DATABASE_URL not found in .env.local');
  console.log('💡 Make sure your .env.local has the correct DATABASE_URL');
  process.exit(1);
}

console.log('✅ Environment file found');
console.log('🔍 Checking database connection...\n');

// Test Prisma connection
try {
  console.log('📡 Testing Prisma connection...');
  execSync('npx prisma db pull', { stdio: 'pipe' });
  console.log('✅ Database connection successful!\n');
} catch (error) {
  console.log('❌ Database connection failed');
  console.log('💡 Common issues:');
  console.log('   - PostgreSQL service not running');
  console.log('   - Wrong password in .env.local');
  console.log('   - Database "reviewsautopilot" not created');
  console.log('   - Wrong port or hostname\n');
  
  console.log('🔧 Troubleshooting steps:');
  console.log('1. Check if PostgreSQL is running (Services app)');
  console.log('2. Verify password in .env.local');
  console.log('3. Create database in pgAdmin');
  console.log('4. Check DATABASE_URL format\n');
  
  process.exit(1);
}

// Check if tables exist
try {
  console.log('📊 Checking database tables...');
  const result = execSync('npx prisma db execute --stdin', { 
    input: '\\dt\n',
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  if (result.includes('reviewsautopilot')) {
    console.log('✅ Database tables found');
    console.log('📋 Tables in database:');
    
    // Extract table names from the result
    const lines = result.split('\n');
    const tableLines = lines.filter(line => line.includes('|') && !line.includes('---'));
    
    if (tableLines.length > 0) {
      tableLines.forEach(line => {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        if (parts.length >= 2 && parts[1] !== 'Name') {
          console.log(`   - ${parts[1]}`);
        }
      });
    }
  } else {
    console.log('⚠️  No tables found - database may be empty');
    console.log('💡 Run: npm run db:push to create tables');
  }
  
} catch (error) {
  console.log('⚠️  Could not check tables - database may be empty');
  console.log('💡 Run: npm run db:push to create tables');
}

console.log('\n🎉 Database verification complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run db:push (if tables not found)');
console.log('2. Run: npm run db:studio (to view database)');
console.log('3. Start your app: npm run dev');
console.log('4. Test database operations in the app\n');

console.log('🔍 Want to see your database in action?');
console.log('   npm run db:studio\n');

