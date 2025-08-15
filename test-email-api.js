// Simple test script to verify email API is working
const API_URL = 'http://localhost:3001/api/email';
const API_KEY = 'habitat_lobby_secure_api_key_2024';

async function testEmailAPI() {
  console.log('🧪 Testing Email API...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: SMTP Connection
  try {
    console.log('\n2. Testing SMTP connection...');
    const connectionResponse = await fetch(`${API_URL}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    
    if (connectionResponse.ok) {
      const connectionData = await connectionResponse.json();
      console.log('✅ SMTP connection:', connectionData.message || 'Success');
    } else {
      const errorData = await connectionResponse.json();
      console.log('❌ SMTP connection failed:', errorData.error);
    }
  } catch (error) {
    console.log('❌ SMTP connection test failed:', error.message);
  }

  // Test 3: Send Test Email
  try {
    console.log('\n3. Testing email sending...');
    const emailResponse = await fetch(`${API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        to: 'theo.matrapilias@outlook.com', // Your email
        subject: 'Test Email from Habitat Lobby API',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px;">
              <h1>🎉 Email API Test Successful!</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px;">
              <p>This email was sent from the Habitat Lobby backend API using Hostinger SMTP.</p>
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>✅ Backend API: Running on port 3001</li>
                <li>✅ SMTP: Hostinger configuration</li>
                <li>✅ Email Service: Fully functional</li>
                <li>✅ Time: ${new Date().toLocaleString()}</li>
              </ul>
              <p>The email system is ready for production! 🚀</p>
            </div>
          </div>
        `
      })
    });
    
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      console.log('✅ Email sent successfully!');
      console.log('   Message ID:', emailData.messageId);
      console.log('   Check your inbox: theo.matrapilias@outlook.com');
    } else {
      const errorData = await emailResponse.json();
      console.log('❌ Email sending failed:', errorData.error);
    }
  } catch (error) {
    console.log('❌ Email sending test failed:', error.message);
  }

  console.log('\n🏁 Email API testing complete!');
  console.log('\nNext steps:');
  console.log('1. Check your email inbox for the test email');
  console.log('2. Make a test booking on the frontend');
  console.log('3. Verify booking confirmation emails are sent');
}

// Run the test
testEmailAPI();
