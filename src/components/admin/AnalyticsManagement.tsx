
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Upload, Eye, TrendingUp, BarChart3, Activity, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Analytics, AnalyticsFilters, AnalyticsStats } from '@/types/analyticsTypes';
import analyticsData from '@/data/analyticsData.json';

const ITEMS_PER_PAGE = 10;

export const AnalyticsManagement: React.FC = () => {
  const [allAnalytics] = useState<Analytics[]>(analyticsData.analytics as Analytics[]);
  const [displayedAnalytics, setDisplayedAnalytics] = useState<Analytics[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    type: 'all',
    category: 'all',
    status: 'all',
    priority: 'all',
    dateRange: 'all',
    search: ''
  });

  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver>();

  const filterAnalytics = useCallback((analytics: Analytics[]): Analytics[] => {
    return analytics.filter(item => {
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesCategory = filters.category === 'all' || item.category.toLowerCase().includes(filters.category.toLowerCase());
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
      const matchesSearch = filters.search === '' || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.category.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesCategory && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [filters]);

  const loadMoreAnalytics = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const filteredAnalytics = filterAnalytics(allAnalytics);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newAnalytics = filteredAnalytics.slice(startIndex, endIndex);

    setTimeout(() => {
      if (currentPage === 1) {
        setDisplayedAnalytics(newAnalytics);
      } else {
        setDisplayedAnalytics(prev => [...prev, ...newAnalytics]);
      }
      
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
      setHasMore(endIndex < filteredAnalytics.length);
    }, 500);
  }, [allAnalytics, currentPage, filterAnalytics, hasMore, isLoading]);

  const lastAnalyticsElementRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreAnalytics();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreAnalytics]);

  useEffect(() => {
    setCurrentPage(1);
    setDisplayedAnalytics([]);
    setHasMore(true);
    const timer = setTimeout(() => loadMoreAnalytics(), 100);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStats = (): AnalyticsStats => {
    const filteredAnalytics = filterAnalytics(allAnalytics);
    return {
      totalAnalytics: filteredAnalytics.length,
      activeAnalytics: filteredAnalytics.filter(a => a.status === 'active').length,
      criticalAnalytics: filteredAnalytics.filter(a => a.priority === 'critical').length,
      recentAnalytics: filteredAnalytics.filter(a => {
        const createdAt = new Date(a.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length
    };
  };

  const stats = getStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAnalyticsIcon = (type: string) => {
    switch (type) {
      case 'user_analytics': return <Activity className="w-4 h-4" />;
      case 'revenue_analytics': return <TrendingUp className="w-4 h-4" />;
      case 'booking_analytics': return <BarChart3 className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const formatMetricValue = (value: number | string): string => {
    if (typeof value === 'number') {
      if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toLocaleString();
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Analytics</p>
                <p className="text-2xl font-bold">{stats.totalAnalytics}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Analytics</p>
                <p className="text-2xl font-bold">{stats.activeAnalytics}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Priority</p>
                <p className="text-2xl font-bold">{stats.criticalAnalytics}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Analytics</p>
                <p className="text-2xl font-bold">{stats.recentAnalytics}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search analytics..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Analytics Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user_analytics">User Analytics</SelectItem>
                <SelectItem value="booking_analytics">Booking Analytics</SelectItem>
                <SelectItem value="revenue_analytics">Revenue Analytics</SelectItem>
                <SelectItem value="payment_analytics">Payment Analytics</SelectItem>
                <SelectItem value="service_category_analytics">Service Category</SelectItem>
                <SelectItem value="freelancer_analytics">Freelancer Analytics</SelectItem>
                <SelectItem value="geographic_analytics">Geographic Analytics</SelectItem>
                <SelectItem value="dispute_analytics">Dispute Analytics</SelectItem>
                <SelectItem value="withdrawal_analytics">Withdrawal Analytics</SelectItem>
                <SelectItem value="message_analytics">Message Analytics</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />

            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Analytics</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Key Metrics</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedAnalytics.map((analytics, index) => (
                  <TableRow
                    key={analytics.id}
                    ref={index === displayedAnalytics.length - 1 ? lastAnalyticsElementRef : null}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/admin/analytics/${analytics.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getAnalyticsIcon(analytics.type)}</div>
                        <div>
                          <div className="font-medium">{analytics.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {analytics.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {analytics.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{analytics.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(analytics.status)} text-white`}>
                        {analytics.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(analytics.priority)} text-white`}>
                        {analytics.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {Object.entries(analytics.metrics).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                            <span className="font-medium">{formatMetricValue(value)}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(analytics.dateRange.start).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">to</div>
                        <div>{new Date(analytics.dateRange.end).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/analytics/${analytics.id}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="text-sm text-muted-foreground">Loading more analytics...</div>
              </div>
            )}

            {!hasMore && displayedAnalytics.length > 0 && (
              <div className="flex justify-center py-4">
                <div className="text-sm text-muted-foreground">No more analytics to load</div>
              </div>
            )}

            {displayedAnalytics.length === 0 && !isLoading && (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">No analytics found matching your filters</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
