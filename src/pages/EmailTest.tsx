import React, { useState } from 'react';
import { emailService } from '../lib/email-service';

const EmailTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    connection?: { success: boolean; error?: string };
    booking?: { success: boolean; error?: string; messageId?: string };
  }>({});
  const [loading, setLoading] = useState<{
    connection: boolean;
    booking: boolean;
  }>({ connection: false, booking: false });

  const testConnection = async () => {
    setLoading(prev => ({ ...prev, connection: true }));
    try {
      const result = await emailService.testConnection();
      setTestResults(prev => ({ ...prev, connection: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        connection: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, connection: false }));
    }
  };

  const testBookingConfirmation = async () => {
    setLoading(prev => ({ ...prev, booking: true }));
    try {
      // Use a test booking ID - you can replace this with a real booking ID from your database
      const testBookingId = '6398bd0f-7f52-44fa-9032-e65e28221591';
      const result = await emailService.sendBookingConfirmation(testBookingId);
      setTestResults(prev => ({ ...prev, booking: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        booking: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            📧 Email Service Test
          </h1>
          
          <div className="space-y-8">
            {/* Connection Test */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🔗 Backend API Connection Test
              </h2>
              <p className="text-gray-600 mb-4">
                Test the connection to the backend email API.
              </p>
              
              <button
                onClick={testConnection}
                disabled={loading.connection}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.connection ? '🔄 Testing...' : 'Test API Connection'}
              </button>

              {testResults.connection && (
                <div className={`mt-4 p-4 rounded-lg ${
                  testResults.connection.success 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {testResults.connection.success ? (
                    <div>
                      <div className="font-semibold">✅ Connection Successful!</div>
                      <div className="text-sm mt-1">Backend API is working properly.</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold">❌ Connection Failed</div>
                      <div className="text-sm mt-1">{testResults.connection.error}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Booking Confirmation Test */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📧 Booking Confirmation Email Test
              </h2>
              <p className="text-gray-600 mb-4">
                Send a test booking confirmation email to theo.matrapilias@outlook.com
              </p>
              
              <button
                onClick={testBookingConfirmation}
                disabled={loading.booking}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.booking ? '🔄 Sending...' : 'Send Test Booking Email'}
              </button>

              {testResults.booking && (
                <div className={`mt-4 p-4 rounded-lg ${
                  testResults.booking.success 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {testResults.booking.success ? (
                    <div>
                      <div className="font-semibold">✅ Email Sent Successfully!</div>
                      <div className="text-sm mt-1">
                        Message ID: {testResults.booking.messageId}
                      </div>
                      <div className="text-sm mt-1">
                        📬 Check your inbox: theo.matrapilias@outlook.com
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold">❌ Email Failed</div>
                      <div className="text-sm mt-1">{testResults.booking.error}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🎯 Testing Instructions
              </h3>
              <ol className="list-decimal list-inside text-blue-800 space-y-1">
                <li>First, test the API connection to ensure backend is working</li>
                <li>Then, send a test booking confirmation email</li>
                <li>Check your email inbox for the confirmation email</li>
                <li>If both work, the email system is ready for production!</li>
              </ol>
            </div>

            {/* Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📊 System Status
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Backend API:</span>
                  <span className="ml-2">http://localhost:3001</span>
                </div>
                <div>
                  <span className="font-medium">Frontend:</span>
                  <span className="ml-2">http://localhost:8081</span>
                </div>
                <div>
                  <span className="font-medium">SMTP Service:</span>
                  <span className="ml-2">Hostinger SMTP</span>
                </div>
                <div>
                  <span className="font-medium">Email From:</span>
                  <span className="ml-2">info@theonicurse.xyz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;
