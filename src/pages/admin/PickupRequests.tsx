import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  Download,
  Loader2,
  FileText,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Smartphone,
  CheckCircle,
  XCircle,
  Package,
  Hash,
  UserPlus,
  ClipboardList
} from 'lucide-react';
import { logAdminActivity } from '@/lib/admin/auth';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { PickupAgent, PickupAssignmentRecord } from '@/types/pickup';

// --- INTERFACES ---
interface PickupRequest {
  id: string;
  order_id?: string;
  customer_name: string;
  user_phone: string;
  email?: string;
  address?: string;
  pincode?: string;
  pickup_date: string | null;
  pickup_time?: string;
  status: string;
  final_price: number | null;
  created_at: string;
  notes?: string;
  updated_by?: string;
  updated_at?: string;
  device?: {
    id: string;
    model_name: string;
    series?: string;
    image_url?: string;
    brand: {
      name: string;
      category: string;
    };
  };
  variant?: {
    storage_gb: number;
  };
  city?: {
    name: string;
  };
  condition?: string;
  age_group?: string;
  age_range?: string;
  has_charger?: boolean;
  has_bill?: boolean;
  has_box?: boolean;
  can_make_calls?: boolean;
  is_touch_working?: boolean;
  is_screen_original?: boolean;
  is_battery_healthy?: boolean;
  device_powers_on?: boolean;
  display_condition?: string;
  body_condition?: string;
  overall_condition?: string;
}

// --- STATUS CONFIGURATION ---
const ALL_STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-white text-red-600 border-red-200 animate-pulse shadow-sm" },
  { value: "rnr", label: "RNR", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "not-interested", label: "Not Interested", color: "bg-gray-50 text-gray-600 border-gray-200" },
  { value: "scheduled", label: "Scheduled", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "rescheduled", label: "Rescheduled", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "in-progress", label: "In Progress", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "completed", label: "Completed", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "pending", label: "Pending (Legacy)", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "confirmed", label: "Confirmed (Legacy)", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "in-transit", label: "In Transit (Legacy)", color: "bg-purple-50 text-purple-700 border-purple-200" },
];
const statusMap = Object.fromEntries(ALL_STATUS_OPTIONS.map((s) => [s.value, s]));
const getStatusLabel = (status: string) => statusMap[status]?.label ?? status;
const getStatusColor = (status: string) => statusMap[status]?.color ?? "bg-gray-50 text-gray-600 border-gray-200";

const FILTER_GROUPS: { [key: string]: string[] } = {
  new: ["new"],
  rnr: ["pending", "rnr"],
  scheduled: ["confirmed", "scheduled"],
  "in-progress": ["in-transit", "in-progress"],
  rescheduled: ["rescheduled"],
  completed: ["completed"],
  cancelled: ["cancelled"],
  "not-interested": ["not-interested"]
};

export default function AdminPickupRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // --- DIALOG STATES ---
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [noteText, setNoteText] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<PickupRequest | null>(null);
  const [assignAgentId, setAssignAgentId] = useState('');
  const [assignAmount, setAssignAmount] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<{ request: PickupRequest; assignment: PickupAssignmentRecord } | null>(null);

  const { session } = useAdminAuth();
  const queryClient = useQueryClient();

  const { data: pickupAgents } = useQuery<PickupAgent[]>({
    queryKey: ['pickup-agents-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pickup_agents').select('id, username, created_at');
      if (error) throw error;
      return data as PickupAgent[];
    },
  });

  const { data: pickupAssignments } = useQuery<PickupAssignmentRecord[]>({
    queryKey: ['pickup-assignments-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pickup_assignments')
        .select('*, pickup_agent:pickup_agents(username)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as PickupAssignmentRecord[];
    },
    refetchInterval: 20000,
  });

  const assignmentMap = useMemo(() => {
    const map: Record<string, PickupAssignmentRecord> = {};
    (pickupAssignments || []).forEach((assignment) => {
      map[assignment.pickup_request_id] = assignment;
    });
    return map;
  }, [pickupAssignments]);

  useEffect(() => {
    const channel = supabase
      .channel('pickup-assignments-admin-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_assignments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['pickup-assignments-admin'] });
        queryClient.invalidateQueries({ queryKey: ['pickup-agents-summary'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // --- MAIN QUERY ---
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['admin-pickup-requests', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('pickup_requests')
        .select(
          `
          *,
          device:devices(id, model_name, series, image_url, brand:brands(name, category)),
          variant:variants(storage_gb),
          city:cities(name)
          `
        )
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        const filterValues = FILTER_GROUPS[statusFilter] || [statusFilter];
        query = query.in('status', filterValues);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Failed to fetch pickup requests:', error);
        throw error;
      }
      return data as PickupRequest[];
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  // --- MUTATIONS ---
  const assignPickupMutation = useMutation({
    mutationFn: async (payload: { pickup_request_id: string; pickup_agent_id: string; assigned_amount: number; notes?: string }) => {
      const { data: existing } = await supabase
        .from('pickup_assignments')
        .select('id')
        .eq('pickup_request_id', payload.pickup_request_id)
        .maybeSingle();

      const baseData = {
        pickup_request_id: payload.pickup_request_id,
        pickup_agent_id: payload.pickup_agent_id,
        assigned_amount: payload.assigned_amount,
        notes: payload.notes || null,
        status: 'assigned',
        updated_at: new Date().toISOString(),
      };

      if (existing?.id) {
        const { data, error } = await supabase
          .from('pickup_assignments')
          .update(baseData)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        const assignment = data as PickupAssignmentRecord;
        return assignment;
      }

      const { data, error } = await supabase
        .from('pickup_assignments')
        .insert({ ...baseData, collected_amount: 0 })
        .select()
        .single();
      if (error) throw error;
      return data as PickupAssignmentRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-assignments-admin'] });
      queryClient.invalidateQueries({ queryKey: ['pickup-agents-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pickup-requests'] });
      toast.success('Pickup assigned');
      setAssignDialogOpen(false);
      setAssignTarget(null);
      setAssignAgentId('');
      setAssignAmount('');
      setAssignNotes('');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to assign pickup');
    },
  });

  const cancelAssignmentMutation = useMutation({
    mutationFn: async ({ assignmentId, pickupRequestId }: { assignmentId: string; pickupRequestId: string }) => {
      const { error: deleteError } = await supabase
        .from('pickup_assignments')
        .delete()
        .eq('id', assignmentId);
      if (deleteError) throw deleteError;

      const updateData: any = {
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      };
      if (session?.user?.username) {
        updateData.updated_by = session.user.username;
      }

      const { error: updateError } = await supabase
        .from('pickup_requests')
        .update(updateData)
        .eq('id', pickupRequestId);
      if (updateError) throw updateError;

      if (session) {
        logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'assignment_cancel',
          table_name: 'pickup_requests',
          record_id: pickupRequestId,
          after_data: { status: 'cancelled', updated_by: session.user.username },
        }).catch((err) => console.warn('⚠️ Activity log failed:', err));
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-assignments-admin'] });
      queryClient.invalidateQueries({ queryKey: ['pickup-agents-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pickup-requests'] });
      queryClient.invalidateQueries({ queryKey: ['pickup-partner-assignments'] });
      toast.success('Assignment cancelled and pickup unassigned');
      setCancelDialogOpen(false);
      setCancelTarget(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to cancel assignment');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, oldStatus }: { id: string; status: string; oldStatus: string }) => {
      const updateData: any = { status };
      if (session?.user?.username) {
        updateData.updated_by = session.user.username;
      }
      const { data, error } = await supabase
        .from('pickup_requests')
        .update(updateData)
        .eq('id', id)
        .select();
      if (error) {
        throw new Error(error.message || 'Failed to update status');
      }
      if (!data || data.length === 0) {
        throw new Error('No rows were updated.  Check permissions.');
      }
      if (session) {
        logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'status_change',
          table_name: 'pickup_requests',
          record_id: id,
          before_data: { status: oldStatus },
          after_data: { status, updated_by: session.user.username },
        }).catch((err) => console.warn('⚠️ Activity log failed:', err));
      }
      return data[0];
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-pickup-requests'] });
      const previousData = queryClient.getQueryData(['admin-pickup-requests', statusFilter]);
      queryClient.setQueryData(['admin-pickup-requests', statusFilter], (old: any) => {
        if (!old) return old;
        return old.map((request: any) =>
          request.id === id ? { ...request, status } : request
        );
      });
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['admin-pickup-requests', statusFilter], context.previousData);
      }
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pickup-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast.success('Status updated successfully');
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const updateData: any = { notes };
      if (session?.user?.username) {
        updateData.updated_by = session.user.username;
      }
      const { data, error } = await supabase
        .from('pickup_requests')
        .update(updateData)
        .eq('id', id)
        .select();
      if (error) throw error;
      if (session) {
        logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'update',
          table_name: 'pickup_requests',
          record_id: id,
          after_data: { notes, updated_by: session.user.username },
        }).catch((err) => console.warn('Failed to log notes update:', err));
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pickup-requests'] });
      toast.success('Notes saved successfully');
      setNotesDialogOpen(false);
      setSelectedRequest(null);
      setNoteText('');
    },
    onError: (error) => {
      toast.error('Failed to save notes');
    },
  });

  const handleOpenNotes = (request: PickupRequest) => {
    setSelectedRequest(request);
    setNoteText(request.notes || '');
    setNotesDialogOpen(true);
  };
  const handleOpenAssign = (request: PickupRequest) => {
    setAssignTarget(request);
    const existing = assignmentMap[request.id];
    setAssignAgentId(existing?.pickup_agent_id || '');
    setAssignAmount(
      existing?.assigned_amount !== undefined
        ? String(existing.assigned_amount)
        : request.final_price
          ? String(request.final_price)
          : ''
    );
    setAssignNotes(existing?.notes || '');
    setAssignDialogOpen(true);
  };
  const handleOpenCancel = (request: PickupRequest) => {
    const assignment = assignmentMap[request.id];
    if (!assignment) return;
    setCancelTarget({ request, assignment });
    setCancelDialogOpen(true);
  };
  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    cancelAssignmentMutation.mutate({
      assignmentId: cancelTarget.assignment.id,
      pickupRequestId: cancelTarget.request.id,
    });
  };
  const handleOpenDetails = (request: PickupRequest) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };
  const handleSaveNotes = () => {
    if (!selectedRequest) return;
    updateNotesMutation.mutate({ id: selectedRequest.id, notes: noteText });
  };
  const handleSaveAssignment = () => {
    if (!assignTarget) return;
    if (!assignAgentId) {
      toast.error('Select a pickup partner');
      return;
    }
    const amountNumber = Number(assignAmount || 0);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      toast.error('Assigned amount must be greater than zero');
      return;
    }
    assignPickupMutation.mutate({
      pickup_request_id: assignTarget.id,
      pickup_agent_id: assignAgentId,
      assigned_amount: amountNumber,
      notes: assignNotes,
    });
  };

  const filteredRequests = requests?.filter((request) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      request.customer_name?.toLowerCase().includes(search) ||
      request.user_phone?.includes(search) ||
      request.order_id?.toLowerCase().includes(search) ||
      request.device?.model_name?.toLowerCase().includes(search) ||
      request.device?.brand?.name?.toLowerCase().includes(search)
    );
  });

  const exportToCSV = () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      toast.error('No data to export');
      return;
    }
    try {
      const headers = [
        '#', 'Order ID', 'ID', 'Customer Name', 'Phone', 'Email', 'Device', 'Storage', 'City', 'Address', 'Pincode',
        'Request Time', 'Pickup Date', 'Pickup Time', 'Status', 'Final Price',
        'Condition', 'Age Group/Age Range', 'Overall Condition', 'Can Make Calls', 'Touch Working', 'Screen Original', 'Battery Healthy',
        'Display Condition', 'Body Condition', 'Has Charger', 'Has Box', 'Has Bill', 'Notes', 'Updated By', 'Updated At', 'Created At'
      ];
      const rows = filteredRequests.map((req, idx) => [
        idx + 1,
        req.order_id || '',
        req.id,
        req.customer_name,
        req.user_phone,
        req.email || '',
        `${req.device?.brand?.name || ''} ${req.device?.model_name || ''}`,
        `${req.variant?.storage_gb || ''}GB`,
        req.city?.name || '',
        req.address || '',
        req.pincode || '',
        format(new Date(req.created_at), 'yyyy-MM-dd HH:mm:ss'),
        req.pickup_date || '',
        req.pickup_time || '',
        req.status,
        req.final_price,
        req.condition || '',
        req.age_group || req.age_range || '',
        req.overall_condition || '',
        req.can_make_calls ? 'Yes' : 'No',
        req.is_touch_working ? 'Yes' : 'No',
        req.is_screen_original ? 'Yes' : 'No',
        req.is_battery_healthy ? 'Yes' : 'No',
        req.display_condition || '',
        req.body_condition || '',
        req.has_charger ? 'Yes' : 'No',
        req.has_box ? 'Yes' : 'No',
        req.has_bill ? 'Yes' : 'No',
        req.notes || '',
        req.updated_by || '',
        req.updated_at ? format(new Date(req.updated_at), 'yyyy-MM-dd HH:mm:ss') : '',
        format(new Date(req.created_at), 'yyyy-MM-dd HH:mm:ss'),
      ]);
      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pickup-requests-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      if (session) {
        logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'export',
          table_name: 'pickup_requests',
          after_data: { count: filteredRequests.length },
        }).catch((err) => console.warn('Failed to log export:', err));
      }
      toast.success(`Exported ${filteredRequests.length} requests`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pickup requests</h1>
            <p className="text-gray-500 mt-1">Manage all customer pickup requests</p>
          </div>
        </div>
        <Card className="bg-white border-gray-100 shadow-sm">
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load pickup requests</p>
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-500 text-white">Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pickup Requests</h1>
          <p className="text-gray-500 mt-1">
            Manage all customer pickup requests{' '}
            {filteredRequests && `(${filteredRequests.length} total)`}
            {session && (
              <span className="text-blue-600 ml-2">
                • Logged in as:  {session.user.username}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          disabled={!filteredRequests || filteredRequests.length === 0}
          variant="outline"
          className="border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-white border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, order ID, or device..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[220px] bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                <span>{statusFilter === 'all' ? 'All Status' : getStatusLabel(statusFilter)}</span>
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Status</SelectItem>
                {ALL_STATUS_OPTIONS.filter((s, i, arr) =>
                  arr.findIndex(x => x.value === s.value) === i
                ).map(s => (
                  <SelectItem key={s.value} value={s.value} className="text-gray-900 hover:bg-gray-100">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-gray-100" />
              ))}
            </div>
          ) : !filteredRequests || filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No matching requests found' : 'No pickup requests found'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50/50 bg-gray-50/80">
                    <TableHead className="text-gray-600">#</TableHead>
                    <TableHead className="text-gray-600">Order ID</TableHead>
                    <TableHead className="text-gray-600">Customer</TableHead>
                    <TableHead className="text-gray-600">Device</TableHead>
                    <TableHead className="text-gray-600">City</TableHead>
                    <TableHead className="text-gray-600">Request Time</TableHead>
                    <TableHead className="text-gray-600">Pickup Date</TableHead>
                    <TableHead className="text-gray-600">Price</TableHead>
                    <TableHead className="text-gray-600">Assignment</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Notes</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request, index) => (
                    <TableRow key={request.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell className="font-mono text-sm text-gray-500">{index + 1}</TableCell>
                      <TableCell>
                        {request.order_id ? (
                          <Badge variant="outline" className="font-mono text-xs bg-purple-50 text-purple-600 border-purple-200">
                            <Hash className="w-3 h-3 mr-1" />
                            {request.order_id.replace('#', '')}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">No ID</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <button
                            onClick={() => handleOpenDetails(request)}
                            className="font-medium text-purple-700 hover:text-purple-900 hover:underline cursor-pointer text-left"
                          >
                            {request.customer_name}
                          </button>
                          <div className="text-sm text-gray-500">{request.user_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{request.device?.brand?.name} {request.device?.model_name}</div>
                          <div className="text-sm text-gray-500">{request.variant?.storage_gb}GB</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{request.city?.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-700" title={format(new Date(request.created_at), 'MMM dd, yyyy HH:mm:ss')}>
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {format(new Date(request.created_at), 'HH:mm:ss')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-gray-700">
                            {request.pickup_date
                              ? format(new Date(request.pickup_date), 'MMM dd, yyyy')
                              : 'N/A'}
                          </div>
                          {request.updated_at && request.updated_by && (
                            <div className="text-xs text-gray-400 mt-1">
                              by {request.updated_by}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-purple-600">
                        ₹{Number(request.final_price || 0).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        {assignmentMap[request.id] ? (
                          <div className="space-y-1">
                            <div className="text-gray-900 font-medium flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-blue-500" />
                              {assignmentMap[request.id].pickup_agent?.username || 'Assigned'}
                              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                                Assigned
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              Assigned Rs {Number(assignmentMap[request.id].assigned_amount || 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-green-600">
                              Collected Rs {Number(assignmentMap[request.id].collected_amount || 0).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-gray-100 border-gray-200 text-gray-500">
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={request.status}
                          onValueChange={(value) => {
                            updateStatusMutation.mutate({
                              id: request.id,
                              status: value,
                              oldStatus: request.status,
                            });
                          }}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-[150px] border-gray-200 bg-white shadow-sm transition-all",
                              (request.status === "new")
                                ? "bg-red-50 text-red-700 border-red-200 animate-pulse font-semibold"
                                : ""
                            )}
                          >
                            {(request.status === "new") ? (
                              <span className="flex items-center gap-2">
                                {updateStatusMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                                New
                              </span>
                            ) : (
                              <Badge variant="secondary" className={getStatusColor(request.status)}>
                                {updateStatusMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : null}
                                {getStatusLabel(request.status)}
                              </Badge>
                            )}
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            {ALL_STATUS_OPTIONS.filter(s => !s.label.includes('Legacy')).map(s => (
                              <SelectItem key={s.value} value={s.value} className="text-gray-900 hover:bg-gray-50">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(s.value).split(" ").find((cl) => cl.startsWith("bg-"))}`} />
                                  {s.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenNotes(request)}
                          title={request.notes ? 'View/Edit Notes' : 'Add Notes'}
                          className="text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <FileText className={`h-4 w-4 ${request.notes ? 'text-blue-500' : 'text-gray-400'}`} />
                          {request.notes && (
                            <span className="ml-1 text-xs text-blue-600">✓</span>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const assignment = assignmentMap[request.id];
                          const isAccepted = assignment && assignment.status && assignment.status !== 'assigned';
                          return (
                            <div className="flex items-center gap-1">
                              {!assignment && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Assign Pickup"
                                  onClick={() => handleOpenAssign(request)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              )}
                              {assignment && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Cancel Assigned Pickup"
                                  onClick={() => handleOpenCancel(request)}
                                  disabled={cancelAssignmentMutation.isPending}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-60"
                                >
                                  Cancel
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                title="View Full Details"
                                onClick={() => handleOpenDetails(request)}
                                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[520px] bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <UserPlus className="w-5 h-5 text-blue-600" /> Assign Pickup
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Assign this request to a pickup partner without altering the original request.
            </DialogDescription>
          </DialogHeader>
          {assignTarget ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{assignTarget.customer_name}</p>
                <p className="text-gray-500">Order: {assignTarget.order_id || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Pickup Partner</label>
                <Select value={assignAgentId} onValueChange={setAssignAgentId}>
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                    {assignAgentId ? pickupAgents?.find((a) => a.id === assignAgentId)?.username : 'Select partner'}
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {pickupAgents?.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id} className="text-gray-900 hover:bg-gray-50">
                        {agent.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Assigned Amount</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={assignAmount}
                  onChange={(e) => setAssignAmount(e.target.value)}
                  className="bg-white border-gray-200 text-gray-900"
                  placeholder="Enter agreed amount"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Notes</label>
                <Textarea
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  className="bg-white border-gray-200 text-gray-900"
                  placeholder="Any handover instructions for the partner"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Select a pickup request to assign.</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignDialogOpen(false);
                setAssignTarget(null);
              }}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAssignment}
              disabled={assignPickupMutation.isPending || !assignTarget}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {assignPickupMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving
                </span>
              ) : (
                'Assign Pickup'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Assignment Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onOpenChange={(open) => {
          setCancelDialogOpen(open);
          if (!open) {
            setCancelTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px] bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Cancel Assigned Pickup</DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to cancel this assigned pickup?
            </DialogDescription>
          </DialogHeader>
          {cancelTarget && (
            <div className="space-y-3 text-sm text-gray-600">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="font-semibold text-gray-900">{cancelTarget.request.customer_name}</div>
                <div className="text-gray-500 text-xs">Order: {cancelTarget.request.order_id || 'Not set'}</div>
                <div className="text-gray-500 text-xs mt-1">Partner: {cancelTarget.assignment.pickup_agent?.username || 'N/A'}</div>
              </div>
              <p className="text-gray-500 text-sm">
                This will remove the assignment from the pickup partner dashboard and mark the pickup as Unassigned.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelTarget(null);
              }}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Keep Assigned
            </Button>
            <Button
              onClick={handleConfirmCancel}
              disabled={cancelAssignmentMutation.isPending}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {cancelAssignmentMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cancelling...
                </span>
              ) : (
                'Yes, cancel pickup'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">Pickup Request Details</DialogTitle>
            <DialogDescription className="text-gray-500">
              Complete information about this pickup request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {selectedRequest.order_id && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Order ID
                    </span>
                    <Badge className="text-lg font-bold bg-blue-600 text-white px-4 py-2">
                      {selectedRequest.order_id}
                    </Badge>
                  </div>
                </div>
              )}
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedRequest.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="font-medium text-gray-900">{selectedRequest.user_phone}</p>
                  </div>
                  {selectedRequest.email && (
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </p>
                      <p className="font-medium text-gray-900">{selectedRequest.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> City
                    </p>
                    <p className="font-medium text-gray-900">{selectedRequest.city?.name || 'N/A'}</p>
                  </div>
                  {selectedRequest.address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{selectedRequest.address}</p>
                    </div>
                  )}
                  {selectedRequest.pincode && (
                    <div>
                      <p className="text-sm text-gray-500">Pincode</p>
                      <p className="font-medium text-gray-900">{selectedRequest.pincode}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* Device Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Device Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-4">
                    {selectedRequest.device?.image_url && (
                      <img
                        src={selectedRequest.device.image_url}
                        alt={selectedRequest.device.model_name}
                        className="w-20 h-20 object-contain rounded border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Brand & Model</p>
                      <p className="font-semibold text-lg text-gray-900">
                        {selectedRequest.device?.brand?.name} {selectedRequest.device?.model_name}
                      </p>
                      {selectedRequest.device?.series && (
                        <p className="text-sm text-gray-500">{selectedRequest.device.series}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Storage</p>
                      <p className="font-medium text-gray-900">{selectedRequest.variant?.storage_gb}GB</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium capitalize text-gray-900">{selectedRequest.device?.brand?.category}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* Device Condition Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Package className="h-5 w-5 text-purple-600" />
                  Device Condition Assessment
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {(selectedRequest.age_group || selectedRequest.age_range) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Device Age: </span>
                      <Badge variant="outline" className="capitalize bg-gray-200 text-gray-900 border-gray-300">
                        {selectedRequest.age_group === "0-3" && "0-3 Months"}
                        {selectedRequest.age_group === "3-6" && "3-6 Months"}
                        {selectedRequest.age_group === "6-11" && "6-11 Months"}
                        {selectedRequest.age_group === "12+" && "12+ Months"}
                        {selectedRequest.age_range && selectedRequest.age_range}
                      </Badge>
                    </div>
                  )}
                  {selectedRequest.overall_condition && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Overall Condition:</span>
                      <Badge
                        variant="outline"
                        className={`capitalize ${selectedRequest.overall_condition === "good"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : selectedRequest.overall_condition === "average"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                      >
                        {selectedRequest.overall_condition.replace("-", " ")}
                      </Badge>
                    </div>
                  )}
                  {selectedRequest.display_condition && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Display Condition:</span>
                      <Badge variant="outline" className="capitalize bg-gray-200 text-gray-900 border-gray-300">
                        {selectedRequest.display_condition}
                      </Badge>
                    </div>
                  )}
                  {selectedRequest.body_condition && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Body Condition:</span>
                      <Badge variant="outline" className="capitalize bg-gray-200 text-gray-900 border-gray-300">
                        {selectedRequest.body_condition}
                      </Badge>
                    </div>
                  )}
                  <Separator className="my-2 bg-gray-200" />
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {typeof selectedRequest.can_make_calls !== "undefined" && (
                      <div className="flex items-center gap-2">
                        {selectedRequest.can_make_calls ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-700">Can Make Calls</span>
                      </div>
                    )}
                    {typeof selectedRequest.is_touch_working !== "undefined" && (
                      <div className="flex items-center gap-2">
                        {selectedRequest.is_touch_working ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-700">Touch Working</span>
                      </div>
                    )}
                    {typeof selectedRequest.is_screen_original !== "undefined" && (
                      <div className="flex items-center gap-2">
                        {selectedRequest.is_screen_original ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-700">Screen Original</span>
                      </div>
                    )}
                    {typeof selectedRequest.is_battery_healthy !== "undefined" && (
                      <div className="flex items-center gap-2">
                        {selectedRequest.is_battery_healthy ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-700">Battery Healthy</span>
                      </div>
                    )}
                  </div>
                  <Separator className="my-2 bg-gray-200" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      {selectedRequest.has_charger ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-700">Charger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRequest.has_box ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-700">Box</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRequest.has_bill ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-700">Bill</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* Pickup Schedule */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Pickup Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Date
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedRequest.pickup_date
                        ? format(new Date(selectedRequest.pickup_date), 'MMMM dd, yyyy')
                        : 'Not scheduled'}
                    </p>
                  </div>
                  {selectedRequest.pickup_time && (
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Time
                      </p>
                      <p className="font-medium text-gray-900">{selectedRequest.pickup_time}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* Pricing & Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                  Pricing & Status
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Final Price</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{Number(selectedRequest.final_price || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {getStatusLabel(selectedRequest.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedRequest.notes && (
                <>
                  <Separator className="bg-gray-200" />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                      <FileText className="h-5 w-5 text-gray-400" />
                      Admin Notes
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedRequest.notes}</p>
                    </div>
                  </div>
                </>
              )}
              {/* Metadata */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded space-y-1">
                <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                {selectedRequest.order_id && (
                  <p><strong>Order ID:</strong> {selectedRequest.order_id}</p>
                )}
                <p>
                  <strong>Created: </strong> {selectedRequest.created_at ? format(new Date(selectedRequest.created_at), 'MMM dd, yyyy HH:mm: ss') : 'N/A'} UTC
                </p>
                {selectedRequest.updated_at && (
                  <>
                    <p>
                      <strong>Last Updated:</strong> {selectedRequest.updated_at ? format(new Date(selectedRequest.updated_at), 'MMM dd, yyyy HH:mm:ss') : 'N/A'} UTC
                    </p>
                    {selectedRequest.updated_by && (
                      <p><strong>Updated By:</strong> {selectedRequest.updated_by}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50">
              Close
            </Button>
            <Button onClick={() => {
              setDetailsDialogOpen(false);
              if (selectedRequest) handleOpenNotes(selectedRequest);
            }} className="bg-blue-600 hover:bg-blue-500 text-white">
              <FileText className="mr-2 h-4 w-4" />
              Edit Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Admin Notes</DialogTitle>
            <DialogDescription className="text-gray-500">
              {selectedRequest && (
                <div className="space-y-1 mt-2">
                  {selectedRequest.order_id && (
                    <div><strong>Order ID:</strong> {selectedRequest.order_id}</div>
                  )}
                  <div><strong>Customer:</strong> {selectedRequest.customer_name}</div>
                  <div><strong>Phone:</strong> {selectedRequest.user_phone}</div>
                  <div><strong>Device:</strong> {selectedRequest.device?.brand?.name} {selectedRequest.device?.model_name}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Notes:
              </label>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add internal notes about this pickup request..."
                className="min-h-[150px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                rows={8}
              />
              <p className="text-xs text-gray-500 mt-2">
                {noteText.length} characters
              </p>
            </div>
            {selectedRequest?.updated_by && selectedRequest?.updated_at && (
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                <div><strong>Last updated: </strong> {selectedRequest.updated_at ? format(new Date(selectedRequest.updated_at), 'MMM dd, yyyy HH:mm:ss') : 'N/A'} UTC</div>
                <div><strong>Updated by:</strong> {selectedRequest.updated_by}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNotesDialogOpen(false);
              setNoteText('');
            }} className="border-gray-200 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotes}
              disabled={updateNotesMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {updateNotesMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
