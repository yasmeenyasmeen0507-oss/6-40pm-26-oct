import { Card } from '@/components/ui/card';
import { PickupAssignmentRecord } from '@/types/pickup';
import { Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryViewProps {
    assignments: PickupAssignmentRecord[];
    onOrderClick: (assignment: PickupAssignmentRecord) => void;
}

export default function HistoryView({ assignments, onOrderClick }: HistoryViewProps) {
    // Filter for completed/cancelled
    const historyAssignments = assignments.filter(a =>
        ['completed', 'cancelled', 'collected'].includes((a.status || '').toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-slate-50 px-4 py-6">
            <h1 className="text-xl font-bold text-slate-900 mb-6">Order History</h1>

            {historyAssignments.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500">No history available yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyAssignments.map((assignment) => (
                        <Card
                            key={assignment.id}
                            className="p-4 border border-slate-100 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                            onClick={() => onOrderClick(assignment)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold text-slate-900">{assignment.pickup_request?.customer_name}</h4>
                                    <p className="text-xs text-slate-500">ID: {assignment.pickup_request?.order_id}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${assignment.status === 'completed' || assignment.status === 'collected' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                    }`}>
                                    {assignment.status}
                                </span>
                            </div>

                            {/* Highlighted Model and Price */}
                            <div className="mb-3 flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <span className="text-sm font-bold text-slate-800">
                                    {assignment.pickup_request?.device?.model_name} {assignment.pickup_request?.variant?.storage_gb ? `(${assignment.pickup_request?.variant?.storage_gb} GB)` : ''}
                                </span>
                                <span className="text-sm font-bold text-green-700">
                                    ₹{Number(assignment.collected_amount || 0).toLocaleString('en-IN')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="font-medium text-slate-700">
                                        {assignment.status === 'cancelled' ? 'Cancelled: ' : 'Completed: '}
                                        {assignment.updated_at ? format(new Date(assignment.updated_at), 'dd MMM, hh:mm a') : 'N/A'}
                                    </span>
                                </div>

                                <div className="col-span-2 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{assignment.pickup_request?.address}</span>
                                </div>
                            </div>

                            {assignment.notes && (
                                <div className="mt-3 bg-slate-50 p-2 rounded text-xs text-slate-500 italic">
                                    "{assignment.notes}"
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
