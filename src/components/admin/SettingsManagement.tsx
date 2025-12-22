import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Eye, Edit, Users, Building, Shield, UserPlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TeamMember, TeamFilters } from '@/types/teamTypes';
import teamData from '@/data/teamData.json';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export const SettingsManagement: React.FC = () => {
  const [allTeamMembers] = useState<TeamMember[]>(teamData.team as TeamMember[]);
  const [displayedMembers, setDisplayedMembers] = useState<TeamMember[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filters, setFilters] = useState<TeamFilters>({
    status: 'all',
    department: 'all',
    role: 'all',
    search: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const observerRef = useRef<IntersectionObserver>();
  const lastMemberRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMoreMembers();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage]);

  // Filter team members based on current filters
  const getFilteredMembers = useCallback(() => {
    return allTeamMembers.filter(member => {
      const matchesStatus = filters.status === 'all' || member.status === filters.status;
      const matchesDepartment = filters.department === 'all' || member.department === filters.department;
      const matchesRole = filters.role === 'all' || member.role.toLowerCase().includes(filters.role.toLowerCase());
      const matchesSearch = !filters.search || 
        member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.role.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesDepartment && matchesRole && matchesSearch;
    });
  }, [allTeamMembers, filters]);

  // Load more team members (simulate infinite scroll)
  const loadMoreMembers = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const filteredMembers = getFilteredMembers();
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newMembers = filteredMembers.slice(startIndex, endIndex);
      
      if (newMembers.length > 0) {
        setDisplayedMembers(prev => [...prev, ...newMembers]);
        setCurrentPage(prev => prev + 1);
        setHasNextPage(endIndex < filteredMembers.length);
      } else {
        setHasNextPage(false);
      }
      
      setIsLoading(false);
    }, 500);
  }, [currentPage, isLoading, hasNextPage, getFilteredMembers]);

  // Reset members when filters change
  useEffect(() => {
    const filteredMembers = getFilteredMembers();
    const initialMembers = filteredMembers.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedMembers(initialMembers);
    setCurrentPage(2);
    setHasNextPage(filteredMembers.length > ITEMS_PER_PAGE);
  }, [filters, getFilteredMembers]);

  // Initial load
  useEffect(() => {
    const filteredMembers = getFilteredMembers();
    const initialMembers = filteredMembers.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedMembers(initialMembers);
    setCurrentPage(2);
    setHasNextPage(filteredMembers.length > ITEMS_PER_PAGE);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      'Super Admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'Operations Manager': 'bg-blue-100 text-blue-800 border-blue-200',
      'Finance Manager': 'bg-green-100 text-green-800 border-green-200',
      'Customer Support Lead': 'bg-orange-100 text-orange-800 border-orange-200',
      'Content Moderator': 'bg-pink-100 text-pink-800 border-pink-200',
      'Junior Admin': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Analytics Manager': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Quality Assurance': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    
    return (
      <Badge className={roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {role}
      </Badge>
    );
  };

  const getPermissionSummary = (permissions: Record<string, { view: boolean; edit: boolean }>) => {
    const total = Object.keys(permissions).length;
    const viewCount = Object.values(permissions).filter(p => p.view).length;
    const editCount = Object.values(permissions).filter(p => p.edit).length;
    
    return `${viewCount}/${total} view, ${editCount}/${total} edit`;
  };

  const handleQuickAction = (memberId: string, action: 'activate' | 'deactivate' | 'delete') => {
    toast({
      title: "Action Completed",
      description: `Team member ${action}d successfully.`,
    });
  };

  const filteredMembers = getFilteredMembers();
  const stats = {
    total: allTeamMembers.length,
    active: allTeamMembers.filter(m => m.status === 'active').length,
    pending: allTeamMembers.filter(m => m.status === 'pending').length,
    departments: [...new Set(allTeamMembers.map(m => m.department))].length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings & Team Management</h1>
        <p className="text-muted-foreground">Manage team members and their access permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.departments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Team Members (Infinite Scroll Enabled)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {displayedMembers.length} of {filteredMembers.length} team members
              </p>
            </div>
            <Button onClick={() => navigate('/admin/team/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search team members..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {teamData.departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Members Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role & Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedMembers.map((member, index) => (
                  <TableRow 
                    key={member.id}
                    ref={index === displayedMembers.length - 1 ? lastMemberRef : null}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getRoleBadge(member.role)}
                        <div className="text-sm text-muted-foreground">{member.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getPermissionSummary(member.permissions)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(member.lastActive).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/team/${member.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/team/${member.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading more team members...</span>
              </div>
            )}
            
            {/* End of data indicator */}
            {!hasNextPage && displayedMembers.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You've reached the end of the team members list.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};