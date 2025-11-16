import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Wifi,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '@/utils/adminAuthUtils';
import { supabase } from '@/lib/supabase';

interface MonitoringData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  metrics: {
    requests: number;
    errors: number;
    errorRate: string;
    avgResponseTime: string;
    uptime: string;
  };
}

const MonitoringPanel: React.FC = () => {
  const { user } = useAdminAuth();
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      
      // Get the session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`https://backendhabitatapi.vercel.app/monitoring`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch monitoring data');
      }
      
      const data = await response.json();
      setMonitoringData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unhealthy': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'unhealthy': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading monitoring data...</p>
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
            <Button onClick={fetchMonitoringData} variant="outline" size="sm">
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
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <Button 
          onClick={() => {
            setRefreshing(true);
            fetchMonitoringData();
          }}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(monitoringData?.status || 'unknown')}
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getStatusColor(monitoringData?.status || 'unknown')}>
              {monitoringData?.status?.charAt(0).toUpperCase() + (monitoringData?.status?.slice(1) || '')}
            </Badge>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          {monitoringData && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Requests</span>
                </div>
                <p className="text-2xl font-bold">{monitoringData.metrics.requests.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-600">Errors</span>
                </div>
                <p className="text-2xl font-bold">{monitoringData.metrics.errors.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{monitoringData.metrics.errorRate}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Response Time</span>
                </div>
                <p className="text-2xl font-bold">{monitoringData.metrics.avgResponseTime}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Uptime</span>
                </div>
                <p className="text-2xl font-bold">{monitoringData.metrics.uptime}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-600">Request volume chart would appear here</p>
                <p className="text-sm text-gray-500">Feature coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-600">Error distribution chart would appear here</p>
                <p className="text-sm text-gray-500">Feature coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-gray-600">No recent alerts</p>
            <p className="text-sm text-gray-500">Alert history will appear here when issues occur</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringPanel;