'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  CreditCard,
  Crown,
  Calendar,
  Loader2,
  Check,
  X,
  RefreshCw,
  Infinity,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface Subscription {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  plan: string;
  status: string;
  provider: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, lifetime: 0, cancelled: 0 });
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const fetchSubscriptions = useCallback(async (showFilterLoading = false) => {
    if (showFilterLoading) {
      setIsFiltering(true);
    }
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterPlan !== 'all') params.set('plan', filterPlan);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));

      const response = await fetch(`/api/admin/subscriptions?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubscriptions(data.data.subscriptions);
        setTotal(data.data.total);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setIsInitialLoad(false);
      setIsFiltering(false);
    }
  }, [debouncedSearch, filterStatus, filterPlan, page]);

  // Initial load
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch when filters change (after initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      fetchSubscriptions(true);
    }
  }, [debouncedSearch, filterStatus, filterPlan, page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <AdminHeader
        title="Subscriptions"
        action={
          <Button variant="outline" onClick={() => fetchSubscriptions(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Subscriptions
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <CreditCard className="mr-1 h-3 w-3" />
                All
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All time subscriptions
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <Check className="mr-1 h-3 w-3" />
                Live
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Currently active
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lifetime
              </CardTitle>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                <Crown className="mr-1 h-3 w-3" />
                Forever
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.lifetime}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lifetime members
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cancelled
              </CardTitle>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                <X className="mr-1 h-3 w-3" />
                Churned
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.cancelled}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cancelled subs
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>View and manage subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value) => {
                  setFilterStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterPlan}
                onValueChange={(value) => {
                  setFilterPlan(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table with relative positioning for overlay loader */}
            <div className="relative">
              {/* Subtle loading overlay for filtering */}
              {isFiltering && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {isInitialLoad ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No subscriptions found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? 'Try adjusting your search' : 'No subscriptions yet'}
                  </p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {sub.user_email?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{sub.user_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{sub.user_email || sub.user_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            sub.plan === 'lifetime'
                              ? 'bg-amber-500/10 text-amber-500'
                              : sub.plan === 'annual'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-blue-500/10 text-blue-500'
                          }
                        >
                          <Crown className="h-3 w-3 mr-1" />
                          {sub.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            sub.status === 'active' || sub.status === 'lifetime'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : sub.status === 'cancelled'
                              ? 'bg-destructive/10 text-destructive'
                              : ''
                          }
                        >
                          {sub.status === 'active' || sub.status === 'lifetime' ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm capitalize">{sub.provider}</span>
                      </TableCell>
                      <TableCell>
                        {sub.current_period_end ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Ends {new Date(sub.current_period_end).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-amber-500">
                            <Infinity className="h-3 w-3" />
                            Never expires
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
