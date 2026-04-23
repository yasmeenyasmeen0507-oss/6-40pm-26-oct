import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PickupAssignmentRecord } from '@/types/pickup';
import { ChevronLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface OrderDetailsViewProps {
    assignment: PickupAssignmentRecord;
    onBack: () => void;
    onUpdate: (id: string, updates: { collected_amount?: number; notes?: string; status?: string }) => void;
    isUpdating?: boolean;
}

const STATUS_OPTIONS = [
    { value: 'assigned', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'transferred', label: 'Transferred' },
];

export default function OrderDetailsView({ assignment, onBack, onUpdate, isUpdating = false }: OrderDetailsViewProps) {
    const request = assignment.pickup_request;

    // Local state for editing
    const [collectedAmount, setCollectedAmount] = useState(String(assignment.collected_amount || ''));
    const [notes, setNotes] = useState(assignment.notes || '');
    const [status, setStatus] = useState(assignment.status || 'assigned');

    if (!request) return null;

    const handleSave = () => {
        // Validation
        if (notes.trim().length < 5) {
            toast.error("Notes are mandatory and must be at least 5 characters.");
            return;
        }

        onUpdate(assignment.id, {
            collected_amount: Number(collectedAmount),
            notes: notes,
            status: status
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                        <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900">{request.order_id}</h1>
                </div>
                <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center ${status === 'completed' ? 'bg-green-100 text-green-700' :
                        status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                                'bg-blue-100 text-blue-700'
                        }`}>
                        {STATUS_OPTIONS.find(o => o.value === status)?.label || status}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Main Details Card */}
                <Card className="p-5 border-none shadow-sm space-y-6">
                    {/* Device Info */}
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Device Model:</p>
                        <p className="text-md font-semibold text-slate-900">
                            {request.device?.brand?.name} {request.device?.model_name} {request.variant?.storage_gb && `(${request.variant.storage_gb} GB)`}
                        </p>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Customer Name:</p>
                            <p className="text-sm font-medium text-slate-800">{request.customer_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Assigned Amount:</p>
                            <p className="text-sm font-bold text-slate-900">₹{Number(assignment.assigned_amount).toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Phone:</p>
                            <p className="text-sm font-medium text-slate-800">{request.user_phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Email:</p>
                            <p className="text-sm font-medium text-slate-800 break-all">{request.email}</p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Pickup Date:</p>
                            <p className="text-sm font-medium text-slate-800">{request.pickup_date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Pickup Time:</p>
                            <p className="text-sm font-medium text-slate-800">{request.pickup_time}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-slate-400">City :</p>
                            <p className="text-xs font-medium text-slate-700">{request.city?.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400">Pincode :</p>
                            <p className="text-xs font-medium text-slate-700">{request.pincode}</p>
                        </div>
                    </div>


                    {/* Device Condition Assessment */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-semibold text-slate-900">Device Condition Assessment</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500 block">Device Age</span>
                                <span className="font-semibold text-slate-900 capitalize">{request.age_group}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500 block">Overall</span>
                                <span className="font-semibold text-slate-900 capitalize">{request.overall_condition}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500 block">Display</span>
                                <span className="font-semibold text-slate-900 capitalize">{request.display_condition}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500 block">Body</span>
                                <span className="font-semibold text-slate-900 capitalize">{request.body_condition}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            {[
                                { label: 'Can Make Calls', val: request.can_make_calls },
                                { label: 'Touch Working', val: request.is_touch_working },
                                { label: 'Screen Original', val: request.is_screen_original },
                                { label: 'Battery Healthy', val: request.is_battery_healthy },
                                { label: 'Has Charger', val: request.has_charger },
                                { label: 'Has Box', val: request.has_box },
                                { label: 'Has Bill', val: request.has_bill },
                            ].map((item, idx) => (
                                <div key={idx} className={`flex items-center justify-between p-2 rounded border ${item.val ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                    <span className="text-slate-700 font-medium">{item.label}</span>
                                    <span className={`font-bold ${item.val ? 'text-green-600' : 'text-red-500'}`}>{item.val ? 'Yes' : 'No'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Controls / Inputs */}
                <Card className="p-5 border-none shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-800">Update Order</h3>

                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 font-bold uppercase">Status</label>
                        <Select
                            value={status}
                            onValueChange={(val) => setStatus(val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 font-bold uppercase">Collected Amount (₹)</label>
                        <Input
                            type="number"
                            value={collectedAmount}
                            onChange={(e) => setCollectedAmount(e.target.value)}
                            className="font-semibold"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 font-bold uppercase">Notes (Min 5 chars) <span className="text-red-500">*</span></label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter remarks..."
                            rows={3}
                            className={notes.length > 0 && notes.length < 5 ? "border-red-300 focus-visible:ring-red-300" : ""}
                        />
                        {notes.length > 0 && notes.length < 5 && (
                            <p className="text-[10px] text-red-500">Minimum 5 characters required.</p>
                        )}
                    </div>
                </Card>

                {/* Actions */}
                <div className="pt-2">
                    <Button
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold shadow-md"
                        onClick={handleSave}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Submit
                    </Button>
                </div>
            </div >
        </div >
    );
}
