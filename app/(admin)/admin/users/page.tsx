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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserWithSubscription } from '@/lib/admin/types';
import {
  Search,
  Users,
  Crown,
  Calendar,
  Loader2,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  Mail,
  Download,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterPro, setFilterPro] = useState<string>('all');
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, freeUsers: 0 });
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

  const fetchUsers = useCallback(async (showFilterLoading = false) => {
    if (showFilterLoading) {
      setIsFiltering(true);
    }
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filterPro !== 'all') params.set('is_pro', filterPro);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsInitialLoad(false);
      setIsFiltering(false);
    }
  }, [debouncedSearch, filterPro, page]);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch when filters change (after initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      fetchUsers(true);
    }
  }, [debouncedSearch, filterPro, page]);

  const handleGrantPro = async (userId: string, plan: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grant', plan }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to grant pro access:', error);
    }
  };

  const handleRevokePro = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke pro access for this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke' }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to revoke pro access:', error);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <AdminHeader
        title="Users"
        action={
          <Button variant="outline" onClick={() => fetchUsers(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Users className="mr-1 h-3 w-3" />
                All
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered accounts
                  </p>
                </>
              )}
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
              {isInitialLoad ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.proUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active subscriptions
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Free Users
              </CardTitle>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                <Users className="mr-1 h-3 w-3" />
                Free
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.freeUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    No subscription
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Showing {users.length} of {total} users
            </CardDescription>
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
                value={filterPro}
                onValueChange={(value) => {
                  setFilterPro(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="true">Pro Users</SelectItem>
                  <SelectItem value="false">Free Users</SelectItem>
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
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No users found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? 'Try adjusting your search' : 'No users in the system yet'}
                  </p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Exports</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || 'No name'}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.subscription ? (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 capitalize">
                            <Crown className="h-3 w-3 mr-1" />
                            {user.subscription.plan}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.subscription ? (
                          <Badge
                            variant="secondary"
                            className={
                              user.subscription.status === 'active' || user.subscription.status === 'lifetime'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : user.subscription.status === 'cancelled'
                                ? 'bg-destructive/10 text-destructive'
                                : ''
                            }
                          >
                            {user.subscription.status}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Download className="h-3 w-3 text-muted-foreground" />
                          {user.export_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user.subscription && (user.subscription.status === 'active' || user.subscription.status === 'lifetime') ? (
                              <DropdownMenuItem
                                onClick={() => handleRevokePro(user.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                Revoke Pro
                              </DropdownMenuItem>
                            ) : (
                              <>
                                <DropdownMenuItem onClick={() => handleGrantPro(user.id, 'monthly')}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Grant Monthly
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGrantPro(user.id, 'annual')}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Grant Annual
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGrantPro(user.id, 'lifetime')}>
                                  <Crown className="h-4 w-4 mr-2" />
                                  Grant Lifetime
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
