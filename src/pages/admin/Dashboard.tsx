import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, ShoppingBag, TrendingUp, Users, Clock, Phone, Smartphone, MapPin, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [pickupRequests, devices, brands, cities] = await Promise.all([
        supabase.from('pickup_requests').select('id, status, final_price', { count: 'exact' }),
        supabase.from('devices').select('id', { count: 'exact' }),
        supabase.from('brands').select('id', { count: 'exact' }),
        supabase.from('cities').select('id', { count: 'exact' }),
      ]);

      const pendingRequests = pickupRequests.data?.filter(
        (req) => req.status === 'pending'
      ).length || 0;

      // ✅ Only count revenue from COMPLETED pickups
      const totalRevenue = pickupRequests.data
        ?.filter((req) => req.status === 'completed')
        .reduce((sum, req) => sum + Number(req.final_price || 0), 0) || 0;

      // Count completed requests
      const completedRequests = pickupRequests.data?.filter(
        (req) => req.status === 'completed'
      ).length || 0;

      return {
        totalRequests: pickupRequests.count || 0,
        pendingRequests,
        completedRequests,
        totalDevices: devices.count || 0,
        totalBrands: brands.count || 0,
        totalCities: cities.count || 0,
        totalRevenue,
      };
    },
  });

  // ✅ Fetch recent leads from last 2 hours
  const { data: recentLeads, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: async () => {
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

      const { data, error } = await supabase
        .from('pickup_requests')
        .select(`
          id,
          customer_name,
          user_phone,
          verified_phone,
          is_phone_verified,
          final_price,
          created_at,
          device:devices(
            brand:brands(name),
            model_name
          ),
          city:cities(name),
          status
        `)
        .gte('created_at', twoHoursAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const cards = [
    {
      title: 'Total Pickup Requests',
      value: stats?.totalRequests || 0,
      icon: Package,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 text-blue-600',
      trend: '+12.5%',
      trendColor: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50 text-yellow-600',
      trend: '-8.2%',
      trendColor: 'bg-red-100 text-red-600',
    },
    {
      title: 'Completed Pickups',
      value: stats?.completedRequests || 0,
      icon: CheckCircle2,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50 text-indigo-600',
      trend: '+24.1%',
      trendColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: TrendingUp, // Indian Rupee symbol is generic icon here
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-600',
      trend: '+18.3%',
      trendColor: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back! 👋</h1>
        <p className="text-slate-500 text-base">Here's what's happening with your business today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="bg-white border-none shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-200 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3.5 rounded-2xl ${card.color} text-white shadow-md shadow-slate-200`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className={`${card.trendColor} border-none rounded-full px-2.5 font-bold`}>
                    {card.trend}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
                  {isLoading ? (
                    <Skeleton className="h-9 w-24 bg-slate-100" />
                  ) : (
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">
                      {card.value}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="h-10 border-slate-200 text-slate-600 hover:bg-slate-50">
          <Package className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Recent Leads Section */}
      <Card className="bg-white border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-slate-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Recent Leads</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">Fresh pickup requests • Auto-refreshes every 30 seconds</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">
            {recentLeads?.length || 0} leads
          </Badge>
        </CardHeader>

        <div className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[100px] text-xs font-bold text-slate-400 uppercase tracking-wider pl-8">Order</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingLeads ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="pl-8"><Skeleton className="h-6 w-16 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-32 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-24 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-20 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full bg-slate-100 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : recentLeads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-48 text-slate-400">
                    No leads found recently
                  </TableCell>
                </TableRow>
              ) : (
                recentLeads?.map((lead: any) => (
                  <TableRow key={lead.id} className="group hover:bg-slate-50/80 border-slate-100 transition-colors">
                    <TableCell className="pl-8 font-medium">
                      <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 border-none font-normal tracking-wide px-2.5 rounded-md">
                        2026-{lead.id.substring(0, 4)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-sm">{lead.customer_name}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {lead.verified_phone || lead.user_phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {lead.device?.model_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {lead.city?.name || 'Unknown'}
                        </div>
                        <span className="text-[10px] text-slate-400 pl-5">
                          {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                        ₹{lead.final_price?.toLocaleString('en-IN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          lead.status === 'new' || !lead.status
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : lead.status === 'completed'
                              ? 'bg-green-50 text-green-600 border-green-200'
                              : 'bg-purple-50 text-purple-600 border-purple-200'
                        }
                      >
                        {lead.status === 'new' || !lead.status ? 'New' : lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
