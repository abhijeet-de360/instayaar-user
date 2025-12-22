import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Phone, Mail, Calendar, DollarSign, 
  TrendingUp, Users, CheckCircle, XCircle, Edit, Shield, Award 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';

// Mock detailed freelancer data
const freelancerDetails = {
  1: {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.chef@email.com',
    phone: '+91 98765-43210',
    status: 'active',
    joinDate: '2024-01-15',
    location: 'Mumbai, Maharashtra',
    primaryService: 'Chef',
    skills: ['Indian Cuisine', 'Wedding Catering', 'North Indian', 'South Indian', 'Continental'],
    rating: 4.8,
    totalReviews: 127,
    completedJobs: 45,
    totalEarnings: 150000,
    profileImage: '/api/placeholder/150/150',
    bio: 'Professional chef with 8+ years of experience in Indian and Continental cuisine. Specialized in wedding catering and large events.',
    hourlyRate: 500,
    availability: 'Available',
    verified: true,
    recentJobs: [
      { id: 1, title: 'Wedding Catering for 200 guests', employer: 'Ravi Sharma', amount: 25000, status: 'completed', date: '2024-01-20' },
      { id: 2, title: 'Birthday Party Chef', employer: 'Priya Patel', amount: 8000, status: 'completed', date: '2024-01-18' },
      { id: 3, title: 'Corporate Event Catering', employer: 'Tech Solutions', amount: 15000, status: 'in-progress', date: '2024-01-25' }
    ],
    reviews: [
      { id: 1, reviewer: 'Ravi Sharma', rating: 5, comment: 'Excellent food quality and professional service!', date: '2024-01-21' },
      { id: 2, reviewer: 'Priya Patel', rating: 5, comment: 'Amazing chef, highly recommended for parties.', date: '2024-01-19' },
      { id: 3, reviewer: 'Amit Singh', rating: 4, comment: 'Good food, timely service.', date: '2024-01-15' }
    ],
    earnings: {
      thisMonth: 45000,
      lastMonth: 38000,
      totalEarnings: 150000,
      avgPerJob: 3333
    }
  }
};

export const FreelancerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const freelancer = id ? freelancerDetails[parseInt(id)] : undefined;

  if (!freelancer) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <AdminSidebar
          activeTab="freelancer"
          setActiveTab={() => {}}
          onLogout={() => navigate('/admin')}
        />
        <div className="flex-1 overflow-auto bg-background p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Freelancer Not Found</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusToggle = () => {
    const newStatus = freelancer.status === 'active' ? 'suspended' : 'active';
    toast({
      title: `Freelancer ${newStatus === 'active' ? 'Activated' : 'Suspended'}`,
      description: `${freelancer.name} has been ${newStatus === 'active' ? 'activated' : 'suspended'} successfully.`,
    });
  };

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
      <span className="font-medium">{rating}</span>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-primary shadow-sm border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-primary-foreground">Freelancer Details</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <div className="w-64 h-full bg-primary" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar
                activeTab="freelancer"
                setActiveTab={(tab) => {
                  setSidebarOpen(false);
                  navigate(`/admin?tab=${tab}`);
                }}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* Mobile Content */}
        <div className="flex-1 overflow-auto p-4">
          <FreelancerDetailsContent 
            freelancer={freelancer} 
            navigate={navigate} 
            toast={toast} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            handleStatusToggle={handleStatusToggle}
            getStatusBadge={getStatusBadge}
            renderRating={renderRating}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <AdminSidebar
        activeTab="freelancer"
        setActiveTab={(tab) => {
          navigate(`/admin?tab=${tab}`);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-6">
          <FreelancerDetailsContent 
            freelancer={freelancer} 
            navigate={navigate} 
            toast={toast} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            handleStatusToggle={handleStatusToggle}
            getStatusBadge={getStatusBadge}
            renderRating={renderRating}
          />
        </div>
      </div>
    </div>
  );
};

const FreelancerDetailsContent: React.FC<{
  freelancer: any;
  navigate: any;
  toast: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleStatusToggle: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  renderRating: (rating: number) => JSX.Element;
}> = ({ freelancer, navigate, toast, activeTab, setActiveTab, handleStatusToggle, getStatusBadge, renderRating }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header - Remove Back to Admin button since we have sidebar navigation */}
      <div className="flex justify-end">
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            variant={freelancer.status === 'active' ? 'destructive' : 'default'}
            onClick={handleStatusToggle}
          >
            {freelancer.status === 'active' ? (
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

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={freelancer.profileImage} alt={freelancer.name} />
                <AvatarFallback className="text-2xl">{freelancer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2 mb-2">
                {getStatusBadge(freelancer.status)}
                {freelancer.verified && (
                  <Badge variant="outline" className="text-blue-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{freelancer.name}</h1>
                <p className="text-xl text-muted-foreground">{freelancer.primaryService} Specialist</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{freelancer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{freelancer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{freelancer.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {renderRating(freelancer.rating)}
                    <span className="text-sm text-muted-foreground">({freelancer.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">₹{freelancer.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Joined {freelancer.joinDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground">{freelancer.bio}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">₹{freelancer.totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{freelancer.completedJobs}</div>
            <div className="text-sm text-muted-foreground">Completed Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{freelancer.rating}</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{freelancer.totalReviews}</div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Freelancer Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Performance Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">&lt; 2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repeat Customers:</span>
                      <span className="font-medium">65%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Service Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <Badge variant="outline" className="text-green-600">Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Area:</span>
                      <span className="font-medium">Mumbai & surrounding</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages:</span>
                      <span className="font-medium">Hindi, English, Marathi</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {freelancer.recentJobs.map((job) => (
                  <div key={job.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">Employer: {job.employer}</p>
                      <p className="text-sm text-muted-foreground">Date: {job.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{job.amount.toLocaleString()}</div>
                      <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {freelancer.reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{review.reviewer}</h4>
                        <div className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-medium">₹{freelancer.earnings.thisMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Month:</span>
                    <span className="font-medium">₹{freelancer.earnings.lastMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Earnings:</span>
                    <span className="font-medium">₹{freelancer.earnings.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average per Job:</span>
                    <span className="font-medium">₹{freelancer.earnings.avgPerJob.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commission Rate:</span>
                      <span>10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>Bank Transfer</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Payout:</span>
                      <span>Feb 1, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};