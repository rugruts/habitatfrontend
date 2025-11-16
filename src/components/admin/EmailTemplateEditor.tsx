import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Eye,
  Code,
  Palette,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Link,
  Save,
  RefreshCw,
  Settings,
  Mail
} from 'lucide-react';
import { emailTemplateService, EmailTemplate } from '@/services/EmailTemplateService';
import { toast } from '@/utils/toastUtils';

interface EditingEmailTemplate extends Omit<EmailTemplate, 'id'> {
  id?: string;
}

interface EmailTemplateEditorProps {
  template: EmailTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
}

// Sample data for preview
const sampleData = {
  customer_name: 'John Doe',
  property_name: 'Apartment 1 - with View',
  check_in: '2024-08-20',
  check_out: '2024-08-23',
  guests: 2,
  total_amount: 320.00,
  booking_id: 'HB-2024-001',
  business_name: 'Habitat Lobby',
      business_email: 'admin@habitatlobby.com',
    business_phone: '+30 697 769 0685',
          business_address: 'Alexandras 59, Trikala 42100, Greece'
};

export const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  template,
  isOpen,
  onClose,
  onSave
}) => {
  const [editingTemplate, setEditingTemplate] = useState<EditingEmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'code'>('editor');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      // Map the template properties correctly
      setEditingTemplate({
        id: template.id || '',
        name: template.name || '',
        subject: template.subject || '',
        content: template.content || '',
        template_type: template.template_type || 'booking_confirmation',
        is_active: template.is_active !== undefined ? template.is_active : true,
        variables: template.variables || [],
        created_at: template.created_at || new Date().toISOString(),
        updated_at: template.updated_at || new Date().toISOString()
      });
    } else {
      setEditingTemplate({
        id: undefined,
        name: '',
        subject: '',
        content: '',
        template_type: 'booking_confirmation',
        is_active: true,
        variables: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }, [template]);

  const handleSave = async () => {
    if (!editingTemplate) return;

    setSaving(true);
    try {
      let savedTemplate;
      if (editingTemplate.id) {
        savedTemplate = await emailTemplateService.updateTemplate(editingTemplate.id, editingTemplate);
      } else {
        // For new templates, exclude the id field to let the database auto-generate it
        const { id, ...templateData } = editingTemplate;
        savedTemplate = await emailTemplateService.createTemplate(templateData);
      }
      
      onSave(savedTemplate);
      toast.success('Template saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    if (!editingTemplate) return;
    
    const textarea = document.getElementById('html-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + `{{${variable}}}` + after;
      
      setEditingTemplate({
        ...editingTemplate,
        content: newText
      });
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  const replaceVariables = (content: string) => {
    if (!content || typeof content !== 'string') {
      return '';
    }

    let processedContent = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedContent = processedContent.replace(regex, String(value || ''));
    });
    return processedContent;
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const availableVariables = [
    'customer_name',
    'property_name', 
    'check_in',
    'check_out',
    'guests',
    'total_amount',
    'booking_id',
    'business_name',
    'business_email',
    'business_phone',
    'business_address'
  ];

  if (!editingTemplate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {template ? 'Edit Email Template' : 'Create Email Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 px-6 py-4 min-h-[600px]">
          {/* Left Panel - Editor */}
          <div className="w-1/2 flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'preview' | 'code')} className="flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  HTML
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-4">
                <div className="space-y-4">
                  {/* Basic Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Template Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="template-name">Template Name</Label>
                          <Input
                            id="template-name"
                            value={editingTemplate.name}
                            onChange={(e) => setEditingTemplate({
                              ...editingTemplate,
                              name: e.target.value
                            })}
                            placeholder="e.g., Booking Confirmation"
                          />
                        </div>
                        <div>
                          <Label htmlFor="template-type">Template Type</Label>
                          <Select
                            value={editingTemplate.template_type}
                            onValueChange={(value) => setEditingTemplate({
                              ...editingTemplate,
                              template_type: value as 'booking_confirmation' | 'pre_arrival' | 'post_stay' | 'cancellation' | 'payment_reminder' | 'custom'
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="booking_confirmation">Booking Confirmation</SelectItem>
                              <SelectItem value="pre_arrival">Pre-Arrival</SelectItem>
                              <SelectItem value="post_stay">Post-Stay</SelectItem>
                              <SelectItem value="cancellation">Cancellation</SelectItem>
                              <SelectItem value="payment_reminder">Payment Reminder</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Email Subject</Label>
                        <Input
                          id="subject"
                          value={editingTemplate.subject}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            subject: e.target.value
                          })}
                          placeholder="e.g., Your booking confirmation for {{property_name}}"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Variables Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Available Variables</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {availableVariables.map((variable) => (
                          <Button
                            key={variable}
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable(variable)}
                            className="justify-start text-xs"
                          >
                            {`{{${variable}}}`}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Editor */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Email Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="html-content">HTML Content</Label>
                        <Textarea
                          id="html-content"
                          value={editingTemplate.content}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            content: e.target.value
                          })}
                          placeholder="Enter your email HTML content here..."
                          className="min-h-[300px] font-mono text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="flex flex-col">
                  {/* Preview Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewMode === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('tablet')}
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('mobile')}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary">{previewMode}</Badge>
                  </div>

                  {/* Preview Frame */}
                  <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 flex justify-center">
                    <div 
                      className="bg-white shadow-lg transition-all duration-300"
                      style={{ width: getPreviewWidth(), maxWidth: '100%' }}
                    >
                      <div className="p-4 border-b bg-gray-100">
                        <div className="text-sm font-medium">Subject: {editingTemplate?.subject ? replaceVariables(editingTemplate.subject) : 'No subject'}</div>
                      </div>
                      <div
                        className="p-4 overflow-auto"
                        dangerouslySetInnerHTML={{
                          __html: editingTemplate?.content ? replaceVariables(editingTemplate.content) : '<p>No content</p>'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="mt-4">
                <div>
                  <Textarea
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      content: e.target.value
                    })}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Enter your HTML code here..."
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="w-1/2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center min-h-[400px]">
              <div
                className="bg-white shadow-lg transition-all duration-300"
                style={{ width: getPreviewWidth(), maxWidth: '100%' }}
              >
                <div className="p-4 border-b bg-gray-100">
                  <div className="text-sm font-medium">Subject: {editingTemplate?.subject ? replaceVariables(editingTemplate.subject) : 'No subject'}</div>
                </div>
                <div
                  className="p-4"
                  dangerouslySetInnerHTML={{
                    __html: editingTemplate?.content ? replaceVariables(editingTemplate.content) : '<p>No content</p>'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 sticky bottom-0">
          <div className="flex items-center gap-2">
            <Badge variant={editingTemplate.is_active ? 'default' : 'secondary'}>
              {editingTemplate.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
