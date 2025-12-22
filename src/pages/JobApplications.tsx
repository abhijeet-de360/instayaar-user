import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, MessageCircle, Eye, UserCheck, Calendar, Clock } from "lucide-react";
import MobileJobApplications from "@/components/mobile/MobileJobApplications";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Use mobile component on small screens
  if (isMobile) {
    return <MobileJobApplications />;
  }

  // Mock job data
  const job = {
    id: jobId,
    title: "Wedding Reception DJ",
    category: "DJ",
    budget: "₹12,000",
    location: "Chennai",
    timePosted: "4 hours ago",
    applicants: 23
  };

  // Mock applicants data
  const applicants = [
    {
      id: 1,
      name: "Arjun Mehta",
      service: "DJ",
      rating: 4.8,
      reviews: 156,
      experience: "5+ years",
      location: "Chennai",
      price: "₹10,000",
      appliedTime: "2 hours ago",
      status: "pending",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80",
      proposal: "I'm a professional DJ with 5+ years of experience in wedding events. I have all the latest equipment and can provide a wide range of music from Bollywood to international hits."
    },
    {
      id: 2,
      name: "Kavya Iyer",
      service: "DJ",
      rating: 4.9,
      reviews: 203,
      experience: "7+ years",
      location: "Chennai",
      price: "₹11,500",
      appliedTime: "3 hours ago",
      status: "pending",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2c0c8e8?auto=format&fit=crop&w=300&h=300&q=80",
      proposal: "Professional female DJ specializing in wedding receptions. I create the perfect atmosphere with seamless mixing and can read the crowd to keep everyone dancing."
    },
    {
      id: 3,
      name: "Rohit Kumar",
      service: "DJ",
      rating: 4.6,
      reviews: 89,
      experience: "3+ years",
      location: "Chennai",
      price: "₹9,500",
      appliedTime: "5 hours ago",
      status: "shortlisted",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      proposal: "Young and energetic DJ with modern equipment and great music collection. I specialize in creating memorable wedding experiences."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'shortlisted': return 'default';
      case 'hired': return 'destructive';
      case 'rejected': return 'outline';
      default: return 'secondary';
    }
  };

  const handleChat = (applicantId: number) => {
    navigate(`/chat/${applicantId}`);
  };

  const handleViewProfile = (applicantId: number) => {
    navigate(`/freelancer-profile/${applicantId}`);
  };

  const handleHire = (applicantId: number) => {
    // TODO: Implement hire functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Job Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/my-posts')}
              className="mb-4"
            >
              ← Back to My Posts
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <Badge variant="secondary">{job.category}</Badge>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.timePosted}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{job.budget}</div>
                    <div className="text-sm text-muted-foreground">{job.applicants} applications</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Applications ({applicants.length})</h2>
            
            {applicants.map((applicant) => (
              <Card key={applicant.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Profile Image */}
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={applicant.image} alt={applicant.name} />
                      <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{applicant.name}</h3>
                          <p className="text-muted-foreground">{applicant.service} • {applicant.experience}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(applicant.status)}>
                            {applicant.status}
                          </Badge>
                          <div className="text-lg font-bold text-primary">{applicant.price}</div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-6 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{applicant.rating}</span>
                          <span className="text-muted-foreground">({applicant.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{applicant.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Applied {applicant.appliedTime}</span>
                        </div>
                      </div>
                      
                      {/* Proposal */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Proposal:</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {applicant.proposal}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          size="sm"
                          onClick={() => handleHire(applicant.id)}
                          className="px-6"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Hire
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(applicant.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleChat(applicant.id)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default JobApplications;