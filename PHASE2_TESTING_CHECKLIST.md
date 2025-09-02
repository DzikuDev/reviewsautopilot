# 🗄️ Phase 2: Database Testing Checklist

## **🎯 What We've Accomplished**

### **✅ Database Setup**
- [x] PostgreSQL database configured
- [x] Environment variables set up
- [x] Prisma schema ready
- [x] API endpoints updated for real database operations

### **✅ API Endpoints Updated**
- [x] `/api/orgs` - Real database operations
- [x] `/api/templates` - Real database operations  
- [x] `/api/tone-profiles` - Real database operations
- [x] `/api/reviews` - Mock data (ready for real data)
- [x] `/api/drafts` - Mock data (ready for real data)

---

## **🧪 Testing Commands**

### **Run Database Tests**
```bash
npm run test:db
```

### **Open Database Browser**
```bash
npm run db:studio
```

### **Verify Database Connection**
```bash
npm run verify:db
```

---

## **📋 Phase 2 Testing Checklist**

### **1. Database Connection Testing**
- [ ] **Prisma can connect to database**
  - Run: `npm run verify:db`
  - Expected: "✅ Database connection successful!"

- [ ] **All tables are created**
  - Run: `npm run db:studio`
  - Check: User, Org, Template, ToneProfile, Review tables exist

- [ ] **Schema matches Prisma definition**
  - Run: `npx prisma db pull`
  - Expected: No changes detected

### **2. API Endpoint Testing**
- [ ] **Create Organization**
  - Test: `POST /api/orgs`
  - Expected: Organization created with user membership

- [ ] **Create Template**
  - Test: `POST /api/templates`
  - Expected: Template saved to database

- [ ] **Create Tone Profile**
  - Test: `POST /api/tone-profiles`
  - Expected: Tone profile saved to database

- [ ] **Fetch Templates**
  - Test: `GET /api/templates`
  - Expected: Real templates from database

- [ ] **Fetch Tone Profiles**
  - Test: `GET /api/tone-profiles`
  - Expected: Real tone profiles from database

### **3. UI Testing with Real Data**
- [ ] **Dashboard loads**
  - Visit: `http://localhost:3000`
  - Expected: No database errors

- [ ] **Organizations page**
  - Visit: `http://localhost:3000/organizations`
  - Expected: Can create and view real organizations

- [ ] **Templates page**
  - Visit: `http://localhost:3000/templates`
  - Expected: Can create and view real templates

- [ ] **Tone Profiles page**
  - Visit: `http://localhost:3000/tone-profiles`
  - Expected: Can create and view real tone profiles

- [ ] **Reviews page**
  - Visit: `http://localhost:3000/reviews`
  - Expected: Mock data displays correctly

- [ ] **Drafts page**
  - Visit: `http://localhost:3000/drafts`
  - Expected: Mock data displays correctly

### **4. Data Persistence Testing**
- [ ] **Data persists between restarts**
  - Create data → Restart server → Check data still exists

- [ ] **Data is properly saved**
  - Check Prisma Studio for created records

- [ ] **Relationships work correctly**
  - Verify User → Org → Template relationships

- [ ] **Foreign key constraints work**
  - Try to create orphaned records (should fail)

### **5. CRUD Operations Testing**
- [ ] **Create operations**
  - Organizations, Templates, Tone Profiles

- [ ] **Read operations**
  - Fetch all records, pagination works

- [ ] **Update operations**
  - Edit templates and tone profiles

- [ ] **Delete operations**
  - Remove records (if implemented)

---

## **🚀 How to Run Phase 2 Tests**

### **Step 1: Run Automated Tests**
```bash
npm run test:db
```

### **Step 2: Manual UI Testing**
1. Open browser to `http://localhost:3000`
2. Navigate to each page
3. Create templates and tone profiles
4. Verify data appears in Prisma Studio

### **Step 3: Database Verification**
```bash
npm run db:studio
```

---

## **📊 Expected Results**

### **✅ Success Indicators**
- All API endpoints return 200/201 status
- Data appears in Prisma Studio
- UI shows real data instead of mock data
- No database connection errors
- Data persists between page refreshes

### **❌ Failure Indicators**
- Database connection errors
- API endpoints return 500 errors
- UI shows "Failed to fetch" messages
- Data doesn't persist
- Prisma Studio shows empty tables

---

## **🔧 Troubleshooting**

### **Common Issues**

#### **Database Connection Failed**
```bash
# Check if PostgreSQL is running
# Verify DATABASE_URL in .env
npm run verify:db
```

#### **API Endpoints Return 500**
```bash
# Check server logs
# Verify Prisma client is generated
npm run db:generate
```

#### **Data Not Persisting**
```bash
# Check database connection
# Verify transactions are committed
npm run db:studio
```

---

## **🎉 Phase 2 Completion Criteria**

### **✅ All Tests Pass**
- [ ] Database connection successful
- [ ] All CRUD operations work
- [ ] UI displays real data
- [ ] Data persists between restarts
- [ ] No critical errors in console

### **✅ Ready for Phase 3**
- [ ] Real database operations working
- [ ] Authentication ready to enable
- [ ] External integrations ready to test
- [ ] Performance acceptable

---

**🎯 Ready to start Phase 2 testing? Run `npm run test:db` to begin!**
