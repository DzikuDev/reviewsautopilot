# 🚀 Quick Start: Local Database Setup

## **⚡ One-Command Setup**

```bash
npm run setup:local
```

This will:
- ✅ Create `.env.local` file
- ✅ Check dependencies
- ✅ Verify Prisma installation
- ✅ Guide you through next steps

---

## **📋 Complete Setup Commands**

### **1. Initial Setup**
```bash
# Run the setup script
npm run setup:local

# Or manually create .env.local with your PostgreSQL password
```

### **2. Database Creation**
```bash
# Open pgAdmin 4 and create database "reviewsautopilot"
# Or use command line:
createdb -U postgres reviewsautopilot
```

### **3. Database Initialization**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Verify connection
npm run verify:db
```

### **4. Database Management**
```bash
# Open Prisma Studio (database browser)
npm run db:studio

# Reset database (if needed)
npx prisma migrate reset

# View database schema
npx prisma format
```

---

## **🔧 Troubleshooting Commands**

### **Connection Issues**
```bash
# Test database connection
npm run verify:db

# Check Prisma status
npx prisma --version

# Pull current database schema
npx prisma db pull
```

### **Service Issues**
```bash
# Check if PostgreSQL is running (Windows)
# Services app → PostgreSQL → Start/Stop

# Or restart the service
net stop postgresql-x64-17
net start postgresql-x64-17
```

---

## **📱 What to Do After Setup**

### **1. Test the App**
```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test creating organizations, templates, etc.
```

### **2. Verify Database**
```bash
# Open Prisma Studio
npm run db:studio

# Check that data is being saved
# Look for tables: User, Org, Template, etc.
```

### **3. Test CRUD Operations**
- Create a new organization
- Add a response template
- Create a tone profile
- Verify data persists between restarts

---

## **🎯 Success Indicators**

### **✅ Database Working**
- `npm run verify:db` shows "✅ Database connection successful!"
- `npm run db:studio` opens without errors
- Tables visible in pgAdmin

### **✅ App Working**
- Dashboard loads with real data
- Forms save to database
- No "connection refused" errors
- Data persists between restarts

---

## **🚨 Common Issues & Solutions**

### **Issue: "Connection refused"**
**Solution**: PostgreSQL service not running
```bash
# Check Services app → PostgreSQL → Start
```

### **Issue: "Authentication failed"**
**Solution**: Wrong password in `.env.local`
```bash
# Update YOUR_PASSWORD in .env.local
# Use the password you set during PostgreSQL installation
```

### **Issue: "Database does not exist"**
**Solution**: Database not created
```bash
# Open pgAdmin → Create database "reviewsautopilot"
# Or run: createdb -U postgres reviewsautopilot
```

### **Issue: "Prisma client not generated"**
**Solution**: Generate Prisma client
```bash
npm run db:generate
```

---

## **📖 Full Documentation**

- **`DATABASE_SETUP.md`** - Detailed setup guide
- **`TESTING_CHECKLIST.md`** - Testing procedures
- **`TESTING_FAQ.md`** - Common questions

---

## **🎉 You're Ready!**

Once your database is working:
1. **Test the app** with real data persistence
2. **Create sample data** to verify functionality
3. **Test all CRUD operations** (Create, Read, Update, Delete)
4. **Move to Phase 2** of testing (database functionality)

**Need help? Run `npm run verify:db` to diagnose any issues!**



