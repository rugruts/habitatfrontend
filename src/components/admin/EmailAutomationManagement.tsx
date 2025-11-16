import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '@/lib/supabase';
import { toast } from '@/utils/toastUtils';

import { emailTemplateService, EmailTemplate as RealEmailTemplate, EmailLog as ServiceEmailLog } from '@/services/EmailTemplateService';
import { emailAutomationService } from '@/services/EmailAutomationService';
import { EmailTemplateEditor } from './EmailTemplateEditor';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
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
  Download,
  Palette,

} from 'lucide-react';

// Use the real interfaces from the services
type EmailTemplate = RealEmailTemplate;
type EmailAutomation = import('@/services/EmailAutomationService').EmailAutomation;

// Use the EmailLog interface from the service
type EmailLog = ServiceEmailLog;

const EmailAutomationManagement: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const [showAutomationDialog, setShowAutomationDialog] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<EmailAutomation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [resending, setResending] = useState<string | null>(null);



  const [automationForm, setAutomationForm] = useState<{
    name: string;
    template_id: string;
    trigger_type: 'booking_created' | 'check_in_approaching' | 'check_out_completed' | 'payment_reminder' | 'review_request';
    trigger_delay_hours: number;
    is_active: boolean;
    conditions?: {
      booking_status?: string[];
      property_ids?: string[];
      guest_count_min?: number;
      guest_count_max?: number;
    };
  }>({
    name: '',
    template_id: '',
    trigger_type: 'booking_created',
    trigger_delay_hours: 0,
    is_active: true,
    conditions: {}
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
    { value: 'check_out_completed', label: 'Check-out Completed', delay: 24 },
    { value: 'payment_reminder', label: 'Payment Reminder', delay: 24 },
    { value: 'review_request', label: 'Review Request', delay: 24 }
  ];



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      






      // Fetch real data from services
      const fetchedTemplates = await emailTemplateService.getAllTemplates();
      const fetchedLogs = await emailTemplateService.getEmailLogs(50, 0);
      const fetchedAutomations = await emailAutomationService.getAllAutomations();

      console.log('📧 Fetched email templates:', fetchedTemplates);
      console.log('🤖 Fetched automations:', fetchedAutomations);
      
      setTemplates(fetchedTemplates);
      setEmailLogs(fetchedLogs || []);
      setAutomations(fetchedAutomations);
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

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleSaveTemplateFromEditor = (template: EmailTemplate) => {
    // Update the templates list
    if (template.id) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates(prev => [...prev, { ...template, id: Date.now().toString() }]);
    }
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleSelectFromLibrary = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
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
        await emailAutomationService.updateAutomation(editingAutomation.id, automationForm);
      } else {
        console.log('Creating automation:', automationForm);
        await emailAutomationService.createAutomation(automationForm);
      }
      
      setShowAutomationDialog(false);
      setEditingAutomation(null);
      resetAutomationForm();
      await fetchData();
      toast.success(editingAutomation ? 'Automation updated successfully!' : 'Automation created successfully!');
    } catch (error) {
      console.error('Error saving automation:', error);
      toast.error('Failed to save automation');
    }
  };



  const handleEditAutomation = (automation: EmailAutomation) => {
    setEditingAutomation(automation);
    setAutomationForm({
      name: automation.name,
      template_id: automation.template_id,
      trigger_type: automation.trigger_type,
      trigger_delay_hours: automation.trigger_delay_hours,
      is_active: automation.is_active,
      conditions: automation.conditions || {}
    });
    setShowAutomationDialog(true);
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

  const resetAutomationForm = () => {
    setAutomationForm({
      name: '',
      template_id: '',
      trigger_type: 'booking_created',
      trigger_delay_hours: 0,
      is_active: true,
      conditions: {}
    });
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
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setShowLibrary(true)}>
                    <Palette className="h-4 w-4 mr-2" />
                    Template Library
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
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
                          <Badge variant="outline">{getTypeLabel(template.template_type)}</Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Subject:</p>
                          <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                            title="Edit Template"
                          >
                            <Edit className="h-4 w-4" />
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
                            <p>{automation.trigger_delay_hours}h</p>
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
                          <p className="font-medium">{log.template_id || 'Unknown Template'}</p>
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
                            {log.sent_at ? new Date(log.sent_at).toLocaleString() : 'Not sent'}
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
              <Select value={automationForm.trigger_type} onValueChange={(value: 'booking_created' | 'check_in_approaching' | 'check_out_completed' | 'payment_reminder' | 'review_request') => {
                const trigger = triggerTypes.find(t => t.value === value);
                setAutomationForm(prev => ({
                  ...prev,
                  trigger_type: value,
                  trigger_delay_hours: trigger?.delay || 0
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
                value={automationForm.trigger_delay_hours}
                onChange={(e) => setAutomationForm(prev => ({ ...prev, trigger_delay_hours: parseInt(e.target.value) || 0 }))}
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

      {/* Visual Email Template Editor */}
      <EmailTemplateEditor
        template={editingTemplate}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplateFromEditor}
      />

      {/* Email Template Library */}
      <EmailTemplateLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelectTemplate={handleSelectFromLibrary}
      />
    </div>
  );
};

export default EmailAutomationManagement;
