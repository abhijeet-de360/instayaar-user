import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, UserCheck, UserX, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock freelancer data based on your platform's actual services
const freelancers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.chef@email.com',
    phone: '+91 98765-43210',
    status: 'active',
    joinDate: '2024-01-15',
    skills: ['Indian Cuisine', 'Wedding Catering', 'North Indian'],
    rating: 4.8,
    completedJobs: 45,
    totalEarnings: 150000,
    primaryService: 'Chef'
  },
  {
    id: 2,
    name: 'DJ Arjun',
    email: 'dj.arjun@email.com',
    phone: '+91 98765-43211',
    status: 'active',
    joinDate: '2024-02-20',
    skills: ['Wedding DJ', 'Party Music', 'Sound System'],
    rating: 4.9,
    completedJobs: 32,
    totalEarnings: 125000,
    primaryService: 'DJ'
  },
  {
    id: 3,
    name: 'Priya Bartender',
    email: 'priya.bartender@email.com',
    phone: '+91 98765-43212',
    status: 'active',
    joinDate: '2024-03-10',
    skills: ['Cocktail Making', 'Corporate Events', 'Mocktails'],
    rating: 4.7,
    completedJobs: 28,
    totalEarnings: 85000,
    primaryService: 'Bartender'
  },
  {
    id: 4,
    name: 'Kavita Mehendi',
    email: 'kavita.mehendi@email.com',
    phone: '+91 98765-43213',
    status: 'active',
    joinDate: '2023-12-05',
    skills: ['Bridal Mehendi', 'Arabic Design', 'Henna Art'],
    rating: 4.8,
    completedJobs: 67,
    totalEarnings: 134000,
    primaryService: 'Mehendi Artist'
  },
  {
    id: 5,
    name: 'Rohit Magician',
    email: 'rohit.magic@email.com',
    phone: '+91 98765-43214',
    status: 'suspended',
    joinDate: '2024-01-08',
    skills: ['Kids Magic', 'Stage Magic', 'Card Tricks'],
    rating: 4.2,
    completedJobs: 18,
    totalEarnings: 45000,
    primaryService: 'Magician'
  },
  {
    id: 6,
    name: 'Amit Comedian',
    email: 'amit.comedy@email.com',
    phone: '+91 98765-43215',
    status: 'active',
    joinDate: '2024-02-15',
    skills: ['Stand-up Comedy', 'Corporate Shows', 'Hindi Comedy'],
    rating: 4.6,
    completedJobs: 25,
    totalEarnings: 75000,
    primaryService: 'Stand-up Comedian'
  }
];

export const FreelancerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || freelancer.status === filterStatus;
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

  const renderRating = (rating: number) => (
    <div className="flex items-center space-x-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating}</span>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Freelancer Management</h1>
          
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search freelancers..."
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
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{freelancer.name}</h3>
                  {getStatusBadge(freelancer.status)}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{freelancer.email}</p>
                  <p>{freelancer.phone}</p>
                  <p>Joined: {freelancer.joinDate}</p>
                  <div className="flex items-center space-x-2">
                    <span>Rating:</span>
                    {renderRating(freelancer.rating)}
                  </div>
                  <p>Completed Jobs: {freelancer.completedJobs}</p>
                  <p>Total Earnings: ₹{freelancer.totalEarnings.toLocaleString()}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {freelancer.skills.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.skills.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/freelancer/${freelancer.id}`)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant={freelancer.status === 'active' ? 'destructive' : 'default'}>
                    {freelancer.status === 'active' ? (
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
        <h1 className="text-3xl font-bold text-foreground">Freelancer Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Freelancers</CardTitle>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search freelancers..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Completed Jobs</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFreelancers.map((freelancer) => (
                <TableRow key={freelancer.id}>
                  <TableCell className="font-medium">{freelancer.name}</TableCell>
                  <TableCell>{freelancer.email}</TableCell>
                  <TableCell>{freelancer.phone}</TableCell>
                  <TableCell>{getStatusBadge(freelancer.status)}</TableCell>
                  <TableCell>{renderRating(freelancer.rating)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{freelancer.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{freelancer.completedJobs}</TableCell>
                  <TableCell>₹{freelancer.totalEarnings.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/freelancer/${freelancer.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={freelancer.status === 'active' ? 'destructive' : 'default'}>
                        {freelancer.status === 'active' ? (
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