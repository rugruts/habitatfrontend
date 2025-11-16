import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  Shield,
  Clock,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  HardDrive
} from 'lucide-react';
import { useAdminAuth } from '@/utils/adminAuthUtils';
import { supabase } from '@/lib/supabase';

interface Backup {
  name: string;
  timestamp: string;
  tables: string[];
  size: number;
}

const BackupPanel: React.FC = () => {
  const { user } = useAdminAuth();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      
      // Get the session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`https://backendhabitatapi.vercel.app/api/admin/backup/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch backups');
      }
      
      const data = await response.json();
      setBackups(data.backups || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createBackup = async () => {
    try {
      setCreatingBackup(true);
      
      // Get the session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`https://backendhabitatapi.vercel.app/api/admin/backup/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          backupName: `manual-backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create backup');
      }
      
      // Refresh the backup list
      await fetchBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setCreatingBackup(false);
    }
  };

  const cleanupBackups = async () => {
    try {
      setCleaningUp(true);
      
      // Get the session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`https://backendhabitatapi.vercel.app/api/admin/backup/cleanup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cleanup backups');
      }
      
      // Refresh the backup list
      await fetchBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setCleaningUp(false);
    }
  };

  const restoreBackup = async (backupName: string) => {
    if (!window.confirm(`Are you sure you want to restore backup "${backupName}"? This will overwrite current data.`)) {
      return;
    }
    
    try {
      // Get the session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`https://backendhabitatapi.vercel.app/api/admin/backup/restore/${backupName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to restore backup');
      }
      
      alert('Backup restoration initiated. Please check the system logs for progress.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading backups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Error Loading Data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={fetchBackups} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Database Backup</h2>
        <div className="flex gap-2">
          <Button 
            onClick={cleanupBackups}
            disabled={cleaningUp}
            variant="outline"
          >
            <HardDrive className={`h-4 w-4 mr-2 ${cleaningUp ? 'animate-spin' : ''}`} />
            {cleaningUp ? 'Cleaning...' : 'Cleanup Old Backups'}
          </Button>
          <Button 
            onClick={createBackup}
            disabled={creatingBackup}
          >
            <Database className={`h-4 w-4 mr-2 ${creatingBackup ? 'animate-spin' : ''}`} />
            {creatingBackup ? 'Creating...' : 'Create Backup'}
          </Button>
          <Button 
            onClick={() => {
              setRefreshing(true);
              fetchBackups();
            }}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Backup Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Backup Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total Backups</span>
              </div>
              <p className="text-2xl font-bold">{backups.length}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Latest Backup</span>
              </div>
              <p className="text-sm">
                {backups.length > 0 
                  ? formatDate(backups[0].timestamp) 
                  : 'No backups available'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Backup Status</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-600" />
            Available Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-600">No backups available</p>
              <p className="text-sm text-gray-500">Create your first backup using the button above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup, index) => (
                <div key={backup.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{backup.name}</h3>
                      <p className="text-sm text-gray-600">
                        Created: {formatDate(backup.timestamp)} • 
                        Tables: {backup.tables.length} • 
                        Size: {formatBytes(backup.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => restoreBackup(backup.name)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Information */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Automatic Backups</p>
                <p className="text-sm text-gray-600">Daily backups are automatically created at 2:00 AM UTC</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Retention Policy</p>
                <p className="text-sm text-gray-600">Backups are retained for 30 days before automatic cleanup</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Restore Warning</p>
                <p className="text-sm text-gray-600">Restoring a backup will overwrite current data. Always verify before restoring.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupPanel;