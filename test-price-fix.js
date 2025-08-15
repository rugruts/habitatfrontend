// Test price fix in email template
const API_URL = 'http://localhost:3001/api/email';
const API_KEY = 'habitat_lobby_secure_api_key_2024';

// Test booking data with amount in cents
const testBooking = {
  id: 'PRICE-FIX-TEST',
  customer_name: 'Price Fix Test',
  customer_email: 'theo.matrapilias@outlook.com',
  check_in: '2024-08-15',
  check_out: '2024-08-18',
  guests: 2,
  total_amount: 31500, // 31500 cents = €315.00
  properties: {
    name: 'Apartment 1 - with View'
  }
};

async function testPriceFix() {
  console.log('💰 Testing Price Fix in Email Template...');
  console.log('Booking amount (cents):', testBooking.total_amount);
  console.log('Expected email amount: €315.00');
  
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ Price fix test email sent successfully!');
    console.log('   Message ID:', result.messageId);
    console.log('   To:', result.to);
    console.log('   Subject:', result.subject);
    
    console.log('\n📧 Check your email inbox!');
    console.log('💰 The email should now show: €315.00 (not €31500.00)');
    
  } catch (error) {
    console.error('❌ Price fix test failed:', error.message);
  }
}

testPriceFix();
