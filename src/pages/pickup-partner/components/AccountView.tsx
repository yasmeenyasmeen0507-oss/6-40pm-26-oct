import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, CreditCard, FileText, BookOpen, LogOut, ChevronLeft } from 'lucide-react';

interface AccountViewProps {
    username: string;
    mobile: string;
    version: string;
    onLogout: () => void;
}

export default function AccountView({ username, mobile, version, onLogout }: AccountViewProps) {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="bg-white p-4 flex items-center gap-3 sticky top-0 border-b border-slate-100">
                <Button variant="ghost" size="icon" className="-ml-2">
                    <ChevronLeft className="w-6 h-6 text-slate-700" />
                </Button>
                <h1 className="text-lg font-semibold text-slate-900">Account</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-500 p-0.5 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="profile" className="w-full h-full object-cover rounded-full bg-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 capitalize">{username}</h2>
                        {/* <p className="text-sm text-slate-500">Pick-up Partner</p> */}
                    </div>
                </div>

                <div className="space-y-1 px-1">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>App Version : {version}</span>
                        <span>Mobile : {mobile}</span>
                    </div>
                    <Separator />
                </div>

                {/* Menu Items */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 p-4 h-auto text-red-600 hover:bg-red-50 hover:text-red-700 rounded-none"
                        onClick={onLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Signout</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
