import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '@/lib/supabase';
import { calendarSyncService, CalendarSync as RealCalendarSync, CalendarSyncLog as RealCalendarSyncLog } from '@/services/CalendarSyncService';
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
  Calendar, 
  Download, 
  Upload, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Link,
  Globe
} from 'lucide-react';

// Use the real interfaces from the service
type CalendarSync = RealCalendarSync;
type SyncLog = RealCalendarSyncLog;

interface ExportSettings {
  include_guest_names: boolean;
  include_contact_info: boolean;
  include_pricing: boolean;
  timezone: string;
  calendar_name: string;
  description_template: string;
}

const CalendarSyncManagement: React.FC = () => {
  const [calendarSyncs, setCalendarSyncs] = useState<CalendarSync[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [selectedSync, setSelectedSync] = useState<CalendarSync | null>(null);
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [editingSync, setEditingSync] = useState<CalendarSync | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('syncs');

  const [syncForm, setSyncForm] = useState({
    name: '',
    property_id: '',
    platform: 'custom' as const,
    sync_type: 'import' as const,
    ical_url: '',
    sync_frequency: 6,
    is_active: true
  });

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    include_guest_names: false,
    include_contact_info: false,
    include_pricing: false,
    timezone: 'Europe/Athens',
    calendar_name: 'Habitat Lobby',
    description_template: 'Booking at {{property_name}}'
  });

  const platforms = [
    { value: 'airbnb', label: 'Airbnb', color: 'bg-red-100 text-red-800' },
    { value: 'booking_com', label: 'Booking.com', color: 'bg-blue-100 text-blue-800' },
    { value: 'vrbo', label: 'VRBO', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'expedia', label: 'Expedia', color: 'bg-purple-100 text-purple-800' },
    { value: 'custom', label: 'Custom iCal', color: 'bg-gray-100 text-gray-800' }
  ];

  const properties = [
    { id: '1', name: 'River Loft Apartment' },
    { id: '2', name: 'Garden Suite' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock calendar sync data
      const mockSyncs: CalendarSync[] = [
        {
          id: '1',
          name: 'Airbnb - River Loft',
          property_id: '1',
          property_name: 'River Loft Apartment',
          platform: 'airbnb',
          sync_type: 'import',
          ical_url: 'https://calendar.airbnb.com/calendar/ical/12345.ics',
          is_active: true,
          last_sync: '2024-08-10T10:30:00Z',
          sync_frequency: 6,
          total_bookings_synced: 15,
          created_at: '2024-08-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Booking.com - Garden Suite',
          property_id: '2',
          property_name: 'Garden Suite',
          platform: 'booking_com',
          sync_type: 'import',
          ical_url: 'https://admin.booking.com/hotel/hoteladmin/ical.html?ses=67890',
          is_active: true,
          last_sync: '2024-08-10T08:15:00Z',
          sync_frequency: 12,
          total_bookings_synced: 8,
          created_at: '2024-08-01T10:00:00Z'
        },
        {
          id: '3',
          name: 'Export - All Properties',
          property_id: 'all',
          property_name: 'All Properties',
          platform: 'custom',
          sync_type: 'export',
          ical_url: '',
          export_url: 'https://habitatlobby.com/calendar/export/all.ics',
          is_active: true,
          last_sync: '2024-08-10T12:00:00Z',
          sync_frequency: 1,
          total_bookings_synced: 23,
          created_at: '2024-08-01T10:00:00Z'
        }
      ];

      // Mock sync logs
      const mockLogs: SyncLog[] = [
        {
          id: '1',
          calendar_sync_id: '1',
          sync_type: 'import',
          status: 'success',
          bookings_processed: 3,
          bookings_added: 1,
          bookings_updated: 2,
          bookings_removed: 0,
          started_at: '2024-08-10T10:30:00Z',
          completed_at: '2024-08-10T10:30:15Z',
          duration_ms: 15000
        },
        {
          id: '2',
          calendar_sync_id: '2',
          sync_type: 'import',
          status: 'failed',
          bookings_processed: 0,
          bookings_added: 0,
          bookings_updated: 0,
          bookings_removed: 0,
          error_message: 'Invalid iCal URL or access denied',
          started_at: '2024-08-10T08:15:00Z',
          completed_at: '2024-08-10T08:15:05Z',
          duration_ms: 5000
        }
      ];

      // Fetch real data from CalendarSyncService
      const fetchedSyncs = await calendarSyncService.getAllSyncs();
      const fetchedLogs = await calendarSyncService.getSyncLogs(50, 0);

      console.log('📅 Fetched calendar syncs:', fetchedSyncs);
      console.log('📊 Fetched sync logs:', fetchedLogs);

      setCalendarSyncs(fetchedSyncs);
      setSyncLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to empty arrays on error
      setCalendarSyncs([]);
      setSyncLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return variants[status as keyof typeof variants] || variants.failed;
  };

  const getPlatformBadge = (platform: string) => {
    const platformObj = platforms.find(p => p.value === platform);
    return platformObj ? platformObj.color : 'bg-gray-100 text-gray-800';
  };

  const getSyncTypeIcon = (syncType: string) => {
    switch (syncType) {
      case 'import':
        return <Download className="h-4 w-4" />;
      case 'export':
        return <Upload className="h-4 w-4" />;
      case 'bidirectional':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const handleSaveSync = async () => {
    try {
      if (editingSync) {
        // Update existing sync
        await calendarSyncService.updateSync({
          id: editingSync.id,
          name: syncForm.name,
          property_id: syncForm.property_id || undefined,
          platform: syncForm.platform,
          sync_type: syncForm.sync_type,
          ical_url: syncForm.ical_url,
          sync_frequency_hours: syncForm.sync_frequency,
          is_active: syncForm.is_active
        });
        console.log('✅ Calendar sync updated successfully');
      } else {
        // Create new sync
        await calendarSyncService.createSync({
          name: syncForm.name,
          property_id: syncForm.property_id || undefined,
          platform: syncForm.platform,
          sync_type: syncForm.sync_type,
          ical_url: syncForm.ical_url,
          sync_frequency_hours: syncForm.sync_frequency,
          is_active: syncForm.is_active
        });
        console.log('✅ Calendar sync created successfully');
      }

      setShowSyncDialog(false);
      setEditingSync(null);
      resetSyncForm();
      await fetchData();
    } catch (error) {
      console.error('❌ Error saving calendar sync:', error);
    }
  };

  const handleEditSync = (sync: CalendarSync) => {
    setEditingSync(sync);
    setSyncForm({
      name: sync.name,
      property_id: sync.property_id || '',
      platform: sync.platform,
      sync_type: sync.sync_type,
      ical_url: sync.ical_url || '',
      sync_frequency: sync.sync_frequency_hours,
      is_active: sync.is_active
    });
    setShowSyncDialog(true);
  };





  const handleToggleSync = async (syncId: string, isActive: boolean) => {
    try {
      await calendarSyncService.toggleSyncStatus(syncId, isActive);
      console.log('✅ Sync status toggled successfully');
      await fetchData();
    } catch (error) {
      console.error('❌ Error toggling sync:', error);
    }
  };

  const handleDeleteSync = async (syncId: string) => {
    try {
      if (confirm('Are you sure you want to delete this calendar sync? This action cannot be undone.')) {
        await calendarSyncService.deleteSync(syncId);
        console.log('✅ Calendar sync deleted successfully');
        await fetchData();
      }
    } catch (error) {
      console.error('❌ Error deleting sync:', error);
    }
  };

  const handleTriggerSync = async (syncId: string) => {
    try {
      console.log('🔄 Triggering manual sync for:', syncId);
      const result = await calendarSyncService.triggerSync(syncId);
      console.log('✅ Manual sync completed:', result);
      await fetchData(); // Refresh data to show updated sync status
    } catch (error) {
      console.error('❌ Error triggering sync:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetSyncForm = () => {
    setSyncForm({
      name: '',
      property_id: '',
      platform: 'custom',
      sync_type: 'import',
      ical_url: '',
      sync_frequency: 6,
      is_active: true
    });
  };

  const generateExportUrl = (propertyId: string) => {
    return calendarSyncService.getExportUrl(propertyId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar Sync & iCal</h2>
          <p className="text-gray-600">Manage calendar synchronization with OTA platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          <Button onClick={() => setShowSyncDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Calendar Sync
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="syncs" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar Syncs
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Export URLs
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Sync Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="syncs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Calendar Syncs</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading calendar syncs...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calendarSyncs.map((sync) => (
                        <TableRow key={sync.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sync.name}</p>
                              <p className="text-sm text-gray-600">{sync.total_bookings_synced} bookings synced</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{sync.property_name}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPlatformBadge(sync.platform)}>
                              {platforms.find(p => p.value === sync.platform)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSyncTypeIcon(sync.sync_type)}
                              <span className="capitalize">{sync.sync_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">Every {sync.sync_frequency}h</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{new Date(sync.last_sync).toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={sync.is_active}
                                onCheckedChange={(checked) => handleToggleSync(sync.id, checked)}
                              />
                              {sync.last_error && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTriggerSync(sync.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSync(sync)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSync(sync.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Calendar URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium mb-2">How to use export URLs:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Copy the iCal URL for your property</li>
                    <li>• Add it to your OTA platform's calendar import section</li>
                    <li>• Your direct bookings will appear as blocked dates on other platforms</li>
                    <li>• URLs update automatically when bookings change</li>
                  </ul>
                </div>

                {properties.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{property.name}</h3>
                          <p className="text-sm text-gray-600">Export URL for external calendar imports</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={generateExportUrl(property.id)}
                            readOnly
                            className="w-80 font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generateExportUrl(property.id))}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(generateExportUrl(property.id), '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">All Properties Combined</h3>
                        <p className="text-sm text-gray-600">Single URL with all property bookings</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={generateExportUrl('all')}
                          readOnly
                          className="w-80 font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateExportUrl('all'))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(generateExportUrl('all'), '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Calendar</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Started</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncLogs.map((log) => {
                      const sync = calendarSyncs.find(s => s.id === log.calendar_sync_id);
                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <p className="font-medium">{sync?.name || 'Unknown'}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSyncTypeIcon(log.sync_type)}
                              <span className="capitalize">{log.sync_type}</span>
                            </div>
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
                            <div className="text-sm">
                              <p>Processed: {log.bookings_processed}</p>
                              {log.bookings_added > 0 && <p className="text-green-600">Added: {log.bookings_added}</p>}
                              {log.bookings_updated > 0 && <p className="text-blue-600">Updated: {log.bookings_updated}</p>}
                              {log.bookings_removed > 0 && <p className="text-red-600">Removed: {log.bookings_removed}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {log.duration_ms ? `${(log.duration_ms / 1000).toFixed(1)}s` : 'N/A'}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{new Date(log.started_at).toLocaleString()}</p>
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
      </Tabs>

      {/* Calendar Sync Dialog */}
      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSync ? 'Edit Calendar Sync' : 'Add Calendar Sync'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sync Name</Label>
                <Input
                  value={syncForm.name}
                  onChange={(e) => setSyncForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Airbnb - River Loft"
                />
              </div>
              <div>
                <Label>Property</Label>
                <Select value={syncForm.property_id} onValueChange={(value) => setSyncForm(prev => ({ ...prev, property_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Platform</Label>
                <Select value={syncForm.platform} onValueChange={(value: string) => setSyncForm(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sync Type</Label>
                <Select value={syncForm.sync_type} onValueChange={(value: string) => setSyncForm(prev => ({ ...prev, sync_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="import">Import (from platform)</SelectItem>
                    <SelectItem value="export">Export (to platform)</SelectItem>
                    <SelectItem value="bidirectional">Bidirectional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(syncForm.sync_type === 'import' || syncForm.sync_type === 'bidirectional') && (
              <div>
                <Label>iCal URL</Label>
                <Input
                  value={syncForm.ical_url}
                  onChange={(e) => setSyncForm(prev => ({ ...prev, ical_url: e.target.value }))}
                  placeholder="https://calendar.airbnb.com/calendar/ical/12345.ics"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this URL from your OTA platform's calendar export section
                </p>
              </div>
            )}

            <div>
              <Label>Sync Frequency (hours)</Label>
              <Select value={syncForm.sync_frequency.toString()} onValueChange={(value) => setSyncForm(prev => ({ ...prev, sync_frequency: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every hour</SelectItem>
                  <SelectItem value="3">Every 3 hours</SelectItem>
                  <SelectItem value="6">Every 6 hours</SelectItem>
                  <SelectItem value="12">Every 12 hours</SelectItem>
                  <SelectItem value="24">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={syncForm.is_active}
                onCheckedChange={(checked) => setSyncForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label>Enable automatic synchronization</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowSyncDialog(false);
                setEditingSync(null);
                resetSyncForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveSync}>
                {editingSync ? 'Update Sync' : 'Create Sync'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Calendar Name</Label>
              <Input
                value={exportSettings.calendar_name}
                onChange={(e) => setExportSettings(prev => ({ ...prev, calendar_name: e.target.value }))}
                placeholder="Habitat Lobby"
              />
            </div>

            <div>
              <Label>Timezone</Label>
              <Select value={exportSettings.timezone} onValueChange={(value) => setExportSettings(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Athens">Europe/Athens (Greece)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description Template</Label>
              <Textarea
                value={exportSettings.description_template}
                onChange={(e) => setExportSettings(prev => ({ ...prev, description_template: e.target.value }))}
                placeholder="Booking at {{property_name}}"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Available variables: {'{property_name}'}, {'{guest_name}'}, {'{guests_count}'}
              </p>
            </div>

            <div className="space-y-3">
              <Label>Privacy Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include_guest_names"
                    checked={exportSettings.include_guest_names}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, include_guest_names: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="include_guest_names" className="text-sm cursor-pointer">
                    Include guest names
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include_contact_info"
                    checked={exportSettings.include_contact_info}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, include_contact_info: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="include_contact_info" className="text-sm cursor-pointer">
                    Include contact information
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include_pricing"
                    checked={exportSettings.include_pricing}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, include_pricing: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="include_pricing" className="text-sm cursor-pointer">
                    Include pricing information
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Saving export settings:', exportSettings);
                setShowSettingsDialog(false);
              }}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarSyncManagement;
