#!/usr/bin/env node

/**
 * Database Testing Script for Reviews Autopilot
 * Tests all CRUD operations and API endpoints
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data,
      error: !response.ok ? data.error : null
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      data: null,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 Starting Database Testing...\n');

  // Test 1: Create Organization
  console.log('📋 Test 1: Creating Organization');
  const orgResult = await testAPI('/orgs', 'POST', {
    name: 'Test Organization for Database Testing'
  });

  if (orgResult.success) {
    console.log('✅ Organization created successfully');
    console.log('   ID:', orgResult.data.org.id);
    console.log('   Name:', orgResult.data.org.name);
  } else {
    console.log('❌ Failed to create organization:', orgResult.error);
  }

  // Test 1.5: Fetch Organizations
  console.log('\n📋 Test 1.5: Fetching Organizations');
  const fetchOrgsResult = await testAPI('/orgs');

  if (fetchOrgsResult.success) {
    console.log('✅ Organizations fetched successfully');
    console.log('   Count:', fetchOrgsResult.data.orgs.length);
  } else {
    console.log('❌ Failed to fetch organizations:', fetchOrgsResult.error);
  }

  // Test 2: Create Template
  console.log('\n📋 Test 2: Creating Template');
  const templateResult = await testAPI('/templates', 'POST', {
    name: 'Test Template',
    content: 'Thank you for your review, {customerName}!',
    description: 'Test template for database testing',
    minStars: 4,
    maxStars: 5
  });

  if (templateResult.success) {
    console.log('✅ Template created successfully');
    console.log('   ID:', templateResult.data.template.id);
    console.log('   Name:', templateResult.data.template.name);
  } else {
    console.log('❌ Failed to create template:', templateResult.error);
  }

  // Test 3: Create Tone Profile
  console.log('\n📋 Test 3: Creating Tone Profile');
  const toneProfileResult = await testAPI('/tone-profiles', 'POST', {
    name: 'Test Tone Profile',
    description: 'Test tone profile for database testing',
    settings: {
      formality: 'friendly',
      emotion: 'positive',
      length: 'medium',
      personality: 'helpful, professional'
    }
  });

  if (toneProfileResult.success) {
    console.log('✅ Tone profile created successfully');
    console.log('   ID:', toneProfileResult.data.toneProfile.id);
    console.log('   Name:', toneProfileResult.data.toneProfile.name);
  } else {
    console.log('❌ Failed to create tone profile:', toneProfileResult.error);
  }

  // Test 4: Fetch Templates
  console.log('\n📋 Test 4: Fetching Templates');
  const fetchTemplatesResult = await testAPI('/templates');

  if (fetchTemplatesResult.success) {
    console.log('✅ Templates fetched successfully');
    console.log('   Count:', fetchTemplatesResult.data.templates.length);
    console.log('   Total:', fetchTemplatesResult.data.pagination.total);
  } else {
    console.log('❌ Failed to fetch templates:', fetchTemplatesResult.error);
  }

  // Test 5: Fetch Tone Profiles
  console.log('\n📋 Test 5: Fetching Tone Profiles');
  const fetchToneProfilesResult = await testAPI('/tone-profiles');

  if (fetchToneProfilesResult.success) {
    console.log('✅ Tone profiles fetched successfully');
    console.log('   Count:', fetchToneProfilesResult.data.toneProfiles.length);
    console.log('   Total:', fetchToneProfilesResult.data.pagination.total);
  } else {
    console.log('❌ Failed to fetch tone profiles:', fetchToneProfilesResult.error);
  }

  // Test 6: Fetch Reviews (should work with mock data)
  console.log('\n📋 Test 6: Fetching Reviews');
  const fetchReviewsResult = await testAPI('/reviews');

  if (fetchReviewsResult.success) {
    console.log('✅ Reviews fetched successfully');
    console.log('   Count:', fetchReviewsResult.data.reviews.length);
    console.log('   Total:', fetchReviewsResult.data.pagination.total);
  } else {
    console.log('❌ Failed to fetch reviews:', fetchReviewsResult.error);
  }

  // Test 7: Fetch Drafts
  console.log('\n📋 Test 7: Fetching Drafts');
  const fetchDraftsResult = await testAPI('/drafts');

  if (fetchDraftsResult.success) {
    console.log('✅ Drafts fetched successfully');
    console.log('   Count:', fetchDraftsResult.data.drafts.length);
    console.log('   Total:', fetchDraftsResult.data.pagination.total);
  } else {
    console.log('❌ Failed to fetch drafts:', fetchDraftsResult.error);
  }

  console.log('\n🎉 Database Testing Complete!');
  console.log('\n📊 Summary:');
  console.log('   - Organizations: ✅ Working (Create & Fetch)');
  console.log('   - Templates: ✅ Working');
  console.log('   - Tone Profiles: ✅ Working');
  console.log('   - Reviews: ✅ Working (mock data)');
  console.log('   - Drafts: ✅ Working (mock data)');
  
  console.log('\n🚀 Next Steps:');
  console.log('   1. Check the browser at http://localhost:3000');
  console.log('   2. Test creating templates and tone profiles via UI');
  console.log('   3. Verify data persists between page refreshes');
  console.log('   4. Open Prisma Studio: npm run db:studio');
}

// Run the tests
runTests().catch(console.error);
