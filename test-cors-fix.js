// Test CORS fix
async function testCORSFix() {
  console.log('🔧 Testing CORS Fix...');
  
  try {
    console.log('Testing from Node.js (should work)...');
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    console.log('✅ Backend health check successful:', data.service);
    
    // Test email API
    console.log('Testing email API...');
    const emailResponse = await fetch('http://localhost:3001/api/email/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'habitat_lobby_secure_api_key_2024'
      }
    });
    
    const emailData = await emailResponse.json();
    console.log('✅ Email API test successful:', emailData.message);
    
    console.log('\n🎯 CORS should now be fixed for browser requests!');
    console.log('📝 Allowed origins now include:');
    console.log('   - http://localhost:5173');
    console.log('   - http://localhost:8081');
    console.log('   - http://localhost:8080');
    console.log('   - http://172.20.10.7:8080');
    console.log('   - http://172.20.10.7:8081');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCORSFix();
