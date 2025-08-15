// Test API key validation
const API_URL = 'http://localhost:3001/api/email';

async function testApiKey() {
  console.log('🔑 Testing API Key Validation...');
  
  // Test 1: Correct API key
  try {
    console.log('\n1. Testing with correct API key...');
    const response1 = await fetch(`${API_URL}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'habitat_lobby_secure_api_key_2024'
      }
    });
    
    const result1 = await response1.json();
    console.log('Response:', response1.status, result1);
    
  } catch (error) {
    console.error('Error with correct API key:', error.message);
  }
  
  // Test 2: Wrong API key
  try {
    console.log('\n2. Testing with wrong API key...');
    const response2 = await fetch(`${API_URL}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'wrong_key'
      }
    });
    
    const result2 = await response2.json();
    console.log('Response:', response2.status, result2);
    
  } catch (error) {
    console.error('Error with wrong API key:', error.message);
  }
  
  // Test 3: No API key
  try {
    console.log('\n3. Testing with no API key...');
    const response3 = await fetch(`${API_URL}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result3 = await response3.json();
    console.log('Response:', response3.status, result3);
    
  } catch (error) {
    console.error('Error with no API key:', error.message);
  }
}

testApiKey();
