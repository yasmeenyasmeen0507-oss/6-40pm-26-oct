import { usePickupNotifications } from '@/hooks/usePickupNotifications';
import { NewPickupNotification } from '@/components/admin/NewPickupNotification';
import { useState } from 'react';
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
  Package
} from 'lucide-react';
import { logAdminActivity } from '@/lib/admin/auth';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { format, formatDistanceToNow } from 'date-fns';

interface PickupRequest {
  id: string;
  customer_name: string;
  user_phone: string;
  email?: string;
  address?: string;
  pincode?: string;
  pickup_date: string;
  pickup_time?: string;
  status: string;
  final_price: number;
  created_at: string;
  notes?: string;
  updated_by?: string;
  updated_at?: string;
  
  // Device condition answers
  display_condition?: string;
  body_condition?: string;
  functional_issue?: string;
  warranty_status?: string;
  has_charger?: boolean;
  has_box?: boolean;
  has_bill?: boolean;
  
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
}

export default function AdminPickupRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const { newRequest, isAlarmPlaying, acceptRequest } = usePickupNotifications();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [noteText, setNoteText] = useState('');
  const { session } = useAdminAuth();
  const queryClient = useQueryClient();

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
        query = query.eq('status', statusFilter);
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, oldStatus }: { id: string; status: string; oldStatus: string }) => {
      console.log('🔄 Updating status:', { id, from: oldStatus, to: status });

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
        console.error('❌ Status update failed:', error);
        throw new Error(error.message || 'Failed to update status');
      }

      if (!data || data.length === 0) {
        throw new Error('No rows were updated. Check permissions.');
      }

      console.log('✅ Status updated successfully:', data[0]);

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
      console.error('❌ Status update error:', error);
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
      console.error('Notes update error:', error);
      toast.error('Failed to save notes');
    },
  });

  const handleOpenNotes = (request: PickupRequest) => {
    setSelectedRequest(request);
    setNoteText(request.notes || '');
    setNotesDialogOpen(true);
  };

  const handleOpenDetails = (request: PickupRequest) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (!selectedRequest) return;
    updateNotesMutation.mutate({
      id: selectedRequest.id,
      notes: noteText,
    });
  };

  const filteredRequests = requests?.filter((request) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      request.customer_name?.toLowerCase().includes(search) ||
      request.user_phone?.includes(search) ||
      request.device?.model_name?.toLowerCase().includes(search) ||
      request.device?.brand?.name?.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      'in-transit': 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      'in-transit': 'In Transit',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const exportToCSV = () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const headers = [
        'ID',
        'Customer Name',
        'Phone',
        'Email',
        'Device',
        'Storage',
        'City',
        'Address',
        'Pincode',
        'Request Time',
        'Pickup Date',
        'Pickup Time',
        'Status',
        'Final Price',
        'Display Condition',
        'Body Condition',
        'Functional Issue',
        'Warranty Status',
        'Has Charger',
        'Has Box',
        'Has Bill',
        'Notes',
        'Updated By',
        'Updated At',
        'Created At',
      ];

      const rows = filteredRequests.map((req) => [
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
        req.display_condition || '',
        req.body_condition || '',
        req.functional_issue || '',
        req.warranty_status || '',
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
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pickup Requests</h1>
            <p className="text-slate-500 mt-1">Manage all customer pickup requests</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load pickup requests</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NewPickupNotification
        request={newRequest}
        onAccept={acceptRequest}
        isAlarmPlaying={isAlarmPlaying}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pickup Requests</h1>
          <p className="text-slate-500 mt-1">
            Manage all customer pickup requests{' '}
            {filteredRequests && `(${filteredRequests.length} total)`}
            {session && (
              <span className="text-blue-600 ml-2">
                • Logged in as: {session.user.username}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          disabled={!filteredRequests || filteredRequests.length === 0}
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, phone, or device..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <span>{statusFilter === 'all' ? 'All Status' : getStatusLabel(statusFilter)}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !filteredRequests || filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">
                {searchQuery ? 'No matching requests found' : 'No pickup requests found'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Request Time</TableHead>
                    <TableHead>Pickup Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <button
                            onClick={() => handleOpenDetails(request)}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                          >
                            {request.customer_name}
                          </button>
                          <div className="text-sm text-slate-500">{request.user_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {request.device?.brand?.name} {request.device?.model_name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {request.variant?.storage_gb}GB
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.city?.name}</TableCell>
                      
                      {/* ✅ Request Time Column */}
                      <TableCell>
                        <div className="text-sm">
                          <div 
                            className="font-medium text-slate-700"
                            title={format(new Date(request.created_at), 'MMM dd, yyyy HH:mm:ss')}
                          >
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                          </div>
                          <div className="text-xs text-slate-400">
                            {format(new Date(request.created_at), 'HH:mm:ss')}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {request.pickup_date
                            ? format(new Date(request.pickup_date), 'MMM dd, yyyy')
                            : 'N/A'}
                          {request.updated_at && request.updated_by && (
                            <div className="text-xs text-slate-400 mt-1">
                              by {request.updated_by}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{Number(request.final_price).toLocaleString('en-IN')}
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
                          <SelectTrigger className="w-[140px] border">
                            <Badge variant="secondary" className={getStatusColor(request.status)}>
                              {updateStatusMutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : null}
                              {getStatusLabel(request.status)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="confirmed">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                Confirmed
                              </div>
                            </SelectItem>
                            <SelectItem value="in-transit">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                In Transit
                              </div>
                            </SelectItem>
                            <SelectItem value="completed">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Completed
                              </div>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                Cancelled
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenNotes(request)}
                          title={request.notes ? 'View/Edit Notes' : 'Add Notes'}
                        >
                          <FileText className={`h-4 w-4 ${request.notes ? 'text-blue-600' : 'text-slate-400'}`} />
                          {request.notes && (
                            <span className="ml-1 text-xs text-blue-600">✓</span>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="View Full Details"
                          onClick={() => handleOpenDetails(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Pickup Request Details</DialogTitle>
            <DialogDescription>
              Complete information about this pickup request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="font-medium">{selectedRequest.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="font-medium">{selectedRequest.user_phone}</p>
                  </div>
                  {selectedRequest.email && (
                    <div>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </p>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> City
                    </p>
                    <p className="font-medium">{selectedRequest.city?.name || 'N/A'}</p>
                  </div>
                  {selectedRequest.address && (
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium">{selectedRequest.address}</p>
                    </div>
                  )}
                  {selectedRequest.pincode && (
                    <div>
                      <p className="text-sm text-slate-500">Pincode</p>
                      <p className="font-medium">{selectedRequest.pincode}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Device Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Device Information
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-4">
                    {selectedRequest.device?.image_url && (
                      <img 
                        src={selectedRequest.device.image_url} 
                        alt={selectedRequest.device.model_name}
                        className="w-20 h-20 object-contain rounded border"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Brand & Model</p>
                      <p className="font-semibold text-lg">
                        {selectedRequest.device?.brand?.name} {selectedRequest.device?.model_name}
                      </p>
                      {selectedRequest.device?.series && (
                        <p className="text-sm text-slate-600">{selectedRequest.device.series}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Storage</p>
                      <p className="font-medium">{selectedRequest.variant?.storage_gb}GB</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Category</p>
                      <p className="font-medium capitalize">{selectedRequest.device?.brand?.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Device Condition (Customer Answers) */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Device Condition Assessment
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  {selectedRequest.display_condition && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Display Condition:</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedRequest.display_condition}
                      </Badge>
                    </div>
                  )}
                  {selectedRequest.body_condition && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Body Condition:</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedRequest.body_condition}
                      </Badge>
                    </div>
                  )}
                  {selectedRequest.functional_issue && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Functional Issues:</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedRequest.functional_issue}
                      </Badge>
                    </div>
                  )}
                  {selectedRequest.warranty_status && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Warranty Status:</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedRequest.warranty_status}
                      </Badge>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      {selectedRequest.has_charger ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">Charger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRequest.has_box ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">Box</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRequest.has_bill ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">Bill</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pickup Schedule */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Pickup Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Date
                    </p>
                    <p className="font-medium">
                      {selectedRequest.pickup_date
                        ? format(new Date(selectedRequest.pickup_date), 'MMMM dd, yyyy')
                        : 'Not scheduled'}
                    </p>
                  </div>
                  {selectedRequest.pickup_time && (
                    <div>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Time
                      </p>
                      <p className="font-medium">{selectedRequest.pickup_time}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Pricing & Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                  Pricing & Status
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-500">Final Price</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{Number(selectedRequest.final_price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {getStatusLabel(selectedRequest.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-slate-600" />
                      Admin Notes
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-slate-700 whitespace-pre-wrap">{selectedRequest.notes}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Metadata */}
              <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded space-y-1">
                <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                <p><strong>Created:</strong> {format(new Date(selectedRequest.created_at), 'MMM dd, yyyy HH:mm:ss')} UTC</p>
                {selectedRequest.updated_at && (
                  <>
                    <p><strong>Last Updated:</strong> {format(new Date(selectedRequest.updated_at), 'MMM dd, yyyy HH:mm:ss')} UTC</p>
                    {selectedRequest.updated_by && (
                      <p><strong>Updated By:</strong> {selectedRequest.updated_by}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setDetailsDialogOpen(false);
              if (selectedRequest) handleOpenNotes(selectedRequest);
            }}>
              <FileText className="mr-2 h-4 w-4" />
              Edit Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <div className="space-y-1 mt-2">
                  <div><strong>Customer:</strong> {selectedRequest.customer_name}</div>
                  <div><strong>Phone:</strong> {selectedRequest.user_phone}</div>
                  <div><strong>Device:</strong> {selectedRequest.device?.brand?.name} {selectedRequest.device?.model_name}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Notes:
              </label>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add internal notes about this pickup request..."
                className="min-h-[150px]"
                rows={8}
              />
              <p className="text-xs text-slate-500 mt-2">
                {noteText.length} characters
              </p>
            </div>
            {selectedRequest?.updated_by && selectedRequest?.updated_at && (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border">
                <div><strong>Last updated:</strong> {format(new Date(selectedRequest.updated_at), 'MMM dd, yyyy HH:mm:ss')} UTC</div>
                <div><strong>Updated by:</strong> {selectedRequest.updated_by}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNotesDialogOpen(false);
              setNoteText('');
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotes}
              disabled={updateNotesMutation.isPending}
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