import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BarChart3,
  Calendar,
  Home,
  Users,
  DollarSign,
  CheckCircle,
  Mail,
  Star,
  Settings,
  Languages,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  Activity,
  Shield
} from 'lucide-react';
import { useAdminAuth } from '@/utils/adminAuthUtils';
import WeatherWidget from '@/components/WeatherWidget';

interface AdminLayoutProps {
  children: React.ReactNode;
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
  onNewBooking?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, selectedTab, onTabChange, onNewBooking }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, href: '/admin' },
    { id: 'bookings', label: 'Pending Bookings Approvals', icon: Calendar, href: '/admin/bookings' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/admin/calendar' },
    { id: 'units', label: 'Units', icon: Home, href: '/admin/units' },
    { id: 'guests', label: 'Guests', icon: Users, href: '/admin/guests' },
    { id: 'payments', label: 'Payments', icon: DollarSign, href: '/admin/payments' },
    { id: 'emails', label: 'Emails', icon: Mail, href: '/admin/emails' },
    { id: 'reviews', label: 'Reviews', icon: Star, href: '/admin/reviews' },
    { id: 'sync', label: 'Sync', icon: Calendar, href: '/admin/sync' },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, href: '/admin/monitoring' },
    { id: 'backup', label: 'Backup', icon: Shield, href: '/admin/backup' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
    { id: 'translations', label: 'Translations', icon: Languages, href: '/admin/translations' },
  ];

  const currentTab = selectedTab || navigationItems.find(item => 
    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
  )?.id || 'overview';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full max-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">HL</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold text-gray-900 text-sm sm:text-base truncate">Admin Panel</h1>
                <p className="text-xs text-gray-500 truncate">Habitat Lobby</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange?.(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden sm:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <WeatherWidget />
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm" onClick={onNewBooking || (() => {})}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Booking</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
