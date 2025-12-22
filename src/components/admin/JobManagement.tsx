import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, CheckCircle, XCircle, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock job data based on your platform's actual jobs
const jobs = [
  {
    id: 1,
    title: 'Need a Professional Chef for Wedding',
    employer: 'Ravi Sharma',
    category: 'Chef',
    budget: 20000,
    status: 'active',
    applicants: 12,
    deadline: '2024-02-15',
    location: 'Mumbai, Maharashtra',
    postedDate: '2024-01-20'
  },
  {
    id: 2,
    title: 'DJ Required for Birthday Party',
    employer: 'Priya Patel',
    category: 'DJ',
    budget: 10000,
    status: 'active',
    applicants: 8,
    deadline: '2024-02-10',
    location: 'Delhi, India',
    postedDate: '2024-01-25'
  },
  {
    id: 3,
    title: 'Bartender for Corporate Event',
    employer: 'Amit Industries',
    category: 'Bartender',
    budget: 8000,
    status: 'completed',
    applicants: 15,
    deadline: '2024-01-30',
    location: 'Bangalore, Karnataka',
    postedDate: '2024-01-10'
  },
  {
    id: 4,
    title: 'Mehendi Artist for Engagement Ceremony',
    employer: 'Sunita Devi',
    category: 'Mehendi Artist',
    budget: 5000,
    status: 'active',
    applicants: 18,
    deadline: '2024-02-20',
    location: 'Jaipur, Rajasthan',
    postedDate: '2024-01-22'
  },
  {
    id: 5,
    title: 'Stand-up Comedian for Office Party',
    employer: 'Tech Solutions Pvt Ltd',
    category: 'Stand-up Comedian',
    budget: 15000,
    status: 'suspended',
    applicants: 5,
    deadline: '2024-02-25',
    location: 'Pune, Maharashtra',
    postedDate: '2024-01-18'
  },
  {
    id: 6,
    title: 'Magician for Kids Birthday Party',
    employer: 'Deepak Kumar',
    category: 'Magician',
    budget: 6000,
    status: 'active',
    applicants: 9,
    deadline: '2024-02-12',
    location: 'Chennai, Tamil Nadu',
    postedDate: '2024-01-24'
  }
];

export const JobManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
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
          <h1 className="text-2xl font-bold text-foreground">Job Management</h1>
          
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium">{job.employer}</p>
                  <p>Category: {job.category}</p>
                  <p>Budget: ₹{job.budget.toLocaleString()}</p>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Deadline: {job.deadline}</span>
                  </div>
                  <p>Applicants: {job.applicants}</p>
                  <p>Posted: {job.postedDate}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/job/${job.id}`)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant={job.status === 'active' ? 'destructive' : 'default'}>
                    {job.status === 'active' || job.status === 'completed' ? (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
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
        <h1 className="text-3xl font-bold text-foreground">Job Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posted Jobs</CardTitle>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.employer}</TableCell>
                  <TableCell>{job.category}</TableCell>
                  <TableCell>₹{job.budget.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>{job.applicants}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{job.deadline}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/job/${job.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={job.status === 'active' ? 'destructive' : 'default'}>
                        {job.status === 'active' || job.status === 'completed' ? (
                          <XCircle className="w-4 h-4" />
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