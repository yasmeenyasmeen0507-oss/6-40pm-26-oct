import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, PhoneOff } from 'lucide-react';

interface HomeViewProps {
    username: string;
    stats: {
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        total: number;
    };
}

export default function HomeView({ username, stats }: HomeViewProps) {
    return (
        <div className="px-4 py-6 space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Welcome,</p>
                    <h1 className="text-xl font-bold text-slate-900 capitalize">{username}</h1>
                </div>
            </div>

            {/* Main Stats Card */}
            <Card className="bg-blue-600 text-white border-0 shadow-xl overflow-hidden relative">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="p-6">
                    <div className="flex items-start justify-between mb-8">
                        {/* Circular Progress */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            {/* Simplified placeholder for circular progress */}
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-500" />
                                <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white" strokeDasharray="276" strokeDashoffset={276 - (276 * (stats.completed / (stats.total || 1)))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs text-blue-100 font-medium">Completed</span>
                                <span className="text-2xl font-bold">{stats.completed}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-right">
                                <p className="text-xs text-blue-100 mb-1">Pending</p>
                                <p className="text-xl font-bold">{stats.pending}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-blue-100 mb-1">In Progress</p>
                                <p className="text-xl font-bold">{stats.inProgress}</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-blue-500/50 mb-4" />

                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                            <p className="text-[10px] text-blue-100 mb-1">Cancelled</p>
                            <p className="text-lg font-bold">{stats.cancelled}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-blue-100 mb-1">Total Orders</p>
                            <p className="text-lg font-bold">{stats.total}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

