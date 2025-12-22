import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, DollarSign, Users, Clock, 
  Star, CheckCircle, XCircle, Eye, Phone, Mail 
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

// Mock detailed job data with applicants
const jobDetails = {
  1: {
    id: 1,
    title: 'Need a Professional Chef for Wedding',
    description: 'Looking for an experienced chef to handle catering for a 200-guest wedding reception. The event will include traditional Indian cuisine with both vegetarian and non-vegetarian options. We need someone who can manage a full kitchen team and ensure high-quality food presentation.',
    employer: {
      name: 'Ravi Sharma',
      email: 'ravi.sharma@email.com',
      phone: '+91 98765-12345',
      company: 'Personal Event'
    },
    category: 'Chef',
    budget: { min: 15000, max: 25000 },
    status: 'active',
    applicants: 12,
    deadline: '2024-02-15',
    location: 'Mumbai, Maharashtra',
    postedDate: '2024-01-20',
    duration: '8 hours',
    requirements: [
      'Minimum 5 years of wedding catering experience',
      'Expertise in North Indian and South Indian cuisine',
      'Ability to manage team of 4-6 kitchen staff',
      'Food safety certification required',
      'Own transportation for equipment'
    ],
    eventDetails: {
      date: '2024-02-18',
      time: '6:00 PM - 2:00 AM',
      guests: 200,
      venue: 'Grand Ballroom, Hotel Taj, Mumbai'
    },
    appliedFreelancers: [
      {
        id: 1,
        name: 'Rajesh Kumar',
        primaryService: 'Chef',
        rating: 4.8,
        completedJobs: 45,
        hourlyRate: 500,
        appliedDate: '2024-01-20',
        proposal: 'I have 8+ years of wedding catering experience and can handle 200+ guests with ease. I specialize in North Indian cuisine and have my own team of 5 experienced cooks.',
        status: 'pending',
        phone: '+91 98765-43210',
        email: 'rajesh.chef@email.com'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        primaryService: 'Chef',
        rating: 4.9,
        completedJobs: 67,
        hourlyRate: 600,
        appliedDate: '2024-01-21',
        proposal: 'Professional chef with extensive wedding catering experience. I can provide both traditional and modern Indian cuisine with impeccable presentation.',
        status: 'shortlisted',
        phone: '+91 98765-43211',
        email: 'priya.chef@email.com'
      },
      {
        id: 3,
        name: 'Amit Singh',
        primaryService: 'Chef',
        rating: 4.7,
        completedJobs: 52,
        hourlyRate: 550,
        appliedDate: '2024-01-22',
        proposal: 'Experienced in large-scale wedding events. Can provide complete catering solution including live counters and traditional sweets.',
        status: 'rejected',
        phone: '+91 98765-43212',
        email: 'amit.chef@email.com'
      },
      {
        id: 4,
        name: 'Sneha Das',
        primaryService: 'Chef',
        rating: 4.6,
        completedJobs: 38,
        hourlyRate: 480,
        appliedDate: '2024-01-23',
        proposal: 'Specializing in vegetarian and Jain cuisine. Perfect for traditional Indian weddings with diverse dietary requirements.',
        status: 'pending',
        phone: '+91 98765-43213',
        email: 'sneha.chef@email.com'
      }
    ]
  },
  2: {
    id: 2,
    title: 'DJ Required for Birthday Party',
    description: 'Need an energetic DJ for a fun birthday celebration with mixed age groups. The party will have both Bollywood and English music with good sound system.',
    employer: {
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 98765-12346',
      company: 'Personal Event'
    },
    category: 'DJ',
    budget: { min: 8000, max: 12000 },
    status: 'active',
    applicants: 8,
    deadline: '2024-02-10',
    location: 'Delhi, India',
    postedDate: '2024-01-25',
    duration: '6 hours',
    requirements: [
      'Professional DJ equipment and sound system',
      'Experience with both Bollywood and English music',
      'Ability to read the crowd and adjust music accordingly',
      'Microphone for announcements',
      'LED lighting setup preferred'
    ],
    eventDetails: {
      date: '2024-02-12',
      time: '7:00 PM - 1:00 AM',
      guests: 80,
      venue: 'Farmhouse, Gurgaon'
    },
    appliedFreelancers: [
      {
        id: 5,
        name: 'DJ Arjun',
        primaryService: 'DJ',
        rating: 4.9,
        completedJobs: 32,
        hourlyRate: 1500,
        appliedDate: '2024-01-25',
        proposal: 'Professional DJ with high-end equipment. Specializing in birthday parties and can provide complete entertainment package.',
        status: 'pending',
        phone: '+91 98765-43214',
        email: 'dj.arjun@email.com'
      }
    ]
  }
};

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const job = id ? jobDetails[parseInt(id)] : undefined;

  if (!job) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <AdminSidebar
          activeTab="jobs"
          setActiveTab={() => {}}
          onLogout={() => navigate('/admin')}
        />
        <div className="flex-1 overflow-auto bg-background p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

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

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'shortlisted':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shortlisted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'hired':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hired</Badge>;
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

  const handleJobStatusToggle = () => {
    const newStatus = job.status === 'active' ? 'suspended' : 'active';
    toast({
      title: `Job ${newStatus === 'active' ? 'Activated' : 'Suspended'}`,
      description: `"${job.title}" has been ${newStatus === 'active' ? 'activated' : 'suspended'} successfully.`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-primary shadow-sm border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-primary-foreground">Job Details</h1>
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
                activeTab="jobs"
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
          <JobDetailsContent 
            job={job} 
            navigate={navigate} 
            toast={toast} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            handleJobStatusToggle={handleJobStatusToggle}
            getStatusBadge={getStatusBadge}
            getApplicationStatusBadge={getApplicationStatusBadge}
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
        activeTab="jobs"
        setActiveTab={(tab) => {
          navigate(`/admin?tab=${tab}`);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-6">
          <JobDetailsContent 
            job={job} 
            navigate={navigate} 
            toast={toast} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            handleJobStatusToggle={handleJobStatusToggle}
            getStatusBadge={getStatusBadge}
            getApplicationStatusBadge={getApplicationStatusBadge}
            renderRating={renderRating}
          />
        </div>
      </div>
    </div>
  );
};

const JobDetailsContent: React.FC<{
  job: any;
  navigate: any;
  toast: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleJobStatusToggle: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  getApplicationStatusBadge: (status: string) => JSX.Element;
  renderRating: (rating: number) => JSX.Element;
}> = ({ job, navigate, toast, activeTab, setActiveTab, handleJobStatusToggle, getStatusBadge, getApplicationStatusBadge, renderRating }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header - Remove Back to Admin button since we have sidebar navigation */}
      <div className="flex justify-end">
        <div className="flex space-x-2">
          <Button variant="outline">
            Contact Employer
          </Button>
          <Button 
            variant={job.status === 'active' ? 'destructive' : 'default'}
            onClick={handleJobStatusToggle}
          >
            {job.status === 'active' ? (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Suspend Job
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Activate Job
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Job Header */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {job.postedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Deadline: {job.deadline}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(job.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Budget</h3>
                <div className="text-2xl font-bold text-primary">
                  ₹{job.budget.min.toLocaleString()} - ₹{job.budget.max.toLocaleString()}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Duration</h3>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{job.duration}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Employer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="font-medium">{job.employer.name}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span>{job.employer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{job.employer.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{job.applicants}</div>
            <div className="text-sm text-muted-foreground">Total Applicants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{job.appliedFreelancers.filter(f => f.status === 'shortlisted').length}</div>
            <div className="text-sm text-muted-foreground">Shortlisted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">₹{((job.budget.min + job.budget.max) / 2).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Average Budget</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</div>
            <div className="text-sm text-muted-foreground">Days Left</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Job Details</TabsTrigger>
          <TabsTrigger value="applicants">Applicants ({job.appliedFreelancers.length})</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Event Date:</span>
                    <span className="font-medium">{job.eventDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Event Time:</span>
                    <span className="font-medium">{job.eventDetails.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Guests:</span>
                    <span className="font-medium">{job.eventDetails.guests}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Venue:</span>
                    <p className="text-muted-foreground">{job.eventDetails.venue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applied Freelancers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.appliedFreelancers.map((freelancer) => (
                  <div key={freelancer.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{freelancer.name}</h4>
                          <p className="text-sm text-muted-foreground">{freelancer.primaryService} Specialist</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderRating(freelancer.rating)}
                            <span className="text-sm text-muted-foreground">({freelancer.completedJobs} jobs)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getApplicationStatusBadge(freelancer.status)}
                        <div className="text-sm text-muted-foreground mt-1">
                          Applied: {freelancer.appliedDate}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="font-medium mb-1">Proposal:</h5>
                      <p className="text-sm text-muted-foreground">{freelancer.proposal}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">Rate: ₹{freelancer.hourlyRate}/hour</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/freelancer/${freelancer.id}`)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        {freelancer.status === 'pending' && (
                          <>
                            <Button size="sm" variant="default">
                              Shortlist
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};