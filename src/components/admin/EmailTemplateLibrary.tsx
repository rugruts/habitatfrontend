import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Mail, 
  Eye, 
  Copy,
  Palette,
  Star,
  Clock,
  CheckCircle,
  CreditCard,
  Calendar,
  Heart
} from 'lucide-react';
import { EmailTemplate } from '@/services/EmailTemplateService';

interface TemplateLibraryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  icon: React.ReactNode;
  color: string;
  html: string;
}

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: EmailTemplate) => void;
}

const templateLibrary: TemplateLibraryItem[] = [
  {
    id: 'modern-confirmation',
    name: 'Modern Booking Confirmation',
    description: 'Clean, modern design with clear booking details and next steps',
    category: 'booking_confirmation',
    preview: '/api/placeholder/300/200',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-green-500',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .booking-card { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 30px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .label { font-weight: 600; color: #64748b; font-size: 14px; }
        .value { color: #1e293b; font-weight: 500; font-size: 16px; }
        .total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
        .footer { background-color: #1e293b; color: white; padding: 30px; text-align: center; }
        .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; font-weight: 600; transition: transform 0.2s; }
        .btn:hover { transform: translateY(-2px); }
        .next-steps { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px; }
        .icon { display: inline-block; margin-right: 8px; }
        @media (max-width: 600px) { .container { margin: 0; } .content { padding: 20px; } .detail-row { flex-direction: column; align-items: flex-start; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🎉 Booking Confirmed!</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">Thank you for choosing {{business_name}}</p>
        </div>
        
        <div class="content">
            <p style="font-size: 18px; color: #374151;">Dear <strong>{{customer_name}}</strong>,</p>
            <p style="font-size: 16px; color: #6b7280;">We're excited to confirm your booking! Your reservation has been successfully processed and you're all set for your stay.</p>
            
            <div class="booking-card">
                <h3 style="margin: 0 0 20px 0; color: #667eea; font-size: 24px; font-weight: 600;">{{property_name}}</h3>
                <div class="detail-row">
                    <span class="label">📋 Booking ID</span>
                    <span class="value">{{booking_id}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">📅 Check-in</span>
                    <span class="value">{{check_in}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">📅 Check-out</span>
                    <span class="value">{{check_out}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">👥 Guests</span>
                    <span class="value">{{guests}} {{guests > 1 ? 'people' : 'person'}}</span>
                </div>
            </div>
            
            <div class="total">
                <h3 style="margin: 0; font-size: 28px; font-weight: 700;">€{{total_amount}}</h3>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Total Amount</p>
            </div>
            
            <div class="next-steps">
                <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📋 What's Next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    <li>You'll receive check-in instructions 24 hours before arrival</li>
                    <li>Please have your ID ready for verification</li>
                    <li>Check-in time is 3:00 PM - 8:00 PM</li>
                    <li>Contact us if you need to arrive outside these hours</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{booking_url}}" class="btn">View Booking Details</a>
            </div>
            
            <p style="font-size: 16px; color: #6b7280;">We look forward to hosting you in beautiful Trikala! If you have any questions, please don't hesitate to contact us.</p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: 600;">{{business_name}}</p>
            <p style="margin: 0 0 5px 0; opacity: 0.8;">{{business_address}}</p>
            <p style="margin: 0; opacity: 0.8;">{{business_email}} | {{business_phone}}</p>
        </div>
    </div>
</body>
</html>`
  },
  {
    id: 'elegant-precheck',
    name: 'Elegant Pre-Arrival',
    description: 'Sophisticated pre-arrival email with detailed check-in instructions',
    category: 'pre_arrival',
    preview: '/api/placeholder/300/200',
    icon: <Clock className="h-5 w-5" />,
    color: 'bg-blue-500',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pre-Arrival Information</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .highlight { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
        .info-box { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .checklist { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 25px; margin: 25px 0; border-radius: 8px; }
        .footer { background-color: #1e293b; color: white; padding: 30px; text-align: center; }
        .btn { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; font-weight: 600; transition: transform 0.2s; }
        .btn:hover { transform: translateY(-2px); }
        .icon { display: inline-block; margin-right: 8px; }
        @media (max-width: 600px) { .container { margin: 0; } .content { padding: 20px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🗝️ Welcome to {{business_name}}</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">Your stay begins tomorrow!</p>
        </div>
        
        <div class="content">
            <p style="font-size: 18px; color: #374151;">Dear <strong>{{customer_name}}</strong>,</p>
            <p style="font-size: 16px; color: #6b7280;">We're thrilled that your stay at <strong>{{property_name}}</strong> is just around the corner! Here's everything you need to know for a smooth check-in experience.</p>
            
            <div class="highlight">
                <h3 style="margin: 0; font-size: 24px; font-weight: 600;">Check-in: {{check_in}} at 3:00 PM</h3>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Please arrive between 3:00 PM - 8:00 PM</p>
            </div>
            
            <div class="info-box">
                <h3 style="margin: 0 0 20px 0; color: #1e40af; font-size: 20px; font-weight: 600;">📍 Important Information</h3>
                <div style="margin: 15px 0;">
                    <strong style="color: #374151;">🏠 Property Address:</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">{{business_address}}</p>
                </div>
                <div style="margin: 15px 0;">
                    <strong style="color: #374151;">⏰ Check-in Time:</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">3:00 PM - 8:00 PM</p>
                </div>
                <div style="margin: 15px 0;">
                    <strong style="color: #374151;">⏰ Check-out Time:</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">11:00 AM</p>
                </div>
                <div style="margin: 15px 0;">
                    <strong style="color: #374151;">📞 Emergency Contact:</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">{{business_phone}}</p>
                </div>
            </div>
            
            <div class="checklist">
                <h3 style="margin: 0 0 20px 0; color: #059669; font-size: 20px; font-weight: 600;">✅ Pre-Arrival Checklist</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    <li style="margin: 10px 0;">Bring a valid ID for all guests</li>
                    <li style="margin: 10px 0;">Arrive between 3:00 PM - 8:00 PM</li>
                    <li style="margin: 10px 0;">Contact us if arriving outside check-in hours</li>
                    <li style="margin: 10px 0;">Review house rules and amenities</li>
                    <li style="margin: 10px 0;">Download any necessary apps for access</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{property_url}}" class="btn">View Property Details</a>
            </div>
            
            <p style="font-size: 16px; color: #6b7280;">We can't wait to welcome you to Trikala! If you have any questions before your arrival, please don't hesitate to reach out.</p>
            
            <p style="font-size: 16px; color: #374151; margin-top: 25px;">Best regards,<br><strong>The {{business_name}} Team</strong></p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: 600;">{{business_name}}</p>
            <p style="margin: 0 0 5px 0; opacity: 0.8;">{{business_email}} | {{business_phone}}</p>
        </div>
    </div>
</body>
</html>`
  },
  {
    id: 'post-checkout-review',
    name: 'Post-Checkout Review Request',
    description: 'Beautiful post-stay email with review request and return booking',
    category: 'post_stay',
    preview: '/api/placeholder/300/200',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-pink-500',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Stay</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .thank-you { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 16px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #fbcfe8; }
        .review-box { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0; }
        .btn { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; font-weight: 600; transition: transform 0.2s; }
        .btn:hover { transform: translateY(-2px); }
        .btn-secondary { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; font-weight: 600; transition: transform 0.2s; }
        .btn-secondary:hover { transform: translateY(-2px); }
        .footer { background-color: #1e293b; color: white; padding: 30px; text-align: center; }
        .stats { display: flex; justify-content: space-around; margin: 25px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 24px; font-weight: 700; color: #ec4899; }
        .stat-label { font-size: 14px; color: #6b7280; margin-top: 5px; }
        @media (max-width: 600px) { .container { margin: 0; } .content { padding: 20px; } .stats { flex-direction: column; gap: 15px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">💕 Thank You!</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">We hope you had an amazing stay</p>
        </div>
        
        <div class="content">
            <p style="font-size: 18px; color: #374151;">Dear <strong>{{customer_name}}</strong>,</p>
            
            <div class="thank-you">
                <h2 style="color: #be185d; margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">We Hope You Loved Your Stay!</h2>
                <p style="font-size: 16px; color: #6b7280; margin: 0;">Thank you for choosing <strong>{{property_name}}</strong> for your recent visit to Trikala. We hope you created wonderful memories during your {{guests}}-guest stay from {{check_in}} to {{check_out}}.</p>
            </div>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">{{guests}}</div>
                    <div class="stat-label">Guests</div>
                </div>
                <div class="stat">
                    <div class="stat-number">€{{total_amount}}</div>
                    <div class="stat-label">Total Spent</div>
                </div>
                <div class="stat">
                    <div class="stat-number">⭐</div>
                    <div class="stat-label">Your Rating</div>
                </div>
            </div>
            
            <p style="font-size: 16px; color: #6b7280;">Your experience matters to us, and we'd love to hear about your stay. Your feedback helps us improve and helps future guests discover what makes our place special.</p>
            
            <div class="review-box">
                <h3 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Share Your Experience</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Would you mind taking a moment to leave us a review?</p>
                <a href="{{review_url}}" class="btn">Leave a Review ⭐</a>
            </div>
            
            <p style="font-size: 16px; color: #6b7280;">We'd also love to welcome you back anytime! As a returning guest, you'll always have a special place in our hearts.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{property_url}}" class="btn">Book Again</a>
                <a href="{{booking_url}}" class="btn-secondary">View Your Booking</a>
            </div>
            
            <p style="font-size: 16px; color: #6b7280;">Thank you again for choosing {{business_name}}. We hope to see you again soon!</p>
            
            <p style="font-size: 16px; color: #374151; margin-top: 25px;">With warm regards,<br><strong>The {{business_name}} Team</strong></p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: 600;">{{business_name}}</p>
            <p style="margin: 0 0 5px 0; opacity: 0.8;">{{business_address}}</p>
            <p style="margin: 0; opacity: 0.8;">{{business_email}} | {{business_phone}}</p>
        </div>
    </div>
</body>
</html>`
  }
];

export const EmailTemplateLibrary: React.FC<TemplateLibraryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const categories = [
    { id: 'booking_confirmation', name: 'Booking Confirmation', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'pre_arrival', name: 'Pre-Arrival', icon: <Clock className="h-4 w-4" /> },
    { id: 'post_stay', name: 'Post-Stay', icon: <Heart className="h-4 w-4" /> },
    { id: 'payment_reminder', name: 'Payment Reminder', icon: <CreditCard className="h-4 w-4" /> },
  ];

  const handleSelectTemplate = (template: TemplateLibraryItem) => {
    onSelectTemplate({
      id: '',
      name: template.name,
      subject: `${template.name} - {{property_name}}`,
      content: template.html,
      template_type: template.category as EmailTemplate['template_type'],
      is_active: true,
      variables: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Email Template Library
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templateLibrary.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${template.color} text-white`}>
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {categories.find(c => c.id === template.category)?.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Template Preview */}
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Preview:</div>
                      <div 
                        className="text-sm bg-white p-3 rounded border max-h-32 overflow-hidden"
                        dangerouslySetInnerHTML={{ 
                          __html: template.html.substring(0, 200) + '...' 
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
