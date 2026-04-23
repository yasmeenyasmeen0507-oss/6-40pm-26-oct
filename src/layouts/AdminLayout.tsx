import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  ShoppingBag,
  Phone,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Truck,
  DollarSign,
  Database,
  Package,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlobalPickupNotifications from '@/pages/admin/GlobalPickupNotifications';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Database, label: 'DB', path: '/admin/db' },
  { icon: ShoppingBag, label: 'Pickup Requests', path: '/admin/pickup-requests' },
  { icon: Truck, label: 'Pickup Agents', path: '/admin/pickup-agents' },
  { icon: Phone, label: 'Leads', path: '/admin/leads' },
  { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
  { icon: DollarSign, label: 'Warranty Prices', path: '/admin/warranty-prices' },
  { icon: Package, label: 'Variants', path: '/admin/variants' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { session, logout } = useAdminAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-white relative font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          {/* Logo Header & Toggle - Now at the Top */}
          <div className={cn("flex items-center transition-all duration-300 border-b border-gray-50/50", isCollapsed ? "p-4 justify-center flex-col gap-4" : "p-6 justify-between")}>
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0 overflow-hidden">
                <img
                  src="/sellkar-logo.png"
                  alt="SellKar"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden whitespace-nowrap">
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                    SellKarIndia
                  </h1>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Admin Portal</p>
                </div>
              )}
            </div>

            {/* Toggle Button moved to Top */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hidden lg:flex h-8 w-8", isCollapsed && "w-full h-8 mt-2")}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation Menu */}
          <ScrollArea className="flex-1 px-3 py-2">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start text-sm font-medium transition-all duration-200 h-11 rounded-xl mb-1 relative group',
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-200'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
                        isCollapsed && "justify-center px-0"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={cn("h-5 w-5 transition-all", isActive ? "text-white" : "text-slate-400", !isCollapsed && "mr-3")} />
                      {!isCollapsed && <span>{item.label}</span>}
                      {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                          {item.label}
                        </div>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Toggle moved to top */}

          {/* User Profile (Bottom) */}
          <div className="p-4 border-t border-gray-100">
            <div className={cn("flex items-center gap-3 p-2 rounded-xl transition-all", isCollapsed ? "justify-center bg-transparent" : "bg-slate-50")}>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white shadow-sm flex-shrink-0">
                {session?.user.email?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">@{session?.user.username || 'admin'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{session?.user.email}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <Button
                variant="ghost"
                className="w-full mt-2 text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs h-8 justify-start px-2"
                onClick={handleLogout}
              >
                <LogOut className="w-3 h-3 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={cn("flex flex-col min-h-screen transition-all duration-300 ease-in-out", isCollapsed ? "lg:ml-20" : "lg:ml-64")}>

        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 shadow-sm/50">
          {/* Search Bar Placeholder (Visual Only) */}
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-500"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="hidden md:flex items-center max-w-md w-full relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Search orders, customers, devices..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:bg-slate-50 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 bg-white">
          <Outlet />
        </main>
      </div>

      {/* GLOBAL PICKUP NOTIFICATIONS - Preserved Logic */}
      <GlobalPickupNotifications />
    </div>
  );
}
