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
import { Template, TemplateCategory } from '@/lib/admin/types';
import {
  Plus,
  Search,
  LayoutTemplate,
  Crown,
  Check,
  X,
  Pencil,
  Trash2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const categories: TemplateCategory[] = ['minimal', 'vibrant', 'professional', 'creative', 'wave', 'text'];

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [filterFree, setFilterFree] = useState<string>('all');
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

  const fetchTemplates = useCallback(async (showFilterLoading = false) => {
    if (showFilterLoading) {
      setIsFiltering(true);
    }
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filterFree !== 'all') params.set('is_free', filterFree);
      params.set('pageSize', '100');

      const response = await fetch(`/api/admin/templates?${params}`);
      const data = await response.json();

      if (data.success) {
        setTemplates(data.data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setIsInitialLoad(false);
      setIsFiltering(false);
    }
  }, [selectedCategory, debouncedSearch, filterFree]);

  // Initial load
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch when filters change (after initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      fetchTemplates(true);
    }
  }, [selectedCategory, debouncedSearch, filterFree]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleToggleFree = async (template: Template) => {
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_free: !template.is_free }),
      });

      if (response.ok) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === template.id ? { ...t, is_free: !t.is_free } : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleToggleActive = async (template: Template) => {
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !template.is_active }),
      });

      if (response.ok) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === template.id ? { ...t, is_active: !t.is_active } : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const stats = {
    total: templates.length,
    free: templates.filter((t) => t.is_free).length,
    premium: templates.filter((t) => !t.is_free).length,
    active: templates.filter((t) => t.is_active).length,
  };

  return (
    <>
      <AdminHeader
        title="Templates"
        action={
          <Button asChild>
            <Link href="/admin/templates/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Templates
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <LayoutTemplate className="mr-1 h-3 w-3" />
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
                    Available presets
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Free Templates
              </CardTitle>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <Sparkles className="mr-1 h-3 w-3" />
                Free
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.free}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.total > 0 ? Math.round((stats.free / stats.total) * 100) : 0}% of total
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Premium Templates
              </CardTitle>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                <Crown className="mr-1 h-3 w-3" />
                Pro
              </Badge>
            </CardHeader>
            <CardContent>
              {isInitialLoad ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.premium}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.total > 0 ? Math.round((stats.premium / stats.total) * 100) : 0}% of total
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Templates
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
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
                    Currently visible
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Templates</CardTitle>
            <CardDescription>Manage and organize your template collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as TemplateCategory | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterFree}
                onValueChange={setFilterFree}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="true">Free Only</SelectItem>
                  <SelectItem value="false">Premium Only</SelectItem>
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
              ) : templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <LayoutTemplate className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No templates found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery || selectedCategory !== 'all' ? 'Try adjusting your filters' : 'Create your first template'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            {/* Mini Template Preview */}
                            <div
                              className="w-16 h-12 rounded-lg border border-border overflow-hidden shrink-0 p-1"
                              style={{
                                background: template.preview.backgroundType === 'solid'
                                  ? template.preview.backgroundColor
                                  : template.preview.backgroundType === 'gradient'
                                  ? `linear-gradient(${template.preview.gradientAngle || 135}deg, ${template.preview.gradientColors?.[0]}, ${template.preview.gradientColors?.[1]})`
                                  : template.preview.meshGradientCSS || '#1e1e1e',
                              }}
                            >
                              {/* Mini Mock Screenshot */}
                              <div
                                className="w-full h-full bg-white/90 dark:bg-zinc-200"
                                style={{
                                  borderRadius: `${Math.min(template.settings.borderRadius / 4, 4)}px`,
                                  boxShadow: template.settings.shadowBlur > 0
                                    ? `0 1px ${template.settings.shadowBlur / 10}px rgba(0,0,0,${template.settings.shadowOpacity})`
                                    : 'none',
                                }}
                              >
                                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-300 rounded-t flex items-center px-0.5 gap-0.5">
                                  <div className="w-0.5 h-0.5 rounded-full bg-red-400" />
                                  <div className="w-0.5 h-0.5 rounded-full bg-yellow-400" />
                                  <div className="w-0.5 h-0.5 rounded-full bg-green-400" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">{template.name}</p>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {template.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button onClick={() => handleToggleFree(template)}>
                            {template.is_free ? (
                              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Free
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 cursor-pointer">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button onClick={() => handleToggleActive(template)}>
                            {template.is_active ? (
                              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer">
                                <X className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/templates/${template.id}`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(template.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
