// ========================================
// SUPABASE CONNECTION TEST
// ========================================
// Run this in browser console or Node.js to test

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yjzkkhbjtguwxgkyzmqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqemtraGJqdGd1d3hna3l6bXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODExMDQsImV4cCI6MjA5MzM1NzEwNH0.NGSjene9fDMOmYIQUNlq2209CtXbawiZeC0qrT99X84',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('articles').select('count');
    if (error) {
      console.error('❌ Connection failed:', error);
      return;
    }
    console.log('✅ Connection successful');
    
    // Test 2: Check if tables exist
    console.log('\n2. Checking table existence...');
    const tables = ['articles', 'contact_submissions', 'tax_calculator_history', 'site_content', 'web_vitals'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count');
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`);
        } else {
          console.log(`✅ Table '${table}': Exists`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`);
      }
    }
    
    // Test 3: Authentication test
    console.log('\n3. Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'jadtraconsulting@gmail.com',
      password: 'Jadtra123!!'
    });
    
    if (authError) {
      console.error('❌ Auth failed:', authError.message);
    } else {
      console.log('✅ Authentication successful');
      console.log('User:', authData.user?.email);
    }
    
    // Test 4: RLS policies test
    console.log('\n4. Testing RLS policies...');
    if (authData?.user) {
      const { data: articlesData, error: articlesError } = await supabase.from('articles').select('*');
      if (articlesError) {
        console.log('❌ RLS Articles:', articlesError.message);
      } else {
        console.log(`✅ RLS Articles: ${articlesData?.length || 0} records`);
      }
      
      const { data: siteData, error: siteError } = await supabase.from('site_content').select('*');
      if (siteError) {
        console.log('❌ RLS Site Content:', siteError.message);
      } else {
        console.log(`✅ RLS Site Content: ${siteData?.length || 0} records`);
      }
    }
    
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

// Run test
testConnection();
