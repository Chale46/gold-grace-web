// ========================================
// SPECIFIC UID LOGIN TEST
// ========================================
// Test login with UID: 972f3585-93b2-4308-b26e-df3ed5a55543

const SUPABASE_URL = 'https://yjzkkhbjtguwxgkyzmqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqemtraGJqdGd1d3hna3l6bXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODExMDQsImV4cCI6MjA5MzM1NzEwNH0.NGSjene9fDMOmYIQUNlq2209CtXbawiZeC0qrT99X84';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSpecificUID() {
  console.log('🔍 Testing UID: 972f3585-93b2-4308-b26e-df3ed5a55543');
  
  try {
    // Test 1: Check if user exists
    console.log('\n1. Checking if user exists...');
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById('972f3585-93b2-4308-b26e-df3ed5a55543');
    
    if (userError) {
      console.log('❌ User check failed:', userError.message);
      console.log('💡 This means either:');
      console.log('   - User does not exist');
      console.log('   - Admin API not accessible (needs service role key)');
    } else {
      console.log('✅ User found:', userData.user?.email);
    }
    
    // Test 2: Try login with jadtraconsulting@gmail.com
    console.log('\n2. Testing login with jadtraconsulting@gmail.com...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'jadtraconsulting@gmail.com',
      password: 'Jadtra123!!'
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      console.log('💡 Possible reasons:');
      console.log('   - User does not exist');
      console.log('   - Wrong password');
      console.log('   - Email not confirmed');
    } else {
      console.log('✅ Login successful!');
      console.log('User ID:', loginData.user?.id);
      console.log('Email:', loginData.user?.email);
      console.log('UID Match:', loginData.user?.id === '972f3585-93b2-4308-b26e-df3ed5a55543' ? '✅ YES' : '❌ NO');
      
      // Test 3: Access data after login
      console.log('\n3. Testing data access...');
      
      const { data: articles, error: articlesError } = await supabase.from('articles').select('*');
      if (articlesError) {
        console.log('❌ Articles access:', articlesError.message);
      } else {
        console.log(`✅ Articles: ${articles?.length || 0} records`);
      }
      
      const { data: siteContent, error: siteError } = await supabase.from('site_content').select('*');
      if (siteError) {
        console.log('❌ Site content access:', siteError.message);
      } else {
        console.log(`✅ Site content: ${siteContent?.length || 0} records`);
      }
      
      // Sign out
      await supabase.auth.signOut();
    }
    
  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

// Alternative: Create user with specific UID if needed
async function createUserWithSpecificUID() {
  console.log('\n🔧 Creating user with specific UID...');
  
  try {
    // This would need admin privileges - run in Supabase SQL Editor instead:
    console.log('💡 To create user with specific UID, run this SQL in Supabase:');
    console.log(`
INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '972f3585-93b2-4308-b26e-df3ed5a55543',
    'authenticated',
    'authenticated',
    'jadtraconsulting@gmail.com',
    crypt('Jadtra123!!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);
    `);
  } catch (err) {
    console.error('❌ Create user error:', err.message);
  }
}

// Run tests
testSpecificUID();
createUserWithSpecificUID();
