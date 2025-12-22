
import React from 'react';
import { ArrowLeft, Star, MapPin, Clock, DollarSign, User, Calendar, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ServiceDetailsProps {
  serviceId: number;
  onBack: () => void;
}

// Mock service details data - this would come from an API
const getServiceDetails = (id: number) => ({
  id: 1,
  title: 'Professional Chef Services',
  freelancer: {
    id: 'f001',
    name: 'Rajesh Kumar',
    email: 'rajesh.chef@email.com',
    phone: '+91 98765 43210',
    avatar: '',
    rating: 4.8,
    totalReviews: 124,
    joinedDate: '2023-08-15',
    verified: true
  },
  category: 'Chef',
  description: 'Professional cooking services for events, parties, and private dining. Specialized in Indian, Continental, and Italian cuisines with over 8 years of experience in the hospitality industry.',
  price: 500,
  status: 'active',
  rating: 4.8,
  totalOrders: 45,
  location: 'Mumbai, Maharashtra',
  duration: '4 hours',
  availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  skills: ['Indian Cuisine', 'Italian Cuisine', 'Continental', 'Event Catering', 'Private Dining'],
  experience: '8+ years',
  equipment: 'Professional cooking utensils, portable gas stove, serving dishes',
  requirements: 'Access to kitchen facilities, basic ingredients to be provided by client',
  images: [
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400'
  ],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:20:00Z',
  recentBookings: [
    {
      id: 'b001',
      clientName: 'Priya Sharma',
      date: '2024-01-25',
      amount: 2000,
      status: 'completed',
      rating: 5
    },
    {
      id: 'b002',
      clientName: 'Amit Patel',
      date: '2024-01-20',
      amount: 1500,
      status: 'completed',
      rating: 4
    },
    {
      id: 'b003',
      clientName: 'Sneha Gupta',
      date: '2024-01-18',
      amount: 500,
      status: 'completed',
      rating: 5
    }
  ]
});

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceId, onBack }) => {
  const service = getServiceDetails(serviceId);

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

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{service.title}</h1>
            <p className="text-muted-foreground">Service ID: {service.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(service.status)}
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Service
          </Button>
          <Button 
            variant={service.status === 'active' ? 'destructive' : 'default'}
            size="sm"
          >
            {service.status === 'active' ? (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Suspend
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Images */}
          <Card>
            <CardHeader>
              <CardTitle>Service Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Service ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-medium">₹{service.price}/hour</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="font-medium">{service.location}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    {renderRating(service.rating)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Orders:</span>
                    <span className="font-medium">{service.totalOrders}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Experience:</span>
                    <span className="font-medium">{service.experience}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{service.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills & Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {service.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Availability</h4>
                <div className="flex flex-wrap gap-2">
                  {service.availability.map((day, index) => (
                    <Badge key={index} variant="outline">{day}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Equipment Provided</h4>
                <p className="text-muted-foreground">{service.equipment}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Special Requirements</h4>
                <p className="text-muted-foreground">{service.requirements}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Freelancer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Freelancer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={service.freelancer.avatar} />
                  <AvatarFallback>{service.freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{service.freelancer.name}</h4>
                    {service.freelancer.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">ID: {service.freelancer.id}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{service.freelancer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{service.freelancer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <div className="flex items-center space-x-1">
                    {renderRating(service.freelancer.rating)}
                    <span className="text-xs text-muted-foreground">
                      ({service.freelancer.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{new Date(service.freelancer.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <User className="w-4 h-4 mr-2" />
                View Freelancer Profile
              </Button>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {service.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{booking.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getBookingStatusBadge(booking.status)}
                        {booking.rating && renderRating(booking.rating)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{booking.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Service Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(service.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(service.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue:</span>
                <span className="font-medium">₹{service.totalOrders * service.price}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
