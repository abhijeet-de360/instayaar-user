import React, { useState } from 'react';
import { Search, Filter, Eye, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock employer data based on your platform's actual usage
const employers = [
  {
    id: 1,
    name: 'Ravi Sharma',
    email: 'ravi.sharma@email.com',
    phone: '+91 98765-12345',
    status: 'active',
    joinDate: '2024-01-15',
    totalJobs: 12,
    totalSpent: 185000,
    lastJobType: 'Wedding Chef'
  },
  {
    id: 2,
    name: 'Priya Patel Events',
    email: 'priya@priyaevents.com',
    phone: '+91 98765-12346',
    status: 'active',
    joinDate: '2024-02-20',
    totalJobs: 25,
    totalSpent: 320000,
    lastJobType: 'Birthday DJ'
  },
  {
    id: 3,
    name: 'Amit Industries',
    email: 'hr@amitindustries.com',
    phone: '+91 98765-12347',
    status: 'active',
    joinDate: '2024-03-10',
    totalJobs: 8,
    totalSpent: 125000,
    lastJobType: 'Corporate Bartender'
  },
  {
    id: 4,
    name: 'Sunita Devi',
    email: 'sunita.devi@email.com',
    phone: '+91 98765-12348',
    status: 'suspended',
    joinDate: '2023-12-05',
    totalJobs: 3,
    totalSpent: 45000,
    lastJobType: 'Mehendi Artist'
  },
  {
    id: 5,
    name: 'Tech Solutions Pvt Ltd',
    email: 'events@techsolutions.in',
    phone: '+91 98765-12349',
    status: 'active',
    joinDate: '2024-01-08',
    totalJobs: 15,
    totalSpent: 225000,
    lastJobType: 'Office Party Comedian'
  }
];

export const EmployerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const isMobile = useIsMobile();

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || employer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Employer Management</h1>
          
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEmployers.map((employer) => (
            <Card key={employer.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{employer.name}</h3>
                  {getStatusBadge(employer.status)}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{employer.email}</p>
                  <p>{employer.phone}</p>
                  <p>Joined: {employer.joinDate}</p>
                  <p>Jobs Posted: {employer.totalJobs}</p>
                  <p>Total Spent: ₹{employer.totalSpent.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant={employer.status === 'active' ? 'destructive' : 'default'}>
                    {employer.status === 'active' ? (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Employer Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employers</CardTitle>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jobs Posted</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployers.map((employer) => (
                <TableRow key={employer.id}>
                  <TableCell className="font-medium">{employer.name}</TableCell>
                  <TableCell>{employer.email}</TableCell>
                  <TableCell>{employer.phone}</TableCell>
                  <TableCell>{getStatusBadge(employer.status)}</TableCell>
                  <TableCell>{employer.totalJobs}</TableCell>
                  <TableCell>₹{employer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>{employer.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={employer.status === 'active' ? 'destructive' : 'default'}>
                        {employer.status === 'active' ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
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