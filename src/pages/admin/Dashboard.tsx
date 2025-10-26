import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

      const totalRevenue = pickupRequests.data?.reduce(
        (sum, req) => sum + Number(req.final_price || 0),
        0
      ) || 0;

      return {
        totalRequests: pickupRequests.count || 0,
        pendingRequests,
        totalDevices: devices.count || 0,
        totalBrands: brands.count || 0,
        totalCities: cities.count || 0,
        totalRevenue,
      };
    },
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
      title: 'Total Devices',
      value: stats?.totalDevices || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
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
                  <div className="text-2xl font-bold">{card.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">More dashboard features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
