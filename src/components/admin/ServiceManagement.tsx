import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Star, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { ServiceDetails } from './ServiceDetails';

// Mock service data based on your platform's actual services
const services = [
  {
    id: 1,
    title: 'Professional Chef Services',
    freelancer: 'Rajesh Kumar',
    category: 'Chef',
    price: 500,
    status: 'active',
    rating: 4.8,
    orders: 45,
    location: 'Mumbai',
    duration: '4 hours'
  },
  {
    id: 2,
    title: 'Wedding DJ Services',
    freelancer: 'DJ Arjun',
    category: 'DJ',
    price: 1500,
    status: 'active',
    rating: 4.9,
    orders: 32,
    location: 'Delhi',
    duration: '6 hours'
  },
  {
    id: 3,
    title: 'Professional Bartender',
    freelancer: 'Priya Bartender',
    category: 'Bartender',
    price: 800,
    status: 'active',
    rating: 4.7,
    orders: 28,
    location: 'Bangalore',
    duration: '5 hours'
  },
  {
    id: 4,
    title: 'Bridal Mehendi Artist',
    freelancer: 'Kavita Mehendi',
    category: 'Mehendi Artist',
    price: 1200,
    status: 'active',
    rating: 4.8,
    orders: 67,
    location: 'Jaipur',
    duration: '3 hours'
  },
  {
    id: 5,
    title: 'Kids Magic Show',
    freelancer: 'Rohit Magician',
    category: 'Magician',
    price: 2000,
    status: 'suspended',
    rating: 4.2,
    orders: 18,
    location: 'Pune',
    duration: '2 hours'
  },
  {
    id: 6,
    title: 'Stand-up Comedy Show',
    freelancer: 'Amit Comedian',
    category: 'Stand-up Comedian',
    price: 3000,
    status: 'active',
    rating: 4.6,
    orders: 25,
    location: 'Chennai',
    duration: '1 hour'
  },
  {
    id: 7,
    title: 'Live Music Performance',
    freelancer: 'Vikram Musician',
    category: 'Musician',
    price: 2500,
    status: 'active',
    rating: 4.7,
    orders: 34,
    location: 'Kolkata',
    duration: '3 hours'
  },
  {
    id: 8,
    title: 'Tattoo Art Services',
    freelancer: 'Deepak Tattoo',
    category: 'Tattoo Artist',
    price: 1800,
    status: 'paused',
    rating: 4.5,
    orders: 12,
    location: 'Goa',
    duration: '2 hours'
  }
];

export const ServiceManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // If a service is selected, show the details page
  if (selectedServiceId) {
    return (
      <ServiceDetails
        serviceId={selectedServiceId}
        onBack={() => setSelectedServiceId(null)}
      />
    );
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.freelancer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>;
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
          <h1 className="text-2xl font-bold text-foreground">Service Management</h1>
          
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{service.title}</h3>
                  {getStatusBadge(service.status)}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium">{service.freelancer}</p>
                  <p>Category: {service.category}</p>
                  <div className="flex items-center space-x-1">
                    <span>₹{service.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Rating:</span>
                    {renderRating(service.rating)}
                  </div>
                  <p>Orders: {service.orders}</p>
                  <p>Duration: {service.duration}</p>
                  <p>Location: {service.location}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedServiceId(service.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant={service.status === 'active' ? 'destructive' : 'default'}>
                    {service.status === 'active' ? (
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
        <h1 className="text-3xl font-bold text-foreground">Service Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Title</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.freelancer}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>
                    <span>₹{service.price}</span>
                  </TableCell>
                  <TableCell>{renderRating(service.rating)}</TableCell>
                  <TableCell>{service.orders}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedServiceId(service.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={service.status === 'active' ? 'destructive' : 'default'}>
                        {service.status === 'active' ? (
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
