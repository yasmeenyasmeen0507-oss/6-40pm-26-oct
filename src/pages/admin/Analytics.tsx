import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  IndianRupee, 
  Package, 
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { startOfDay, endOfDay, startOfWeek, startOfMonth, format, subDays, differenceInDays } from 'date-fns';

type DateRange = {
  from: Date;
  to: Date;
};

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  });

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', dateRange],
    queryFn: async () => {
      const fromDate = dateRange.from.toISOString();
      const toDate = dateRange.to.toISOString();

      // Fetch pickup requests with date filters
      const [filteredRequests, allRequests, citiesData, dailyData] = await Promise.all([
        supabase
          .from('pickup_requests')
          .select('id, final_price, status, created_at')
          .gte('created_at', fromDate)
          .lte('created_at', toDate),
        supabase.from('pickup_requests').select('id, final_price, status'),
        supabase
          .from('pickup_requests')
          .select('city:cities(name)')
          .gte('created_at', fromDate)
          .lte('created_at', toDate),
        supabase
          .from('pickup_requests')
          .select('id, final_price, status, created_at')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .order('created_at', { ascending: true })
      ]);

      // Calculate filtered revenue
      const filteredRevenue = filteredRequests.data
        ?.filter(req => req.status === 'completed')
        .reduce((sum, req) => sum + Number(req.final_price || 0), 0) || 0;

      const filteredCompleted = filteredRequests.data?.filter(req => req.status === 'completed').length || 0;
      const avgDealValue = filteredCompleted > 0 ? filteredRevenue / filteredCompleted : 0;

      // Calculate total (all-time) revenue for comparison
      const totalRevenue = allRequests.data
        ?.filter(req => req.status === 'completed')
        .reduce((sum, req) => sum + Number(req.final_price || 0), 0) || 0;

      // Group by day for daily breakdown
      const dailyBreakdown: Record<string, { revenue: number; orders: number }> = {};
      
      dailyData.data?.forEach(req => {
        const date = format(new Date(req.created_at), 'yyyy-MM-dd');
        if (!dailyBreakdown[date]) {
          dailyBreakdown[date] = { revenue: 0, orders: 0 };
        }
        dailyBreakdown[date].orders += 1;
        if (req.status === 'completed') {
          dailyBreakdown[date].revenue += Number(req.final_price || 0);
        }
      });

      const dailyStats = Object.entries(dailyBreakdown)
        .sort(([a], [b]) => b.localeCompare(a)) // Latest first
        .map(([date, stats]) => ({
          date,
          ...stats,
        }));

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

      // Calculate growth (compare to previous period)
      const daysDiff = differenceInDays(dateRange.to, dateRange.from);
      const previousPeriodStart = subDays(dateRange.from, daysDiff + 1);
      const previousPeriodEnd = subDays(dateRange.from, 1);

      const previousData = await supabase
        .from('pickup_requests')
        .select('final_price, status')
        .gte('created_at', previousPeriodStart.toISOString())
        .lte('created_at', previousPeriodEnd.toISOString());

      const previousRevenue = previousData.data
        ?.filter(req => req.status === 'completed')
        .reduce((sum, req) => sum + Number(req.final_price || 0), 0) || 0;

      const revenueGrowth = previousRevenue > 0 
        ? ((filteredRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      const ordersGrowth = previousData.data?.length && previousData.data.length > 0
        ? (((filteredRequests.data?.length || 0) - previousData.data.length) / previousData.data.length) * 100
        : 0;

      return {
        totalRequests: filteredRequests.data?.length || 0,
        filteredRevenue,
        avgDealValue: Math.round(avgDealValue),
        completedCount: filteredCompleted,
        topCities,
        dailyStats,
        totalRevenue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
      };
    },
    refetchInterval: 60000,
  });

  const quickFilters = [
    { label: 'Today', from: startOfDay(new Date()), to: endOfDay(new Date()) },
    { label: 'Yesterday', from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) },
    { label: 'Last 7 Days', from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) },
    { label: 'Last 30 Days', from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) },
    { label: 'This Month', from: startOfMonth(new Date()), to: endOfDay(new Date()) },
    { label: 'All Time', from: new Date(2020, 0, 1), to: endOfDay(new Date()) },
  ];

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">
            Performance metrics and insights • Updated: {format(new Date(), 'HH:mm:ss')}
          </p>
        </div>
      </div>

      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Date Range: {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter.label}
                variant={
                  format(dateRange.from, 'yyyy-MM-dd') === format(filter.from, 'yyyy-MM-dd') &&
                  format(dateRange.to, 'yyyy-MM-dd') === format(filter.to, 'yyyy-MM-dd')
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => setDateRange({ from: filter.from, to: filter.to })}
                className="gap-2"
              >
                <CalendarIcon className="h-3 w-3" />
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              ₹{(analytics?.filteredRevenue || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {analytics && analytics.revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <span className={analytics && analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analytics?.revenueGrowth || 0)}%
              </span>
              <span className="text-slate-500">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {analytics?.totalRequests || 0}
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {analytics && analytics.ordersGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <span className={analytics && analytics.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analytics?.ordersGrowth || 0)}%
              </span>
              <span className="text-slate-500">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              ₹{(analytics?.avgDealValue || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-500 mt-1">Per completed pickup</p>
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
            <p className="text-xs text-slate-500 mt-1">
              {analytics?.completedCount && analytics?.totalRequests 
                ? Math.round((analytics.completedCount / analytics.totalRequests) * 100)
                : 0}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Daily Breakdown
        </h2>
        <Card>
          <CardContent className="pt-6">
            {analytics?.dailyStats && analytics.dailyStats.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analytics.dailyStats.map((day) => (
                  <div key={day.date} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">
                        {format(new Date(day.date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(day.date), 'EEEE')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-700">
                        ₹{day.revenue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {day.orders} {day.orders === 1 ? 'order' : 'orders'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">No data for selected period</p>
            )}
          </CardContent>
        </Card>
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