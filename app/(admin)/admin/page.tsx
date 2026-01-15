'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Crown,
  IndianRupee,
  Download,
  TrendingUp,
  TrendingDown,
  LayoutTemplate,
  CreditCard,
  ArrowUpRight,
  Activity,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/analytics/overview');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultStats: OverviewStats = {
    totalUsers: 0,
    proUsers: 0,
    freeUsers: 0,
    totalRevenue: 0,
    todayExports: 0,
    todayNewUsers: 0,
    activeSubscriptions: 0,
    totalTemplates: 68,
  };

  const displayStats = { ...defaultStats, ...stats };
  const conversionRate = displayStats.totalUsers > 0
    ? ((displayStats.proUsers / displayStats.totalUsers) * 100).toFixed(1)
    : '0';

  return (
    <>
      <AdminHeader
        title="Dashboard"
        action={
          <Button asChild>
            <Link href="/admin/templates/new">
              <Plus className="mr-2 h-4 w-4" />
              Quick Create
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Stats Grid - Matching shadcn dashboard style */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5%
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ₹{displayStats.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="inline mr-1 h-3 w-3 text-emerald-500" />
                    Trending up this month
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Lifetime earnings
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* New Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Users
              </CardTitle>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                +{displayStats.todayNewUsers}
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {displayStats.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="inline mr-1 h-3 w-3 text-emerald-500" />
                    +{displayStats.todayNewUsers} today
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total registered users
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Active Subscriptions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Subscriptions
              </CardTitle>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                +{conversionRate}%
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {displayStats.proUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Crown className="inline mr-1 h-3 w-3 text-amber-500" />
                    Strong user retention
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conversionRate}% conversion rate
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Today's Exports */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today&apos;s Exports
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                <Activity className="mr-1 h-3 w-3" />
                Active
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {displayStats.todayExports.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Download className="inline mr-1 h-3 w-3 text-blue-500" />
                    Steady performance
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Images exported today
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Quick Stats */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Free Users</p>
                    <p className="text-2xl font-bold">{isLoading ? '-' : displayStats.freeUsers.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <Crown className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pro Users</p>
                    <p className="text-2xl font-bold">{isLoading ? '-' : displayStats.proUsers.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CreditCard className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Subs</p>
                    <p className="text-2xl font-bold">{isLoading ? '-' : displayStats.activeSubscriptions}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                    <LayoutTemplate className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Templates</p>
                    <p className="text-2xl font-bold">{isLoading ? '-' : displayStats.totalTemplates}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/admin/templates/new">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Add Template</div>
                    <div className="text-xs text-muted-foreground">Create new preset</div>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Users className="mr-2 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Manage Users</div>
                    <div className="text-xs text-muted-foreground">View all accounts</div>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Activity className="mr-2 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-xs text-muted-foreground">Detailed reports</div>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/subscriptions">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Subscriptions</div>
                    <div className="text-xs text-muted-foreground">Manage plans</div>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
