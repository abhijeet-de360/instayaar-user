import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, MoreVertical, Eye, Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import disputeData from '@/data/disputeData.json';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import type { Dispute } from '@/types/disputeTypes';

const ITEMS_PER_PAGE = 10;

export const DisputeManagement: React.FC = () => {
  const [allDisputes] = useState<Dispute[]>(disputeData.disputes as Dispute[]);
  const [displayedDisputes, setDisplayedDisputes] = useState<Dispute[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const observerRef = useRef<IntersectionObserver>();
  const lastDisputeRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMoreDisputes();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage]);

  const getFilteredDisputes = useCallback(() => {
    return allDisputes.filter(dispute => {
      const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || dispute.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || dispute.priority === filterPriority;
      const matchesCategory = filterCategory === 'all' || dispute.category === filterCategory;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [allDisputes, searchTerm, filterStatus, filterPriority, filterCategory]);

  const loadMoreDisputes = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const filteredDisputes = getFilteredDisputes();
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newDisputes = filteredDisputes.slice(startIndex, endIndex);
      
      if (newDisputes.length > 0) {
        setDisplayedDisputes(prev => [...prev, ...newDisputes]);
        setCurrentPage(prev => prev + 1);
        setHasNextPage(endIndex < filteredDisputes.length);
      } else {
        setHasNextPage(false);
      }
      setIsLoading(false);
    }, 500);
  }, [currentPage, isLoading, hasNextPage, getFilteredDisputes]);

  useEffect(() => {
    const filteredDisputes = getFilteredDisputes();
    const initialDisputes = filteredDisputes.slice(0, ITEMS_PER_PAGE);
    setDisplayedDisputes(initialDisputes);
    setCurrentPage(2);
    setHasNextPage(filteredDisputes.length > ITEMS_PER_PAGE);
  }, [searchTerm, filterStatus, filterPriority, filterCategory, getFilteredDisputes]);

  const filteredDisputes = getFilteredDisputes();

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      service_issue: 'bg-purple-100 text-purple-800',
      payment_issue: 'bg-red-100 text-red-800',
      quality_issue: 'bg-orange-100 text-orange-800',
      billing_issue: 'bg-blue-100 text-blue-800',
      behavior_issue: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatCategory = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Stats calculation
  const stats = {
    total: allDisputes.length,
    pending: allDisputes.filter(d => d.status === 'pending').length,
    inProgress: allDisputes.filter(d => d.status === 'in_progress').length,
    resolved: allDisputes.filter(d => d.status === 'resolved').length,
    highPriority: allDisputes.filter(d => d.priority === 'high').length
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Disputes Management</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Disputes</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search disputes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dispute Cards */}
        <div className="space-y-3">
          {displayedDisputes.map((dispute, index) => (
            <Card 
              key={dispute.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/admin/dispute/${dispute.id}`)}
              ref={index === displayedDisputes.length - 1 ? lastDisputeRef : null}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{dispute.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{dispute.id}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(dispute.status)}
                  </div>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2">{dispute.description}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusBadge(dispute.status)}>
                    {dispute.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getPriorityBadge(dispute.priority)}>
                    {dispute.priority.toUpperCase()}
                  </Badge>
                  <Badge className={getCategoryBadge(dispute.category)}>
                    {formatCategory(dispute.category)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Submitted by</p>
                    <p className="font-medium">{dispute.submittedBy.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{new Date(dispute.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Related to</p>
                    <p className="font-medium">{dispute.relatedTo.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Messages</p>
                    <p className="font-medium">{dispute.messages.length}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Disputes Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Disputes</CardTitle>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">All Categories</option>
            <option value="service_issue">Service Issue</option>
            <option value="payment_issue">Payment Issue</option>
            <option value="quality_issue">Quality Issue</option>
            <option value="billing_issue">Billing Issue</option>
            <option value="behavior_issue">Behavior Issue</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Disputes ({filteredDisputes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedDisputes.map((dispute, index) => (
                <TableRow 
                  key={dispute.id}
                  ref={index === displayedDisputes.length - 1 ? lastDisputeRef : null}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/admin/dispute/${dispute.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{dispute.title}</p>
                      <p className="text-sm text-gray-600">{dispute.id}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dispute.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(dispute.status)}
                      <Badge className={getStatusBadge(dispute.status)}>
                        {dispute.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(dispute.priority)}>
                      {dispute.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadge(dispute.category)}>
                      {formatCategory(dispute.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{dispute.submittedBy.name}</p>
                      <p className="text-gray-600">{dispute.submittedBy.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(dispute.submittedAt).toLocaleDateString()}</p>
                      <p className="text-gray-600">
                        {new Date(dispute.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">{dispute.messages.length}</span>
                      <span className="text-xs text-gray-600">msgs</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/dispute/${dispute.id}`); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
