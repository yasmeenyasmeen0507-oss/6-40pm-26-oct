import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, TrendingUp, Users, Clock, Phone, Smartphone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';

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
          city:cities(name)
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
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Pickups',
      value: stats?.completedRequests || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtitle: 'From completed pickups',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{card.value}</div>
                    {card.subtitle && (
                      <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Leads Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Leads (Last 2 Hours)
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Fresh pickup requests • Auto-refreshes every 30 seconds
            </p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            {recentLeads?.length || 0} leads
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoadingLeads ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : recentLeads && recentLeads.length > 0 ? (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">
                        {lead.customer_name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span className="font-mono">
                          {lead.verified_phone || lead.user_phone}
                        </span>
                        {lead.is_phone_verified && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600">
                        <Smartphone className="w-4 h-4" />
                        <span>
                          {lead.device?.brand?.name} {lead.device?.model_name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-700">
                          ₹{lead.final_price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">No recent leads</p>
              <p className="text-sm">New pickup requests will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}