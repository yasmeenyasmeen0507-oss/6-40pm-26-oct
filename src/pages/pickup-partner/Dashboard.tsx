import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePickupPartnerAuth } from '@/contexts/PickupPartnerAuthContext';
import type { PickupAssignmentRecord } from '@/types/pickup';
import DashboardLayout, { TabType } from './components/DashboardLayout';
import HomeView from './components/HomeView';
import ProgressView from './components/ProgressView';
import HistoryView from './components/HistoryView';
import AccountView from './components/AccountView';
import { Button } from '@/components/ui/button';
import { BellRing } from 'lucide-react';
import OrderDetailsView from './components/OrderDetailsView';

export default function PickupPartnerDashboard() {
  const { session, logout } = usePickupPartnerAuth();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedOrder, setSelectedOrder] = useState<PickupAssignmentRecord | null>(null);

  // Alarm State
  const [alertAssignment, setAlertAssignment] = useState<PickupAssignmentRecord | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.loop = true;
  }, []);

  // Data Fetching
  const { data: assignments, isLoading } = useQuery<PickupAssignmentRecord[]>({
    queryKey: ['pickup-partner-assignments', session?.agent.id],
    enabled: Boolean(session?.agent.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pickup_assignments')
        .select(`
          id,
          pickup_request_id,
          pickup_agent_id,
          assigned_amount,
          collected_amount,
          notes,
          status,
          created_at,
          updated_at,
          pickup_request:pickup_requests(
            order_id,
            customer_name,
            user_phone,
            email,
            address,
            pincode,
            pickup_date,
            pickup_time,
            final_price,
            status,
            age_group,
            overall_condition,
            display_condition,
            body_condition,
            can_make_calls,
            is_touch_working,
            is_screen_original,
            is_battery_healthy,
            has_charger,
            has_box,
            has_bill,
            device:devices(model_name, brand:brands(name)),
            variant:variants(storage_gb),
            city:cities(name)
          )
        `)
        .eq('pickup_agent_id', session!.agent.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      // Normalize
      const normalized = (data || []).map((item: any) => ({
        ...item,
        pickup_request: Array.isArray(item.pickup_request) ? item.pickup_request[0] : item.pickup_request,
      }));
      return normalized as PickupAssignmentRecord[];
    },
    refetchInterval: 5000, // Frequent polling for real-time feel
  });

  // Alarm Logic: Check for new 'assigned' orders that haven't been acknowledged
  useEffect(() => {
    if (!assignments) return;
    const newAssignment = assignments.find(a => a.status === 'assigned');

    // If there is an assigned order and we aren't already alerting for it (or another one)
    // Note: In a real app, we might track acknowledged IDs to avoid re-alerting. 
    // For now, assuming "assigned" means "new/unacknowledged".
    if (newAssignment) {
      if (!alertAssignment) {
        setAlertAssignment(newAssignment);
        audioRef.current?.play().catch(() => console.log('Audio autoplay blocked'));
      }
    } else {
      setAlertAssignment(null);
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
  }, [assignments, alertAssignment]);

  const handleStopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlertAssignment(null);
  };

  const handleAcceptAssignment = () => {
    handleStopAlarm();
    if (alertAssignment) {
      updateAssignmentMutation.mutate({
        id: alertAssignment.id,
        collected_amount: Number(alertAssignment.collected_amount || 0),
        status: 'in-progress'
      });
    }
  };

  // Realtime subscription
  useEffect(() => {
    if (!session?.agent.id) return;
    const channel = supabase
      .channel('pickup-partner-assignments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pickup_assignments', filter: `pickup_agent_id=eq.${session.agent.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['pickup-partner-assignments', session.agent.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.agent.id, queryClient]);

  // Mutation for updates
  const updateAssignmentMutation = useMutation({
    mutationFn: async (payload: { id: string; collected_amount: number; notes?: string; status?: string }) => {
      const { data, error } = await supabase
        .from('pickup_assignments')
        .update({
          collected_amount: payload.collected_amount,
          notes: payload.notes ?? null,
          status: payload.status ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.id)
        .select()
        .single();

      if (error) throw error;
      return data as PickupAssignmentRecord;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['pickup-partner-assignments', session?.agent.id] });
      toast.success('Assignment updated successfully');

      // If completed or cancelled, close the details view if open
      if (selectedOrder?.id === vars.id && (vars.status === 'completed' || vars.status === 'cancelled' || vars.status === 'transferred')) {
        setSelectedOrder(null);
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update assignment');
    },
  });

  // Derived Stats
  const stats = useMemo(() => {
    const list = assignments || [];
    // Using ALL assignments from DB as requested ("all the requests which are in db")
    return {
      total: list.length,
      pending: list.filter(a => (a.status || '').toLowerCase() === 'assigned').length,
      inProgress: list.filter(a => (a.status || '').toLowerCase() === 'in-progress').length,
      completed: list.filter(a => (a.status || '').toLowerCase() === 'completed').length,
      cancelled: list.filter(a => (a.status || '').toLowerCase() === 'cancelled').length,
    };
  }, [assignments]);

  // Handlers
  const handleOrderClick = (assignment: PickupAssignmentRecord) => {
    setSelectedOrder(assignment);
  };

  const handleBackFromDetails = () => {
    setSelectedOrder(null);
  };

  const handleUpdateAssignment = (id: string, updates: { collected_amount?: number; notes?: string; status?: string }) => {
    updateAssignmentMutation.mutate({
      id,
      collected_amount: updates.collected_amount ?? 0,
      notes: updates.notes,
      status: updates.status
    });
  };

  // Render Logic
  if (selectedOrder) {
    return (
      <OrderDetailsView
        assignment={selectedOrder}
        onBack={handleBackFromDetails}
        onUpdate={handleUpdateAssignment}
        isUpdating={updateAssignmentMutation.isPending}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView username={session?.agent.username || 'User'} stats={stats} />;
      case 'progress':
        return <ProgressView
          assignments={assignments || []}
          onOrderClick={handleOrderClick}
        />;
      case 'history':
        return <HistoryView assignments={assignments || []} onOrderClick={handleOrderClick} />;
      case 'account':
        return <AccountView username={session?.agent.username || 'User'} mobile={session?.agent.phone || 'N/A'} version="25.0.0" onLogout={logout} />;
      default:
        return <HomeView username={session?.agent.username || 'User'} stats={stats} />;
    }
  };

  return (
    <>
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </DashboardLayout>

      {/* ALARM MODAL */}
      {alertAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-red-500 p-6 flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <BellRing className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold animate-pulse">New Pickup Request!</h2>
              <p className="text-red-100 mt-2 text-center">A new device is waiting for pickup</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Customer</span>
                  <span className="font-semibold text-slate-900">{alertAssignment.pickup_request.customer_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Device</span>
                  <span className="font-semibold text-slate-900">{alertAssignment.pickup_request.device?.model_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-green-600">₹{alertAssignment.assigned_amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-900 truncate max-w-[200px]">{alertAssignment.pickup_request.city?.name}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 h-12 text-lg font-semibold"
                  onClick={handleAcceptAssignment}
                >
                  Accept Pickup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
