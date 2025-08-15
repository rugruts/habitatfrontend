// Test frontend email service directly
const API_URL = 'http://localhost:3001/api/email';
const API_KEY = 'habitat_lobby_secure_api_key_2024';

// Test booking data
const testBooking = {
  id: '4031CCE3-frontend-test',
  customer_name: 'Frontend Test User',
  customer_email: 'theo.matrapilias@outlook.com',
  check_in: '2024-08-15',
  check_out: '2024-08-18',
  guests: 2,
  total_amount: 220.00,
  properties: {
    name: 'Apartment 1 - with View'
  }
};

async function testFrontendEmailService() {
  console.log('🧪 Testing Frontend Email Service...');
  
  try {
    console.log('📧 Sending booking confirmation email...');
    console.log('Booking ID:', testBooking.id);
    console.log('Customer:', testBooking.customer_name);
    console.log('Email:', testBooking.customer_email);
    
    const response = await fetch(`${API_URL}/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        booking: testBooking
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ Frontend email service test successful!');
    console.log('   Message ID:', result.messageId);
    console.log('   To:', result.to);
    console.log('   Subject:', result.subject);
    
    console.log('\n📬 Check your email inbox for the booking confirmation!');
    
  } catch (error) {
    console.error('❌ Frontend email service test failed:', error.message);
  }
}

// Run the test
testFrontendEmailService();
