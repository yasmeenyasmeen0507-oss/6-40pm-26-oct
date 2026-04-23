import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { PickupAssignmentRecord } from '@/types/pickup';
import { Users } from 'lucide-react';

export default function PickupAgentsPage() {
  const queryClient = useQueryClient();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pickup-agents-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pickup_assignments')
        .select(
          '*,' +
            ' pickup_agent:pickup_agents(username),' +
            ' pickup_request:pickup_requests(order_id, customer_name, status)'
        );

      if (error) throw error;
      const normalized = (data || []).map((item: any) => ({
        ...item,
        pickup_request: Array.isArray(item.pickup_request) ? item.pickup_request[0] : item.pickup_request,
      }));
      return normalized as unknown as PickupAssignmentRecord[];
    },
    refetchInterval: 15000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('pickup-agents-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_assignments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['pickup-agents-summary'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const assignments = useMemo(() => {
    if (!data) return [] as PickupAssignmentRecord[];
    const sorted = [...(data as PickupAssignmentRecord[])].sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime()
    );

    if (!fromDate && !toDate) return sorted;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59.999Z`) : null;

    return sorted.filter((item) => {
      const dateSource = item.updated_at || item.created_at;
      if (!dateSource) return false;
      const d = new Date(dateSource);
      if (Number.isNaN(d.getTime())) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [data, fromDate, toDate]);

  const totals = useMemo(() => {
    return assignments.reduce(
      (acc, item) => {
        acc.assigned += Number(item.assigned_amount || 0);
        acc.collected += Number(item.collected_amount || 0);
        acc.pending += Math.max(Number(item.assigned_amount || 0) - Number(item.collected_amount || 0), 0);
        acc.pickups += 1;
        return acc;
      },
      { assigned: 0, collected: 0, pending: 0, pickups: 0 }
    );
  }, [assignments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pickup Agents</h1>
          <p className="text-gray-500 mt-1">Live overview of partner performance.</p>
        </div>
        <Badge variant="outline" className="bg-white text-gray-700 border-gray-200">
          {assignments.length} pickups
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border-none shadow-md hover:translate-y-[-2px] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-gray-900">Rs {totals.assigned.toLocaleString('en-IN')}</CardContent>
        </Card>
        <Card className="bg-white border-none shadow-md hover:translate-y-[-2px] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Collected</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">Rs {totals.collected.toLocaleString('en-IN')}</CardContent>
        </Card>
        <Card className="bg-white border-none shadow-md hover:translate-y-[-2px] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-amber-600">Rs {totals.pending.toLocaleString('en-IN')}</CardContent>
        </Card>
        <Card className="bg-white border-none shadow-md hover:translate-y-[-2px] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Total Pickups Assigned</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-gray-900">{totals.pickups}</CardContent>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="w-5 h-5 text-blue-600" /> Agent Breakdown
          </CardTitle>
          <Badge variant="outline" className="bg-gray-100 border-gray-200 text-gray-600">Live</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4 mb-4">
            <div className="space-y-1 w-full sm:w-48">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">From</p>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1 w-full sm:w-48">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">To</p>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                }}
                className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-6">Showing all assigned pickups. Set From/To to narrow the list.</p>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((key) => (
                <Skeleton key={key} className="h-12 w-full bg-gray-100" />
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p>No assignments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50 bg-slate-50/80">
                    <TableHead className="text-gray-600 font-semibold">Order ID</TableHead>
                    <TableHead className="text-gray-500">Pickup Agent</TableHead>
                    <TableHead className="text-gray-500">Assigned</TableHead>
                    <TableHead className="text-gray-500">Collected</TableHead>
                    <TableHead className="text-gray-500">Status</TableHead>
                    <TableHead className="text-gray-500">Pickup Date</TableHead>
                    <TableHead className="text-gray-500">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => {
                    const pickupDate = assignment.updated_at || assignment.created_at;
                    const formattedDate = pickupDate
                      ? new Date(pickupDate).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—';

                    return (
                      <TableRow key={assignment.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="text-gray-900 font-medium">
                          {assignment.pickup_request?.order_id || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {assignment.pickup_agent?.username || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          Rs {Number(assignment.assigned_amount || 0).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          Rs {Number(assignment.collected_amount || 0).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-sky-600 capitalize">{assignment.status || 'N/A'}</TableCell>
                        <TableCell className="text-gray-600 whitespace-nowrap">{formattedDate}</TableCell>
                        <TableCell className="text-gray-600 max-w-xs break-words">{assignment.notes || '—'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
