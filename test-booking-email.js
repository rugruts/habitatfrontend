// Test booking confirmation email specifically
const API_URL = 'http://localhost:3001/api/email';
const API_KEY = 'habitat_lobby_secure_api_key_2024';

async function testBookingConfirmationEmail() {
  console.log('🧪 Testing Booking Confirmation Email...\n');

  // Sample booking data (similar to what would be created)
  const sampleBooking = {
    id: '6398bd0f-7f52-44fa-9032-e65e28221591', // The booking ID from your test
    customer_name: 'Theodoros Matrapilias',
    customer_email: 'theo.matrapilias@outlook.com',
    check_in: '2024-08-15',
    check_out: '2024-08-18',
    guests: 2,
    total_amount: 220.00,
    properties: {
      name: 'Apartment 1 - with View',
      address: 'Thessaloniki, Greece'
    }
  };

  try {
    console.log('📧 Sending booking confirmation email...');
    console.log('Booking ID:', sampleBooking.id);
    console.log('Customer:', sampleBooking.customer_name);
    console.log('Email:', sampleBooking.customer_email);
    console.log('');

    const response = await fetch(`${API_URL}/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        booking: sampleBooking
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Booking confirmation email sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('   To:', result.to);
      console.log('   Subject:', result.subject);
      console.log('');
      console.log('📬 Check your email inbox for the booking confirmation!');
    } else {
      const errorData = await response.json();
      console.log('❌ Booking confirmation email failed:', errorData.error);
    }

  } catch (error) {
    console.log('❌ Error testing booking confirmation:', error.message);
  }

  console.log('\n🔍 Next steps:');
  console.log('1. Check your email inbox');
  console.log('2. If email arrived, the backend is working');
  console.log('3. If not, check backend logs for errors');
  console.log('4. Check frontend console for errors during booking');
}

// Run the test
testBookingConfirmationEmail();
