import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { LoginModal } from "@/components/auth/LoginModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Calendar, MessageCircle, UserCheck, ArrowLeft, Award, Clock, CheckCircle } from "lucide-react";
import MobileFreelancerProfile from "@/components/mobile/MobileFreelancerProfile";
import { freelancerById } from "@/store/freelancerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

const FreelancerProfile = () => {
  const { freelancerId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const dispatch = useDispatch<AppDispatch>();
  const { isMobile, showLoginModal, setShowLoginModal, checkAuth } = useAuthCheck();

  const freelancerVar: any = useSelector((state: RootState) => state.freelancer);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };


  useEffect(() => {
    dispatch(freelancerById(freelancerId))
  }, [freelancerId]);

  // Use mobile component on small screens
  if (isMobile) {
    return <MobileFreelancerProfile />;
  }

  // Mock freelancer data
  const freelancer = {
    id: freelancerId,
    name: "Arjun Mehta",
    service: "Professional DJ",
    location: "Chennai, Tamil Nadu",
    rating: 4.8,
    reviews: 156,
    experience: "5+ years",
    completedJobs: 89,
    responseTime: "2 hours",
    priceRange: "₹8,000 - ₹15,000",
    isVerified: true,
    isOnline: true,
    joinedDate: "January 2020",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&h=400&q=80",
    bio: "Professional DJ with over 5 years of experience in wedding receptions, corporate events, and private parties. I specialize in creating the perfect atmosphere with a mix of Bollywood, international hits, and regional music. My state-of-the-art equipment ensures crystal clear sound quality.",
    skills: ["Wedding DJ", "Corporate Events", "Bollywood Music", "International Music", "Sound Systems", "Lighting", "Mixing"],
    equipment: [
      "Pioneer CDJ-2000 Nexus",
      "DJM-900 Nexus Mixer", 
      "Professional Sound System",
      "LED Lighting Setup",
      "Wireless Microphones",
      "Backup Equipment"
    ]
  };


  // Mock reviews
  const reviews = [
    {
      id: 1,
      clientName: "Priya Sharma",
      rating: 5,
      comment: "Arjun was absolutely fantastic! He kept the energy high throughout our wedding reception and played exactly the music we wanted. Highly recommended!",
      date: "2 weeks ago",
      event: "Wedding Reception",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2c0c8e8?auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 2,
      clientName: "Rahul Kumar",
      rating: 5,
      comment: "Professional service and great music selection. The sound quality was excellent and he arrived on time with all equipment ready.",
      date: "1 month ago",
      event: "Corporate Event",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 3,
      clientName: "Sita Patel",
      rating: 4,
      comment: "Good DJ with a wide variety of music. The lighting setup was impressive. Minor delay in setup but overall great experience.",
      date: "2 months ago", 
      event: "Birthday Party",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  const handleChat = () => {
    checkAuth(() => navigate(`/chat/${freelancerId}`));
  };

  const handleHire = () => {
    checkAuth(() => navigate(`/freelancer-services/${freelancerId}`));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-6">
                {/* Profile Picture */}
                <Avatar className="h-32 w-32 border-4 border-background object-cover">
                  <AvatarImage src={freelancerVar?.freelancerDetails?.profile} alt={freelancerVar?.freelancerDetails?.firstName} className="object-cover object-top"/>
                  <AvatarFallback className="text-2xl">{freelancerVar?.freelancerDetails?.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                {/* Basic Info */}
                <div className="flex-1 pt-16">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold">{freelancerVar?.freelancerDetails?.firstName} {freelancerVar?.freelancerDetails?.lastName}</h1>
                        {freelancer.isVerified && (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                        <div className={`h-3 w-3 rounded-full ${freelancer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      </div>
                      <p className="text-lg text-muted-foreground mb-2">{freelancer?.service}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {freelancerVar?.freelancerDetails?.city}, {freelancerVar?.freelancerDetails?.state}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{freelancerVar?.freelancerDetails?.averageRating}</span>
                          <span>({freelancerVar?.freelancerDetails?.totalReview} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 ">
                      <Button variant="outline" onClick={handleChat}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button onClick={handleHire}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Hire Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{freelancerVar?.freelancerDetails?.jobsCompleted}</div>
                <div className="text-sm text-muted-foreground">Jobs Completed</div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{freelancer.responseTime}</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </CardContent>
            </Card> */}
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{freelancerVar?.freelancerDetails?.averageRating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{freelancerVar?.freelancerDetails?.experience}</div>
                <div className="text-sm text-muted-foreground">Experience</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {freelancer.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{freelancerVar?.freelancerDetails?.bio}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {freelancerVar?.freelancerDetails?.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* <div>
                      <h4 className="font-semibold mb-3">Equipment</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {freelancer.equipment.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancerVar?.freelancerDetails?.service.map((service) => (
                  <Card key={service._id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={service?.images[0]} 
                        alt={service?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 capitalize" style={{textTransform: 'capitalize'}}>{service?.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 capitalize">{service?.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-primary">₹{service?.price}/hr</div>
                          <div className="text-xs text-muted-foreground">{service?.duration} hours</div>
                        </div>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.clientName} />
                          <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.clientName}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{review.event}</Badge>
                                <span>{review.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancerVar?.freelancerDetails?.portfolio.map((portfolioItem, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={portfolioItem?.image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={setShowLoginModal}
        onLoginSuccess={handleLogin}
        isMobile={isMobile}
      />
    </div>
  );
};

export default FreelancerProfile;