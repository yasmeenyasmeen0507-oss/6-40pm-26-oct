import { Card } from '@/components/ui/card';
import { PickupAssignmentRecord } from '@/types/pickup';
import { Phone, MapPin, ChevronRight, Clock } from 'lucide-react';

interface ProgressViewProps {
    assignments: PickupAssignmentRecord[];
    onOrderClick: (assignment: PickupAssignmentRecord) => void;
    // onUpdate and isUpdating are no longer needed here as editing is moved to details
}

export default function ProgressView({ assignments, onOrderClick }: ProgressViewProps) {
    // Filter for active orders
    const activeAssignments = assignments.filter(a => {
        const s = (a.status || '').toLowerCase();
        return ['assigned', 'in-progress'].includes(s); // Show all active
    });

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-white px-4 py-3 border-b border-slate-100 sticky top-0 z-10">
                <h1 className="text-lg font-bold text-slate-900">In Progress ({activeAssignments.length})</h1>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 pb-20">
                {activeAssignments.length === 0 ? (
                    <div className="text-center py-10 opacity-60">
                        <p>No active orders.</p>
                    </div>
                ) : (
                    activeAssignments.map((assignment) => (
                        <Card
                            key={assignment.id}
                            className="p-4 border border-slate-100 shadow-sm transition-all bg-white active:scale-[0.98] cursor-pointer"
                            onClick={() => onOrderClick(assignment)}
                        >
                            {/* Header: ID, Customer, Model */}
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-mono mb-0.5">{assignment.pickup_request?.order_id}</p>
                                    <h4 className="font-semibold text-slate-800 text-sm">{assignment.pickup_request?.customer_name}</h4>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${assignment.status === 'in-progress' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {assignment.status === 'assigned' ? 'Pending' : assignment.status}
                                    </span>
                                </div>
                            </div>

                            {/* Details: Model, Price */}
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-bold text-slate-900 leading-tight">
                                    {assignment.pickup_request?.device?.brand?.name} {assignment.pickup_request?.device?.model_name}
                                </p>
                                <p className="text-sm font-bold text-green-600">
                                    ₹{assignment.assigned_amount}
                                </p>
                            </div>

                            {/* Footer: Address, Time */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {assignment.pickup_request?.pickup_date} • {assignment.pickup_request?.pickup_time}
                                </div>
                                <div className="flex items-start gap-2 text-xs text-slate-600">
                                    <MapPin className="w-3 h-3 mt-0.5 text-slate-400 shrink-0" />
                                    <span className="line-clamp-1">{assignment.pickup_request?.address}, {assignment.pickup_request?.city?.name}</span>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-end text-xs text-blue-600 font-medium">
                                View Details <ChevronRight className="w-3 h-3 ml-1" />
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
