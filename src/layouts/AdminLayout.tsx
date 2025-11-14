import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Phone,
  TrendingUp,
  IndianRupee,
  LogOut,
  Menu,
  X,
  Bell,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
// --- NEW IMPORTS FOR GLOBAL NOTIFICATIONS ---
import { usePickupNotifications } from '@/hooks/usePickupNotifications'; 
import { NewPickupNotification } from '@/components/admin/NewPickupNotification';
// ------------------------------------------

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: ShoppingBag, label: 'Pickup Requests', path: '/admin/pickup-requests' },
  { icon: Phone, label: 'Leads', path: '/admin/leads' },
  { icon: Package, label: 'Devices', path: '/admin/devices' },
  { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
  { icon: IndianRupee, label: 'Pricing', path: '/admin/pricing' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false for mobile-first
  const { session, logout } = useAdminAuth();
  const location = useLocation();
  
  // 1. Instantiate Notification Hook Globally
  const { newRequest, isAlarmPlaying, acceptRequest } = usePickupNotifications();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-transform duration-300',
          'w-64',
          // Mobile: slide in/out from left
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">SellKar Admin</h1>
                <p className="text-sm text-slate-500 mt-1">Management Portal</p>
              </div>
              {/* Close button - only visible on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        isActive && 'bg-slate-100 text-slate-900'
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {session?.user.username}
                </p>
                <p className="text-xs text-slate-500 truncate">{session?.user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          'lg:ml-64' // Only add margin on desktop
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden" // Only show hamburger on mobile
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop toggle (optional - hide on mobile) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notification Bell with Alarm status */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className={cn("h-5 w-5", isAlarmPlaying && 'text-red-500 animate-pulse')} />
                {newRequest && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6">
          {/* 2. GLOBAL NOTIFICATION COMPONENT: Renders pop-up over all content */}
          <NewPickupNotification
            request={newRequest}
            onAccept={acceptRequest}
            isAlarmPlaying={isAlarmPlaying}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
