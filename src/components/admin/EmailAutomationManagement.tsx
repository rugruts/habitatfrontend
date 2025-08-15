import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '@/lib/supabase';
import { emailService } from '@/lib/email-service';
import { emailTemplateService, EmailTemplate as RealEmailTemplate } from '@/services/EmailTemplateService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Send, 
  Clock, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Play,
  Pause,
  RefreshCw,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Download
} from 'lucide-react';

// Use the real EmailTemplate interface from the service
type EmailTemplate = RealEmailTemplate;

interface EmailAutomation {
  id: string;
  name: string;
  template_id: string;
  trigger_type: 'booking_created' | 'check_in_approaching' | 'id_missing' | 'check_out_completed';
  trigger_delay: number; // hours
  is_active: boolean;
  conditions?: {
    booking_status?: string[];
    property_ids?: string[];
  };
  created_at: string;
}

interface EmailLog {
  id: string;
  template_id: string;
  template_name: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending' | 'scheduled';
  sent_at?: string;
  scheduled_for?: string;
  error_message?: string;
  booking_id?: string;
}

const EmailAutomationManagement: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [selectedAutomation, setSelectedAutomation] = useState<EmailAutomation | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showAutomationDialog, setShowAutomationDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editingAutomation, setEditingAutomation] = useState<EmailAutomation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [resending, setResending] = useState<string | null>(null);

  const [templateForm, setTemplateForm] = useState<{
    name: string;
    subject: string;
    content: string;
    type: 'booking_confirmation' | 'pre_arrival' | 'id_reminder' | 'post_stay' | 'custom';
    is_active: boolean;
  }>({
    name: '',
    subject: '',
    content: '',
    type: 'custom',
    is_active: true
  });

  const [automationForm, setAutomationForm] = useState<{
    name: string;
    template_id: string;
    trigger_type: 'booking_created' | 'check_in_approaching' | 'id_missing' | 'check_out_completed';
    trigger_delay: number;
    is_active: boolean;
  }>({
    name: '',
    template_id: '',
    trigger_type: 'booking_created',
    trigger_delay: 0,
    is_active: true
  });

  const [testEmailForm, setTestEmailForm] = useState({
    template_id: '',
    recipient_email: '',
    recipient_name: 'Test Guest'
  });

  const templateTypes = [
    { value: 'booking_confirmation', label: 'Booking Confirmation' },
    { value: 'pre_arrival', label: 'Pre-Arrival Instructions' },
    { value: 'id_reminder', label: 'ID Verification Reminder' },
    { value: 'post_stay', label: 'Post-Stay Thank You' },
    { value: 'custom', label: 'Custom Template' }
  ];

  const triggerTypes = [
    { value: 'booking_created', label: 'Booking Created', delay: 0 },
    { value: 'check_in_approaching', label: 'Check-in Approaching', delay: 48 },
    { value: 'id_missing', label: 'ID Verification Missing', delay: 24 },
    { value: 'check_out_completed', label: 'Check-out Completed', delay: 24 }
  ];

  const availableVariables = [
    '{{guest_name}}',
    '{{guest_email}}',
    '{{property_name}}',
    '{{check_in_date}}',
    '{{check_out_date}}',
    '{{booking_id}}',
    '{{total_amount}}',
    '{{guests_count}}',
    '{{host_name}}',
    '{{host_phone}}',
    '{{property_address}}'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock template data
      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Booking Confirmation',
          subject: 'Your booking at {{property_name}} is confirmed!',
          content: `Dear {{guest_name}},

Thank you for booking with Habitat Lobby! Your reservation is confirmed.

Booking Details:
- Property: {{property_name}}
- Check-in: {{check_in_date}}
- Check-out: {{check_out_date}}
- Guests: {{guests_count}}
- Total: {{total_amount}}

We'll send you pre-arrival instructions 48 hours before your check-in.

Best regards,
{{host_name}}`,
          type: 'booking_confirmation',
          is_active: true,
          variables: ['guest_name', 'property_name', 'check_in_date', 'check_out_date', 'guests_count', 'total_amount', 'host_name'],
          created_at: '2024-08-01T10:00:00Z',
          last_modified: '2024-08-05T14:30:00Z'
        },
        {
          id: '2',
          name: 'Pre-Arrival Instructions',
          subject: 'Your stay at {{property_name}} starts tomorrow!',
          content: `Dear {{guest_name}},

Your stay at {{property_name}} begins tomorrow! Here are your check-in instructions:

Check-in Details:
- Time: 3:00 PM onwards
- Address: {{property_address}}
- Contact: {{host_phone}}

Important: Please upload your ID document if you haven't already.

Looking forward to hosting you!

{{host_name}}`,
          type: 'pre_arrival',
          is_active: true,
          variables: ['guest_name', 'property_name', 'property_address', 'host_phone', 'host_name'],
          created_at: '2024-08-01T10:00:00Z',
          last_modified: '2024-08-03T16:45:00Z'
        }
      ];





      // Fetch real data from EmailTemplateService
      const fetchedTemplates = await emailTemplateService.getAllTemplates();
      const fetchedLogs = await emailTemplateService.getEmailLogs(50, 0);

      console.log('📧 Fetched email templates:', fetchedTemplates);
      setTemplates(fetchedTemplates);

      setEmailLogs(fetchedLogs || []);

      // Generate automations based on real templates
      const generatedAutomations: EmailAutomation[] = fetchedTemplates
        .filter(t => t.is_active)
        .slice(0, 4)
        .map((template, index) => ({
          id: `auto_${index + 1}`,
          name: `Send ${template.name}`,
          template_id: template.id,
          trigger_type: (['booking_created', 'check_in_approaching', 'id_missing', 'check_out_completed'] as const)[index],
          trigger_delay: [0, 48, 72, 24][index],
          is_active: true,
          created_at: template.created_at
        }));

      setAutomations(generatedAutomations);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to empty arrays on error
      setTemplates([]);
      setAutomations([]);
      setEmailLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (emailLogId: string) => {
    try {
      setResending(emailLogId);
      console.log('🔄 Resending email:', emailLogId);

      const result = await emailTemplateService.resendEmail(emailLogId);

      if (result.success) {
        alert('✅ Email resent successfully!');
        // Refresh the email logs to show the new resend entry
        await fetchData();
      } else {
        alert(`❌ Failed to resend email: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error resending email:', error);
      alert('Failed to resend email. Please try again.');
    } finally {
      setResending(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getTypeLabel = (type: string) => {
    const typeObj = templateTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getTriggerLabel = (triggerType: string) => {
    const triggerObj = triggerTypes.find(t => t.value === triggerType);
    return triggerObj ? triggerObj.label : triggerType;
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        // Update existing template
        await emailTemplateService.updateTemplate({
          id: editingTemplate.id,
          name: templateForm.name,
          subject: templateForm.subject,
          content: templateForm.content,
          type: templateForm.type as EmailTemplate['type'],
          variables: emailTemplateService.extractVariables(templateForm.content)
        });
        console.log('✅ Template updated successfully');
      } else {
        // Create new template
        await emailTemplateService.createTemplate({
          name: templateForm.name,
          subject: templateForm.subject,
          content: templateForm.content,
          type: templateForm.type as EmailTemplate['type'],
          variables: emailTemplateService.extractVariables(templateForm.content)
        });
        console.log('✅ Template created successfully');
      }

      setShowTemplateDialog(false);
      setEditingTemplate(null);
      resetTemplateForm();
      await fetchData();
    } catch (error) {
      console.error('❌ Error saving template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
        await emailTemplateService.deleteTemplate(templateId);
        console.log('✅ Template deleted successfully');
        await fetchData();
      }
    } catch (error) {
      console.error('❌ Error deleting template:', error);
    }
  };

  const handleToggleTemplateStatus = async (templateId: string, isActive: boolean) => {
    try {
      await emailTemplateService.toggleTemplateStatus(templateId, isActive);
      console.log('✅ Template status updated successfully');
      await fetchData();
    } catch (error) {
      console.error('❌ Error updating template status:', error);
    }
  };

  const handleSaveAutomation = async () => {
    try {
      if (editingAutomation) {
        console.log('Updating automation:', editingAutomation.id, automationForm);
      } else {
        console.log('Creating automation:', automationForm);
      }
      
      setShowAutomationDialog(false);
      setEditingAutomation(null);
      resetAutomationForm();
      await fetchData();
    } catch (error) {
      console.error('Error saving automation:', error);
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      content: template.content,
      type: template.type,
      is_active: template.is_active
    });
    setShowTemplateDialog(true);
  };

  const handleEditAutomation = (automation: EmailAutomation) => {
    setEditingAutomation(automation);
    setAutomationForm({
      name: automation.name,
      template_id: automation.template_id,
      trigger_type: automation.trigger_type,
      trigger_delay: automation.trigger_delay,
      is_active: automation.is_active
    });
    setShowAutomationDialog(true);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewDialog(true);
  };

  const handleSendTestEmail = async () => {
    if (!selectedTemplate || !testEmailForm.recipient_email) return;

    try {
      console.log('Sending test email:', testEmailForm);

      // Send test email using the email service
      const result = await emailService.sendEmail({
        to: testEmailForm.recipient_email,
        toName: 'Test Recipient',
        subject: `[TEST] ${selectedTemplate.subject}`,
        htmlBody: selectedTemplate.content,
        templateId: selectedTemplate.id,
        metadata: {
          test_email: true,
          sent_by: 'admin',
          template_name: selectedTemplate.name
        }
      });

      if (result.success) {
        console.log('Test email sent successfully:', result.messageId);
        // In a real app, you'd show a success message
        alert('Test email sent successfully!');
      } else {
        console.error('Test email failed:', result.error);
        alert(`Test email failed: ${result.error}`);
      }

      // Reset form
      setTestEmailForm({ template_id: '', recipient_email: '', recipient_name: '' });

    } catch (error) {
      console.error('Error sending test email:', error);
      alert('An error occurred while sending the test email');
    }
  };

  const toggleAutomation = async (automationId: string, isActive: boolean) => {
    try {
      console.log('Toggling automation:', automationId, isActive);
      // In a real implementation, you would call your API here
      await fetchData();
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      subject: '',
      content: '',
      type: 'custom',
      is_active: true
    });
  };

  const resetAutomationForm = () => {
    setAutomationForm({
      name: '',
      template_id: '',
      trigger_type: 'booking_created',
      trigger_delay: 0,
      is_active: true
    });
  };

  const insertVariable = (variable: string) => {
    setTemplateForm(prev => ({
      ...prev,
      content: prev.content + variable
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Automation</h2>
          <p className="text-gray-600">Manage email templates and automated workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Automations
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Templates</CardTitle>
                <Button onClick={() => setShowTemplateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className={`${!template.is_active ? 'opacity-60' : ''}`}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{template.name}</h3>
                          <div className="flex items-center gap-1">
                            {template.is_active ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Badge variant="outline">{getTypeLabel(template.type)}</Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Subject:</p>
                          <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTestEmailForm(prev => ({ ...prev, template_id: template.id }));
                            }}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleTemplateStatus(template.id, !template.is_active)}
                            title={template.is_active ? 'Deactivate template' : 'Activate template'}
                          >
                            {template.is_active ? '🔴' : '🟢'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Automations</CardTitle>
                <Button onClick={() => setShowAutomationDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Automation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Delay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {automations.map((automation) => {
                      const template = templates.find(t => t.id === automation.template_id);
                      return (
                        <TableRow key={automation.id}>
                          <TableCell>
                            <p className="font-medium">{automation.name}</p>
                          </TableCell>
                          <TableCell>
                            <p>{template?.name || 'Unknown Template'}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getTriggerLabel(automation.trigger_type)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{automation.trigger_delay}h</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={automation.is_active}
                                onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                              />
                              <span className="text-sm">
                                {automation.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAutomation(automation)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => console.log('Delete automation:', automation.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <p className="font-medium">{log.template_name}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.recipient_name}</p>
                            <p className="text-sm text-gray-600">{log.recipient_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{log.subject}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(log.status)}>
                            {log.status}
                          </Badge>
                          {log.error_message && (
                            <p className="text-xs text-red-600 mt-1">{log.error_message}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {log.sent_at ? new Date(log.sent_at).toLocaleString() :
                             log.scheduled_for ? `Scheduled: ${new Date(log.scheduled_for).toLocaleString()}` :
                             'Not sent'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => console.log('View email details:', log.id)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResendEmail(log.id)}
                              disabled={resending === log.id}
                              title="Resend Email"
                            >
                              {resending === log.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Email Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Booking Confirmation"
                />
              </div>

              <div>
                <Label>Template Type</Label>
                <Select value={templateForm.type} onValueChange={(value: 'booking_confirmation' | 'pre_arrival' | 'id_reminder' | 'post_stay' | 'custom') => setTemplateForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject Line</Label>
                <Input
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Your booking at {{property_name}} is confirmed!"
                />
              </div>

              <div>
                <Label>Email Content</Label>
                <Textarea
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Dear {{guest_name}},..."
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={templateForm.is_active}
                  onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Template is active</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Available Variables</h3>
                <div className="space-y-2">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs font-mono"
                      onClick={() => insertVariable(variable)}
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      {variable}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Test Email</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="test@email.com"
                    value={testEmailForm.recipient_email}
                    onChange={(e) => setTestEmailForm(prev => ({ ...prev, recipient_email: e.target.value }))}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleSendTestEmail}
                    disabled={!testEmailForm.recipient_email}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Test
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setShowTemplateDialog(false);
              setEditingTemplate(null);
              resetTemplateForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Automation Dialog */}
      <Dialog open={showAutomationDialog} onOpenChange={setShowAutomationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAutomation ? 'Edit Automation' : 'Create Email Automation'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Automation Name</Label>
              <Input
                value={automationForm.name}
                onChange={(e) => setAutomationForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Send Booking Confirmation"
              />
            </div>

            <div>
              <Label>Email Template</Label>
              <Select value={automationForm.template_id} onValueChange={(value) => setAutomationForm(prev => ({ ...prev, template_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Trigger Event</Label>
              <Select value={automationForm.trigger_type} onValueChange={(value: 'booking_created' | 'check_in_approaching' | 'id_missing' | 'check_out_completed') => {
                const trigger = triggerTypes.find(t => t.value === value);
                setAutomationForm(prev => ({
                  ...prev,
                  trigger_type: value,
                  trigger_delay: trigger?.delay || 0
                }));
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Delay (hours)</Label>
              <Input
                type="number"
                value={automationForm.trigger_delay}
                onChange={(e) => setAutomationForm(prev => ({ ...prev, trigger_delay: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={automationForm.is_active}
                onCheckedChange={(checked) => setAutomationForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label>Automation is active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAutomationDialog(false);
                setEditingAutomation(null);
                resetAutomationForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveAutomation}>
                {editingAutomation ? 'Update Automation' : 'Create Automation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailAutomationManagement;
