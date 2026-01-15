'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Crown,
  IndianRupee,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
  RefreshCw,
  BarChart3,
  Activity,
  FileDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyAnalytics {
  id: string;
  date: string;
  new_users: number;
  active_users: number;
  total_exports: number;
  new_subscriptions: number;
  churned_subscriptions: number;
  revenue_inr: number;
  pro_users: number;
}

interface OverviewStats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalRevenue: number;
  todayExports: number;
  todayNewUsers: number;
  activeSubscriptions: number;
  totalTemplates: number;
}

export default function AdminAnalyticsPage() {
  const [dailyData, setDailyData] = useState<DailyAnalytics[]>([]);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dailyResponse, overviewResponse] = await Promise.all([
        fetch(`/api/admin/analytics/daily?range=${dateRange}`),
        fetch('/api/admin/analytics/overview'),
      ]);

      const dailyResult = await dailyResponse.json();
      const overviewResult = await overviewResponse.json();

      if (dailyResult.success) {
        setDailyData(dailyResult.data);
      }
      if (overviewResult.success) {
        setOverview(overviewResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Calculate trends from daily data
  const calculateTrend = (data: DailyAnalytics[], key: keyof DailyAnalytics) => {
    if (data.length < 2) return { value: 0, isPositive: true };
    const current = data.slice(0, Math.ceil(data.length / 2));
    const previous = data.slice(Math.ceil(data.length / 2));

    const currentSum = current.reduce((sum, d) => sum + (Number(d[key]) || 0), 0);
    const previousSum = previous.reduce((sum, d) => sum + (Number(d[key]) || 0), 0);

    if (previousSum === 0) return { value: currentSum > 0 ? 100 : 0, isPositive: true };
    const change = ((currentSum - previousSum) / previousSum) * 100;
    return { value: Math.abs(Math.round(change)), isPositive: change >= 0 };
  };

  // Calculate totals for the period
  const periodTotals = {
    newUsers: dailyData.reduce((sum, d) => sum + d.new_users, 0),
    exports: dailyData.reduce((sum, d) => sum + d.total_exports, 0),
    revenue: dailyData.reduce((sum, d) => sum + d.revenue_inr, 0),
    subscriptions: dailyData.reduce((sum, d) => sum + d.new_subscriptions, 0),
  };

  const trends = {
    users: calculateTrend(dailyData, 'new_users'),
    exports: calculateTrend(dailyData, 'total_exports'),
    revenue: calculateTrend(dailyData, 'revenue_inr'),
    subscriptions: calculateTrend(dailyData, 'new_subscriptions'),
  };

  // Get max values for chart scaling
  const maxExports = Math.max(...dailyData.map(d => d.total_exports), 1);
  const maxRevenue = Math.max(...dailyData.map(d => d.revenue_inr), 1);
  const maxUsers = Math.max(...dailyData.map(d => d.new_users), 1);

  return (
    <>
      <AdminHeader
        title="Analytics"
        action={
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </CardTitle>
                  <Badge variant="secondary" className={cn(
                    trends.users.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                  )}>
                    {trends.users.isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                    {trends.users.value}%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview?.totalUsers.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{periodTotals.newUsers} this period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pro Users
                  </CardTitle>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                    <Crown className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview?.proUsers.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {overview?.totalUsers ? Math.round((overview.proUsers / overview.totalUsers) * 100) : 0}% conversion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Period Revenue
                  </CardTitle>
                  <Badge variant="secondary" className={cn(
                    trends.revenue.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                  )}>
                    {trends.revenue.isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                    {trends.revenue.value}%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{periodTotals.revenue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="inline mr-1 h-3 w-3 text-emerald-500" />
                    Revenue this period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Period Exports
                  </CardTitle>
                  <Badge variant="secondary" className={cn(
                    trends.exports.isPositive ? 'bg-blue-500/10 text-blue-500' : 'bg-destructive/10 text-destructive'
                  )}>
                    {trends.exports.isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                    {trends.exports.value}%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {periodTotals.exports.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Download className="inline mr-1 h-3 w-3 text-blue-500" />
                    Images exported
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Exports Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Exports</CardTitle>
                      <CardDescription>Daily export activity</CardDescription>
                    </div>
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-1">
                    {dailyData.slice().reverse().map((day, index) => (
                      <div
                        key={day.id || index}
                        className="flex-1 group relative"
                      >
                        <div
                          className="bg-primary rounded-t transition-all group-hover:bg-primary/80"
                          style={{ height: `${(day.total_exports / maxExports) * 100}%`, minHeight: '4px' }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md whitespace-nowrap z-10 border">
                          {new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}: {day.total_exports}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{dailyData.length > 0 ? new Date(dailyData[dailyData.length - 1].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '-'}</span>
                    <span>{dailyData.length > 0 ? new Date(dailyData[0].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '-'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Revenue</CardTitle>
                      <CardDescription>Daily revenue in INR</CardDescription>
                    </div>
                    <IndianRupee className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-1">
                    {dailyData.slice().reverse().map((day, index) => (
                      <div
                        key={day.id || index}
                        className="flex-1 group relative"
                      >
                        <div
                          className="bg-emerald-500 rounded-t transition-all group-hover:bg-emerald-400"
                          style={{ height: `${(day.revenue_inr / maxRevenue) * 100}%`, minHeight: '4px' }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md whitespace-nowrap z-10 border">
                          {new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}: ₹{day.revenue_inr.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{dailyData.length > 0 ? new Date(dailyData[dailyData.length - 1].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '-'}</span>
                    <span>{dailyData.length > 0 ? new Date(dailyData[0].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '-'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* New Users Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>Daily new user registrations</CardDescription>
                  </div>
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end gap-1">
                  {dailyData.slice().reverse().map((day, index) => (
                    <div
                      key={day.id || index}
                      className="flex-1 group relative"
                    >
                      <div
                        className="bg-blue-500 rounded-t transition-all group-hover:bg-blue-400"
                        style={{ height: `${(day.new_users / maxUsers) * 100}%`, minHeight: '4px' }}
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md whitespace-nowrap z-10 border">
                        {new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}: {day.new_users}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{dailyData.length > 0 ? new Date(dailyData[dailyData.length - 1].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '-'}</span>
                  <span>{dailyData.length > 0 ? new Date(dailyData[0].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '-'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Daily Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Breakdown</CardTitle>
                <CardDescription>Detailed daily metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>New Users</TableHead>
                      <TableHead>Active Users</TableHead>
                      <TableHead>Exports</TableHead>
                      <TableHead>New Subs</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyData.map((day) => (
                      <TableRow key={day.id}>
                        <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(day.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{day.new_users}</TableCell>
                        <TableCell>{day.active_users}</TableCell>
                        <TableCell>{day.total_exports}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              day.new_subscriptions > 0
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : ''
                            }
                          >
                            {day.new_subscriptions}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            'font-medium',
                            day.revenue_inr > 0 ? 'text-emerald-500' : 'text-muted-foreground'
                          )}>
                            ₹{day.revenue_inr.toLocaleString('en-IN')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
