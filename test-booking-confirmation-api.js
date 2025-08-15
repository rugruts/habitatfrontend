// Test booking confirmation API endpoint
const API_URL = 'http://localhost:3001/api/email';
const API_KEY = 'habitat_lobby_secure_api_key_2024';

// Test booking data
const testBooking = {
  id: '4031CCE3-api-test',
  customer_name: 'API Test User',
  customer_email: 'theo.matrapilias@outlook.com',
  check_in: '2024-08-15',
  check_out: '2024-08-18',
  guests: 2,
  total_amount: 220.00,
  properties: {
    name: 'Apartment 1 - with View'
  }
};

async function testBookingConfirmationAPI() {
  console.log('📧 Testing Booking Confirmation API...');
  console.log('Booking ID:', testBooking.id);
  console.log('Customer:', testBooking.customer_name);
  console.log('Email:', testBooking.customer_email);
  
  try {
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

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      return;
    }

    const result = await response.json();
    
    console.log('✅ Booking confirmation API test successful!');
    console.log('   Message ID:', result.messageId);
    console.log('   To:', result.to);
    console.log('   Subject:', result.subject);
    
    console.log('\n📬 Check your email inbox for the booking confirmation!');
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testBookingConfirmationAPI();
