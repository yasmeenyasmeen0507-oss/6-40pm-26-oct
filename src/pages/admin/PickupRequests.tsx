import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, Eye, Download } from 'lucide-react';
import { logAdminActivity } from '@/lib/admin/auth';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { format } from 'date-fns';

export default function AdminPickupRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { session } = useAdminAuth();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
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

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('pickup_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      if (session) {
        await logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'status_change',
          table_name: 'pickup_requests',
          record_id: id,
          after_data: { status },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pickup-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast.success('Status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const filteredRequests = requests?.filter((request) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      request.customer_name.toLowerCase().includes(search) ||
      request.user_phone.includes(search) ||
      request.device?.model_name.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-transit': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'ID',
      'Customer Name',
      'Phone',
      'Device',
      'Storage',
      'City',
      'Pickup Date',
      'Status',
      'Final Price',
      'Created At',
    ];

    const rows = filteredRequests.map((req) => [
      req.id,
      req.customer_name,
      req.user_phone,
      `${req.device?.brand.name} ${req.device?.model_name}`,
      `${req.variant?.storage_gb}GB`,
      req.city?.name,
      req.pickup_date,
      req.status,
      req.final_price,
      req.created_at,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pickup-requests-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    if (session) {
      logAdminActivity({
        admin_user_id: session.user.id,
        action_type: 'export',
        table_name: 'pickup_requests',
        after_data: { count: filteredRequests.length },
      });
    }

    toast.success('Exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pickup Requests</h1>
          <p className="text-slate-500 mt-1">Manage all customer pickup requests</p>
        </div>
        <Button onClick={exportToCSV} disabled={!filteredRequests || filteredRequests.length === 0}>
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
                <SelectValue placeholder="Filter by status" />
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
              <p className="text-slate-500">No pickup requests found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Pickup Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.customer_name}</div>
                          <div className="text-sm text-slate-500">{request.user_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {request.device?.brand.name} {request.device?.model_name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {request.variant?.storage_gb}GB
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.city?.name}</TableCell>
                      <TableCell>
                        {format(new Date(request.pickup_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{Number(request.final_price).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={request.status}
                          onValueChange={(value) =>
                            updateStatusMutation.mutate({ id: request.id, status: value })
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>
                              <Badge
                                variant="secondary"
                                className={getStatusColor(request.status)}
                              >
                                {request.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-transit">In Transit</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
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
    </div>
  );
}
