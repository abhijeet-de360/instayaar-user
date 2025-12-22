import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, Users, Briefcase, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Category, CategoryFilters } from '@/types/categoryTypes';
import categoryData from '@/data/categoryData.json';
import { useToast } from '@/hooks/use-toast';

export const CategoryManagement: React.FC = () => {
  const [categories] = useState<Category[]>(categoryData as Category[]);
  const [filters, setFilters] = useState<CategoryFilters>({
    status: 'all',
    requestType: 'all',
    search: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredCategories = categories.filter(category => {
    const matchesStatus = filters.status === 'all' || category.status === filters.status;
    const matchesRequestType = filters.requestType === 'all' || 
      (filters.requestType === 'requested' && category.requestedBy) ||
      (filters.requestType === 'admin' && !category.requestedBy);
    const matchesSearch = category.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      category.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesRequestType && matchesSearch;
  });

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    pending: categories.filter(c => c.status === 'pending').length,
    inactive: categories.filter(c => c.status === 'inactive').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleQuickAction = (categoryId: string, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Category Approved" : "Category Rejected",
      description: `Category ${action}d successfully`,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Category Management</h1>
        <p className="text-muted-foreground">Manage service categories and approval requests</p>
      </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Categories</CardTitle>
                <Button onClick={() => navigate('/admin/categories/new')} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search categories..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.requestType} onValueChange={(value) => setFilters({ ...filters, requestType: value })}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="admin">Admin Created</SelectItem>
                    <SelectItem value="requested">User Requested</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Categories Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead className="text-center">Services</TableHead>
                      <TableHead className="text-center">Jobs</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">{category.description}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(category.status)}</TableCell>
                        <TableCell>
                          {category.requestedBy ? (
                            <div>
                              <div className="font-medium">{category.requestedBy.name}</div>
                              <Badge variant="outline" className="text-xs">
                                {category.requestedBy.type}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Admin</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {category.totalServices}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            {category.totalJobs}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            {category.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuickAction(category.id, 'approve')}
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuickAction(category.id, 'reject')}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/admin/categories/${category.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
    </div>
  );
};