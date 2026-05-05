// ========================================
// ADMIN ROUTES VERIFICATION
// ========================================
// Test all admin routes on jadtraconsulting.com

console.log('🔍 Testing Admin Routes: jadtraconsulting.com/admin/*');

const adminRoutes = [
  '/admin',
  '/admin/login', 
  '/admin/setup',
  '/admin/dashboard',
  '/admin/articles',
  '/admin/content'
];

async function testAdminRoutes() {
  const results = {};
  
  for (const route of adminRoutes) {
    console.log(`\n📍 Testing: ${route}`);
    
    try {
      // Test route accessibility
      const response = await fetch(`https://jadtraconsulting.com${route}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const status = response.status;
      const contentType = response.headers.get('content-type');
      
      console.log(`   Status: ${status}`);
      console.log(`   Content-Type: ${contentType}`);
      
      // Analyze response
      let analysis = '';
      if (status === 200) {
        analysis = '✅ Route accessible';
      } else if (status === 302 || status === 301) {
        analysis = '🔄 Redirect (expected for protected routes)';
      } else if (status === 404) {
        analysis = '❌ Route not found';
      } else if (status === 500) {
        analysis = '❌ Server error';
      } else {
        analysis = `⚠️ Unexpected status: ${status}`;
      }
      
      results[route] = {
        status,
        contentType,
        analysis,
        accessible: status === 200 || status === 302 || status === 301
      };
      
      console.log(`   Analysis: ${analysis}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results[route] = {
        status: 'ERROR',
        error: error.message,
        analysis: '❌ Network error',
        accessible: false
      };
    }
  }
  
  // Summary
  console.log('\n📊 ADMIN ROUTES SUMMARY:');
  console.log('========================');
  
  const accessible = Object.values(results).filter(r => r.accessible).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Accessible: ${accessible}/${total} routes`);
  
  if (accessible === total) {
    console.log('🎉 All admin routes are working!');
  } else {
    console.log('⚠️ Some routes need attention:');
    
    Object.entries(results).forEach(([route, result]) => {
      if (!result.accessible) {
        console.log(`   ❌ ${route}: ${result.analysis}`);
      }
    });
  }
  
  // Specific route expectations
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('/admin → Redirect to /admin/login');
  console.log('/admin/login → Login page (200)');
  console.log('/admin/setup → Setup page (200)');
  console.log('/admin/dashboard → Redirect to login if not authenticated');
  console.log('/admin/articles → Redirect to login if not authenticated');
  console.log('/admin/content → Redirect to login if not authenticated');
  
  return results;
}

// Test login flow
async function testLoginFlow() {
  console.log('\n🔐 Testing Login Flow...');
  
  try {
    // Step 1: Visit login page
    console.log('1. Accessing login page...');
    const loginResponse = await fetch('https://jadtraconsulting.com/admin/login');
    console.log(`   Status: ${loginResponse.status}`);
    
    if (loginResponse.status === 200) {
      console.log('✅ Login page accessible');
    } else {
      console.log('❌ Login page not accessible');
      return;
    }
    
    // Step 2: Test login credentials
    console.log('2. Testing login credentials...');
    
    // This would need to be done manually in browser
    console.log('💡 Manual test required:');
    console.log('   - Go to: https://jadtraconsulting.com/admin/login');
    console.log('   - Email: jadtraconsulting@gmail.com');
    console.log('   - Password: Jadtra123!!');
    console.log('   - Should redirect to /admin/dashboard');
    
  } catch (error) {
    console.log(`❌ Login flow error: ${error.message}`);
  }
}

// Run all tests
testAdminRoutes();
testLoginFlow();
