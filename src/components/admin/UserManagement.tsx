
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, MoreVertical, Eye, Ban, CheckCircle, Loader2 } from 'lucide-react';
import { adminData } from '@/data/adminData';
import { useIsMobile } from '@/hooks/use-mobile';

const ITEMS_PER_PAGE = 10;

export const UserManagement: React.FC = () => {
  const [allUsers] = useState(adminData.users);
  const [displayedUsers, setDisplayedUsers] = useState<typeof adminData.users>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const isMobile = useIsMobile();
  
  const observerRef = useRef<IntersectionObserver>();
  const lastUserRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMoreUsers();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage]);

  const getFilteredUsers = useCallback(() => {
    return allUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm);
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, filterRole]);

  const loadMoreUsers = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const filteredUsers = getFilteredUsers();
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newUsers = filteredUsers.slice(startIndex, endIndex);
      
      if (newUsers.length > 0) {
        setDisplayedUsers(prev => [...prev, ...newUsers]);
        setCurrentPage(prev => prev + 1);
        setHasNextPage(endIndex < filteredUsers.length);
      } else {
        setHasNextPage(false);
      }
      setIsLoading(false);
    }, 500);
  }, [currentPage, isLoading, hasNextPage, getFilteredUsers]);

  useEffect(() => {
    const filteredUsers = getFilteredUsers();
    const initialUsers = filteredUsers.slice(0, ITEMS_PER_PAGE);
    setDisplayedUsers(initialUsers);
    setCurrentPage(2);
    setHasNextPage(filteredUsers.length > ITEMS_PER_PAGE);
  }, [searchTerm, filterRole, getFilteredUsers]);

  const filteredUsers = getFilteredUsers();

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      employer: 'bg-blue-100 text-blue-800',
      freelancer: 'bg-purple-100 text-purple-800'
    };
    return colors[role as keyof typeof colors] || colors.employer;
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Users Management</h2>
          
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Roles</option>
              <option value="employer">Employers</option>
              <option value="freelancer">Freelancers</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                  <button className="p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={getRoleBadge(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <Badge className={getStatusBadge(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Joined</p>
                    <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Active</p>
                    <p className="font-medium">{new Date(user.lastActive).toLocaleDateString()}</p>
                  </div>
                  {user.role === 'employer' ? (
                    <>
                      <div>
                        <p className="text-gray-600">Bookings</p>
                        <p className="font-medium">{user.totalBookings}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Spent</p>
                        <p className="font-medium">₹{user.totalSpent?.toLocaleString()}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-600">Jobs Done</p>
                        <p className="font-medium">{user.totalJobs}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Earned</p>
                        <p className="font-medium">₹{user.totalEarned?.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    {user.status === 'active' ? (
                      <>
                        <Ban className="w-4 h-4 mr-1" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">All Roles</option>
            <option value="employer">Employers</option>
            <option value="freelancer">Freelancers</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedUsers.map((user, index) => (
                <TableRow 
                  key={user.id}
                  ref={index === displayedUsers.length - 1 ? lastUserRef : null}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                      <p>Last: {new Date(user.lastActive).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === 'employer' ? (
                      <div className="text-sm">
                        <p>{user.totalBookings} bookings</p>
                        <p>₹{user.totalSpent?.toLocaleString()} spent</p>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <p>{user.totalJobs} jobs</p>
                        <p>₹{user.totalEarned?.toLocaleString()} earned</p>
                        {user.rating && <p>★ {user.rating}/5</p>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        {user.status === 'active' ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
