import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Package, 
  Calendar,
  MapPin,
  Phone,
  CheckCircle
} from 'lucide-react';
import { startOfDay, startOfWeek, startOfMonth, format } from 'date-fns';

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const now = new Date();
      const todayStart = startOfDay(now).toISOString();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
      const monthStart = startOfMonth(now).toISOString();

      // Fetch pickup requests with filters
      const [allRequests, todayRequests, weekRequests, monthRequests, citiesData] = await Promise.all([
        supabase.from('pickup_requests').select('id, final_price, status', { count: 'exact' }),
        supabase.from('pickup_requests').select('id', { count: 'exact' }).gte('created_at', todayStart),
        supabase.from('pickup_requests').select('id', { count: 'exact' }).gte('created_at', weekStart),
        supabase.from('pickup_requests').select('id', { count: 'exact' }).gte('created_at', monthStart),
        supabase.from('pickup_requests').select('city:cities(name)', { count: 'exact' })
      ]);

      // Calculate revenue from completed requests
      const completedRevenue = allRequests.data
        ?.filter(req => req.status === 'completed')
        .reduce((sum, req) => sum + Number(req.final_price || 0), 0) || 0;

      // Average deal value
      const completedCount = allRequests.data?.filter(req => req.status === 'completed').length || 1;
      const avgDealValue = completedRevenue / completedCount;

      // Top cities
      const cityCounts: Record<string, number> = {};
      citiesData.data?.forEach(item => {
        const cityName = item.city?.name || 'Unknown';
        cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
      });

      const topCities = Object.entries(cityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      return {
        totalRequests: allRequests.count || 0,
        todayRequests: todayRequests.count || 0,
        weekRequests: weekRequests.count || 0,
        monthRequests: monthRequests.count || 0,
        totalRevenue: completedRevenue,
        avgDealValue: Math.round(avgDealValue),
        completedCount,
        topCities,
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Performance metrics and insights</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">
          Performance metrics and insights • Updated: {format(new Date(), 'HH:mm:ss')}
        </p>
      </div>

      {/* Requests by Time Period */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Pickup Requests Overview
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Package className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalRequests || 0}</div>
              <p className="text-xs text-slate-500">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {analytics?.todayRequests || 0}
              </div>
              <p className="text-xs text-slate-500">
                {format(new Date(), 'MMM dd, yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {analytics?.weekRequests || 0}
              </div>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                {analytics?.monthRequests || 0}
              </div>
              <p className="text-xs text-slate-500">
                {format(new Date(), 'MMMM yyyy')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-emerald-600" />
          Revenue Metrics
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                ₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500">From completed pickups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Deal Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                ₹{(analytics?.avgDealValue || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500">Per completed pickup</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {analytics?.completedCount || 0}
              </div>
              <p className="text-xs text-slate-500">Successfully completed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Cities */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-600" />
          Top Cities
        </h2>
        <Card>
          <CardContent className="pt-6">
            {analytics?.topCities && analytics.topCities.length > 0 ? (
              <div className="space-y-3">
                {analytics.topCities.map((city, index) => (
                  <div key={city.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-700">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{city.name}</p>
                        <p className="text-xs text-slate-500">
                          {city.count} {city.count === 1 ? 'request' : 'requests'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-700">
                        {city.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">No city data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}