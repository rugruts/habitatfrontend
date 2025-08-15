import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { emailService } from '@/lib/email-service';
import { Mail, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const EmailTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus(null);
    
    try {
      const result = await emailService.testConnection();
      setConnectionStatus({
        success: result.success,
        message: result.success ? 'SMTP connection successful!' : result.error || 'Connection failed'
      });
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      setResult({ success: false, message: 'Please enter an email address' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const emailResult = await emailService.sendEmail({
        to: testEmail,
        toName: 'Test User',
        subject: 'Test Email from Habitat Lobby',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1>🏠 Habitat Lobby</h1>
              <p>Email Service Test</p>
            </div>
            <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
              <h2>Test Email Successful!</h2>
              <p>This is a test email to verify that the Hostinger SMTP email service is working correctly.</p>
              <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
              <p>If you received this email, the email service is configured properly! 🎉</p>
            </div>
          </div>
        `,
        metadata: { type: 'test_email' }
      });

      setResult({
        success: emailResult.success,
        message: emailResult.success 
          ? `Test email sent successfully! Message ID: ${emailResult.messageId}`
          : emailResult.error || 'Failed to send test email'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Test
          </CardTitle>
          <CardDescription>
            Test the Hostinger SMTP email service configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Test */}
          <div className="space-y-2">
            <Label>SMTP Connection Test</Label>
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Test SMTP Connection
            </Button>
            
            {connectionStatus && (
              <Alert className={connectionStatus.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {connectionStatus.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={connectionStatus.success ? 'text-green-800' : 'text-red-800'}>
                    {connectionStatus.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          {/* Test Email */}
          <div className="space-y-2">
            <Label htmlFor="testEmail">Send Test Email</Label>
            <div className="flex gap-2">
              <Input
                id="testEmail"
                type="email"
                placeholder="Enter email address to test"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={sendTestEmail} 
                disabled={isLoading || !testEmail}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Test
              </Button>
            </div>
            
            {result && (
              <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                    {result.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          {/* Configuration Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Development Mode:</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• Currently using simulated email service</p>
              <p>• Emails are logged but not actually sent</p>
              <p>• For production, integrate with:</p>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• EmailJS for client-side email sending</li>
                <li>• Custom backend with SMTP (Hostinger)</li>
                <li>• Supabase Edge Functions with email service</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
