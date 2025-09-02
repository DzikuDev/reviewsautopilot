# 🗄️ Local PostgreSQL Database Setup Guide

## **🎯 What We're Setting Up**
- **PostgreSQL 17** - Local database server
- **pgAdmin 4** - Database management tool
- **Database** - For Reviews Autopilot app
- **Prisma** - Database ORM connection

---

## **📋 Prerequisites**
- ✅ PostgreSQL 17 (installing...)
- ✅ pgAdmin 4 (installed)
- ✅ Node.js & npm (already installed)
- ✅ Prisma (already in package.json)

---

## **🚀 Step-by-Step Setup**

### **Step 1: Complete PostgreSQL Installation**
After the PostgreSQL installer finishes:

1. **Run the installer** when it completes
2. **Set a password** for the `postgres` user (remember this!)
3. **Keep default port** (5432)
4. **Complete installation**

### **Step 2: Create Environment File**
Create a `.env.local` file in your project root:

```bash
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/reviewsautopilot"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (placeholder)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
GOOGLE_OAUTH_SCOPES="https://www.googleapis.com/auth/business.manage"
```

**Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.**

### **Step 3: Create Database**
Open pgAdmin 4 and:

1. **Connect to server** using your password
2. **Right-click on "Databases"**
3. **Create → Database**
4. **Name it**: `reviewsautopilot`
5. **Click "Save"**

### **Step 4: Initialize Database with Prisma**
Run these commands in your project directory:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

---

## **🔧 Database Connection Test**

### **Test Connection**
```bash
# Check if Prisma can connect
npx prisma db pull
```

### **Verify Tables Created**
```bash
# List all tables
npx prisma db execute --stdin
```

Then type: `\dt` and press Enter.

---

## **📊 What Gets Created**

### **Core Tables**
- `User` - User accounts
- `Org` - Organizations
- `Location` - Business locations
- `Review` - Customer reviews
- `Template` - Response templates
- `ToneProfile` - AI tone settings
- `DraftReply` - AI-generated responses
- `Reply` - Published responses

### **Relationship Tables**
- `Membership` - User-organization relationships
- `Integration` - External service connections

---

## **🚨 Troubleshooting**

### **Common Issues**

#### **1. Connection Refused**
```bash
# Check if PostgreSQL is running
# Windows: Services app → PostgreSQL → Start
# Or restart the service
```

#### **2. Authentication Failed**
```bash
# Verify password in .env.local
# Check DATABASE_URL format
```

#### **3. Database Not Found**
```bash
# Create database in pgAdmin
# Or run: createdb -U postgres reviewsautopilot
```

#### **4. Prisma Client Issues**
```bash
# Regenerate client
npm run db:generate

# Reset database
npx prisma migrate reset
```

---

## **🎉 Success Indicators**

### **✅ Database Working**
- `npm run db:push` succeeds
- `npm run db:studio` opens
- App connects without errors
- Tables visible in pgAdmin

### **✅ App Working**
- Dashboard loads with real data
- Forms save to database
- No "connection refused" errors
- Data persists between restarts

---

## **🔍 Verification Commands**

```bash
# Check database connection
npx prisma db pull

# View database schema
npx prisma format

# Open database browser
npm run db:studio

# Check Prisma status
npx prisma --version
```

---

## **📱 Next Steps After Setup**

1. **Test basic CRUD operations**
2. **Create test organizations**
3. **Add sample templates**
4. **Test user authentication**
5. **Verify data persistence**

---

## **💡 Pro Tips**

- **Keep pgAdmin open** for database inspection
- **Use Prisma Studio** for quick data viewing
- **Backup your database** before major changes
- **Test with small data** first
- **Check logs** if something fails

---

**🎯 Ready to proceed? Let me know when PostgreSQL installation is complete and I'll help you with the next steps!**



