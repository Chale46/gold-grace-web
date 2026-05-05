// ========================================
// SUPABASE API CONNECTION TEST
// ========================================
// Run this in browser console to test API connectivity

// Test configuration
const SUPABASE_URL = 'https://yjzkkhbjtguwxgkyzmqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqemtraGJqdGd1d3hna3l6bXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODExMDQsImV4cCI6MjA5MzM1NzEwNH0.NGSjene9fDMOmYIQUNlq2209CtXbawiZeC0qrT99X84';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAPIConnection() {
  console.log('🔍 Testing Supabase API Connection...');
  console.log('URL:', SUPABASE_URL);
  console.log('Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
  
  const results = {
    connection: false,
    tables: {},
    auth: false,
    rls: false,
    errors: []
  };
  
  try {
    // Test 1: Basic connection
    console.log('\n1. Testing basic connection...');
    try {
      const { data, error } = await supabase.from('articles').select('count');
      if (error) {
        console.error('❌ Connection failed:', error.message);
        results.errors.push(`Connection: ${error.message}`);
      } else {
        console.log('✅ Connection successful');
        results.connection = true;
      }
    } catch (err) {
      console.error('❌ Connection error:', err.message);
      results.errors.push(`Connection: ${err.message}`);
    }
    
    // Test 2: Check each table
    console.log('\n2. Testing table access...');
    const tables = ['articles', 'contact_submissions', 'tax_calculator_history', 'site_content', 'web_vitals'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count');
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`);
          results.tables[table] = false;
          results.errors.push(`Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table '${table}': Access OK`);
          results.tables[table] = true;
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`);
        results.tables[table] = false;
        results.errors.push(`Table ${table}: ${err.message}`);
      }
    }
    
    // Test 3: Authentication
    console.log('\n3. Testing authentication...');
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'jadtraconsulting@gmail.com',
        password: 'Jadtra123!!'
      });
      
      if (authError) {
        console.error('❌ Auth failed:', authError.message);
        results.auth = false;
        results.errors.push(`Auth: ${authError.message}`);
      } else {
        console.log('✅ Authentication successful');
        console.log('User:', authData.user?.email);
        results.auth = true;
        
        // Test 4: RLS policies (only if auth succeeded)
        console.log('\n4. Testing RLS policies...');
        try {
          const { data: articlesData, error: articlesError } = await supabase.from('articles').select('*');
          if (articlesError) {
            console.log('❌ RLS Articles:', articlesError.message);
            results.errors.push(`RLS Articles: ${articlesError.message}`);
          } else {
            console.log(`✅ RLS Articles: ${articlesData?.length || 0} records`);
          }
          
          const { data: siteData, error: siteError } = await supabase.from('site_content').select('*');
          if (siteError) {
            console.log('❌ RLS Site Content:', siteError.message);
            results.errors.push(`RLS Site Content: ${siteError.message}`);
          } else {
            console.log(`✅ RLS Site Content: ${siteData?.length || 0} records`);
          }
          
          results.rls = true;
        } catch (err) {
          console.error('❌ RLS test error:', err.message);
          results.errors.push(`RLS: ${err.message}`);
        }
        
        // Sign out after test
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('❌ Auth error:', err.message);
      results.auth = false;
      results.errors.push(`Auth: ${err.message}`);
    }
    
  } catch (err) {
    console.error('❌ Test failed:', err);
    results.errors.push(`General: ${err.message}`);
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log('==================');
  console.log(`✅ Connection: ${results.connection ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Tables: ${Object.values(results.tables).filter(t => t).length}/${Object.keys(results.tables).length} accessible`);
  console.log(`✅ Authentication: ${results.auth ? 'PASS' : 'FAIL'}`);
  console.log(`✅ RLS Policies: ${results.rls ? 'PASS' : 'FAIL'}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (!results.connection) {
    console.log('- Check Supabase URL and ANON_KEY');
    console.log('- Verify network connectivity');
  }
  if (Object.values(results.tables).some(t => !t)) {
    console.log('- Run DATABASE_SCHEMA.sql to create missing tables');
  }
  if (!results.auth) {
    console.log('- Verify user exists in Supabase Auth');
    console.log('- Check email/password credentials');
  }
  if (!results.rls) {
    console.log('- Run RLS_POLICIES.sql to configure permissions');
  }
  
  return results;
}

// Auto-run test
testAPIConnection();
