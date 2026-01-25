import { Home, ListChecks, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type TabType = 'home' | 'progress' | 'history' | 'account';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-50 safe-area-bottom">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center gap-1 h-auto p-2 hover:bg-transparent hover:text-blue-600 transition-colors",
              activeTab === 'home' ? "text-blue-600" : "text-slate-400"
            )}
            onClick={() => onTabChange('home')}
          >
            <Home className={cn("w-6 h-6", activeTab === 'home' && "fill-current")} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center gap-1 h-auto p-2 hover:bg-transparent hover:text-blue-600 transition-colors",
              activeTab === 'progress' ? "text-blue-600" : "text-slate-400"
            )}
            onClick={() => onTabChange('progress')}
          >
            <ListChecks className={cn("w-6 h-6", activeTab === 'progress' && "text-blue-600")} strokeWidth={activeTab === 'progress' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Progress</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center gap-1 h-auto p-2 hover:bg-transparent hover:text-blue-600 transition-colors",
              activeTab === 'history' ? "text-blue-600" : "text-slate-400"
            )}
            onClick={() => onTabChange('history')}
          >
            <History className={cn("w-6 h-6", activeTab === 'history' && "text-blue-600")} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">History</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center gap-1 h-auto p-2 hover:bg-transparent hover:text-blue-600 transition-colors",
              activeTab === 'account' ? "text-blue-600" : "text-slate-400"
            )}
            onClick={() => onTabChange('account')}
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
               {/* Placeholder for user avatar if available, else icon */}
               <User className="w-full h-full p-0.5 text-slate-500" />
            </div>
            {/* <span className="text-[10px] font-medium">Account</span> */}
          </Button>
        </div>
      </div>
    </div>
  );
}
