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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getJobApplicationById } from "@/store/jobApplicationSlice";
import { shortListFreelancer } from "@/store/shorlistSlice";
import { getConversationId } from "@/store/chatSlice";
import { openRazorpayJob } from "@/components/Razorpay/RazorpayJob";
import { format, parseISO } from "date-fns";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch<AppDispatch>();
  const jobApplicationVar: any = useSelector((state: RootState) => state?.jobApplication);
  const authVar = useSelector((state: RootState) => state?.auth);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (jobId) {
      dispatch(getJobApplicationById(jobId));
    }
  }, [jobId, dispatch]);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Use mobile component on small screens
  if (isMobile) {
    return <MobileJobApplications />;
  }

  const job = jobApplicationVar?.appliedJobs || null;
  const applications = job?.applications || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'secondary';
      case 'shortlisted': return 'default';
      case 'hired': return 'destructive';
      case 'rejected': return 'outline';
      default: return 'secondary';
    }
  };

  const handleChat = (applicant: any) => {
    dispatch(getConversationId(authVar?.user?._id, navigate, undefined, applicant?._id));
  };

  const handleViewProfile = (freelancerId: string) => {
    navigate(`/freelancer-profile/${freelancerId}`);
  };

  const handleHire = (applicant: any) => {
    dispatch(shortListFreelancer({ jobId: applicant?.jobId, freelancerId: applicant?.freelancerId?._id }))
    .then((res: any) => {
        if (res?.payload) {
            openRazorpayJob(res.payload, authVar?.user, dispatch, navigate);
        }
    });
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
                    <CardTitle className="text-2xl">{job?.title || "Loading..."}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <Badge variant="secondary">{job?.categoryId?.name}</Badge>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job?.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job?.createdAt ? format(parseISO(job.createdAt), "dd MMM yyyy") : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">₹{job?.budget}</div>
                    <div className="text-sm text-muted-foreground">{job?.totalApplications || 0} applications</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Applications ({applications.length})</h2>
            
            {applications.map((applicant: any) => (
              <Card key={applicant._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Profile Image */}
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={applicant?.freelancerId?.profile} alt={applicant?.freelancerId?.firstName} />
                      <AvatarFallback>{applicant?.freelancerId?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{applicant?.freelancerId?.firstName} {applicant?.freelancerId?.lastName}</h3>
                          <p className="text-muted-foreground">{applicant?.freelancerId?.city}, {applicant?.freelancerId?.state}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(applicant.status)}>
                            {applicant.status}
                          </Badge>
                          <div className="text-lg font-bold text-primary">₹{applicant.bidAmount}</div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-6 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{applicant?.rating || 0}</span>
                          <span className="text-muted-foreground">({applicant?.reviews || 0} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{applicant?.freelancerId?.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Applied {applicant?.createdAt ? format(parseISO(applicant.createdAt), "dd MMM yyyy") : ""}</span>
                        </div>
                      </div>
                      
                      {/* Proposal */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Proposal:</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {applicant.coverLetter}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {applicant?.status === 'applied' && (
                          <Button 
                            size="sm"
                            onClick={() => handleHire(applicant)}
                            className="px-6"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Hire
                          </Button>
                        )}
                        {applicant?.status === 'shortlisted' && (
                          <Button size="sm" className="bg-black hover:bg-black px-6">
                            Booked
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(applicant?.freelancerId?._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleChat(applicant)}
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