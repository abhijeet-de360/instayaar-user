import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, MessageCircle, Eye, UserCheck, ArrowLeft, Clock, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { getJobApplicationById } from "@/store/jobApplicationSlice";
import { shortListFreelancer } from "@/store/shorlistSlice";
import { getConversationId } from "@/store/chatSlice";
import { openRazorpayJob } from "../Razorpay/RazorpayJob";

const MobileJobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();
  const authVar = useSelector((state: RootState) => state?.auth)
  const hireVar: any = useSelector((state: RootState) => state?.shortList)
  const dispatch = useDispatch<AppDispatch>();
  const jobApplicationVar: any = useSelector((state: RootState) => state?.jobApplication)

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

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

  useEffect(() => {
    dispatch(getJobApplicationById(jobId))
  }, [jobId])


  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleChat = (applicantId: number) => {
    dispatch(getConversationId(applicantId, navigate))
    // navigate(`/chat/${applicantId}`);
  };

  const handleViewProfile = (applicantId: number) => {
    navigate(`/freelancer-profile/${applicantId}`);
  };

  const handleHire = (data) => {
    dispatch(shortListFreelancer(data))
  };

  useEffect(() => {
    if (hireVar?.shortListData?.razorpayKey && hireVar?.shortListData?.order) {
      openRazorpayJob(hireVar?.shortListData, authVar, jobId, dispatch)
    }
  }, [hireVar?.shortListData])

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hide header when logged in on mobile */}
      {!authVar?.isAuthenticated && <Header onLogin={handleLogin} />}

      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate('/my-posts')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Applications</h1>
        </div>

        {/* Job Info Card */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-lg mb-2 capitalize">{jobApplicationVar?.appliedJobs?.title}</h2>
            <div className="flex items-start flex-col gap-3 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{jobApplicationVar?.appliedJobs?.categoryId?.name}</Badge>
                {/* <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {jobApplicationVar?.appliedJobs?.createdAt &&
                      new Date(jobApplicationVar.appliedJobs?.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div> */}
              </div>
              <div className="flex items-start gap-1">
                <MapPin className="h-5 w-5" />
                {jobApplicationVar?.appliedJobs?.address}
              </div>
              <p className="text-xs font-medium">Description: {jobApplicationVar?.appliedJobs?.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">₹{jobApplicationVar?.appliedJobs?.budget}</span>
              <span className="text-sm text-muted-foreground">{jobApplicationVar?.appliedJobs?.applications?.length} applications</span>
            </div>
          </CardContent>
        </Card>

        {/* Applications Count */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Applications ({jobApplicationVar?.appliedJobs?.applications?.length})</h3>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {jobApplicationVar?.appliedJobs?.applications?.length === 0 ? (
            <Card className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg text-muted-foreground mb-2 font-semibold">No applications found</p>
              <p className="text-sm text-muted-foreground">Once applicants apply, they will appear here</p>
            </Card>
          ) : (
            jobApplicationVar?.appliedJobs?.applications?.map((applicant) => (
              <Card key={applicant._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-3">
                    {/* Header with Profile */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={applicant?.freelancerId?.profile} alt={applicant.name} className="object-cover object-top" />
                        {/* <AvatarFallback>{applicant?.freelancerId?.firstName.splice(0, 1)}</AvatarFallback> */}
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-base">{applicant?.freelancerId?.firstName} {applicant?.freelancerId?.lastName}</h4>
                            <p className=" text-primary font-semibold text-[16px] flex items-center gap-1">₹{applicant?.bidAmount} <span className="text-secondary text-sm font-[300]">(Bid)</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{applicant.rating || 0.0}</span>
                                <span className="text-xs">({applicant.reviews || 0})</span>
                              </div></p>

                          </div>
                          {/* <div className="text-right">
                            <Badge className={`text-xs ${getStatusBgColor(applicant.status)}`}>
                              {applicant.status}
                            </Badge>
                          </div> */}
                        </div>
                      </div>

                      {applicant?.status === 'rejected' && <Badge>{applicant?.status === 'rejected' ? "Rejected" : ''}</Badge>}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {/* <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{applicant.rating || 0.0}</span>
                        <span>({applicant.reviews || 0})</span>
                      </div> */}
                      {/* <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {applicant?.freelancerId?.city}, {applicant?.freelancerId?.state}
                      </div> */}
                    </div>
                    <span className="text-sm">{applicant?.coverLetter}</span>

                    {/* Price and Proposal */}
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-primary">{applicant.price}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {applicant.proposal}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {applicant?.status === 'applied' && <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleHire({ jobId: applicant?.jobId?._id, freelancerId: applicant?.freelancerId?._id })}
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Book
                      </Button>}
                      {
                        applicant?.status === 'shortlisted' && <Button size="sm"
                          className="flex-1 bg-black hover:bg-black">Booked</Button>
                      }
                      {applicant?.status !== 'rejected' && <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewProfile(applicant?.freelancerId?._id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>}
                      {applicant?.status !== 'rejected' && <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleChat(applicant.freelancerId?._id)}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileJobApplications;