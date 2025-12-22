
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, Clock, X } from "lucide-react";
import { useJobShortlist } from "@/hooks/useJobShortlist";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobApplicationModal } from "@/components/job/JobApplicationModal";
import { JobApplicationBottomSheet } from "@/components/job/JobApplicationBottomSheet";
import { LoginModal } from "@/components/auth/LoginModal";
import { useToast } from "@/hooks/use-toast";
import { parseISO, format } from "date-fns";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Job {
  id: number;
  title: string;
  category: string;
  budget: string;
  location: string;
  timePosted: string;
  applicants: number;
  description: string;
}

interface JobCardProps {
  job: Job;
  onApply?: (jobId: number) => void;
  showShortlistButton?: boolean;
  isShortlistPage?: boolean;
}

export const JobCard = ({ job, onApply, showShortlistButton = true, isShortlistPage = false }: any) => {
  const { isJobShortlisted, toggleJobShortlist } = useJobShortlist();
  const authVar = useSelector((state: RootState) => state?.auth)
  const { isLoggedIn, userRole, setIsLoggedIn, setUserRole } = useUserRole();
  const isMobile = useIsMobile();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [verify, setVerify] = useState(false)
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShortlistToggle = () => {
    if (!isLoggedIn || userRole !== 'freelancer') {
      toast({
        title: "Please login as a freelancer to shortlist jobs",
        variant: "destructive"
      });
      return;
    }

    const wasShortlisted = isJobShortlisted(job.id);
    const success = toggleJobShortlist(job.id);
    if (success) {
      toast({
        title: !wasShortlisted ? "Job added to shortlist" : "Job removed from shortlist"
      });
    }
  };

  const handleApply = () => {
    if (!authVar?.isAuthenticated) {
      setShowLoginModal(true);
      return;
    } else {
      if (!authVar?.freelancer?.firstName || authVar?.freelancer?.status === 'pending' || authVar?.freelancer?.status === 'inActive') {
        setVerify(true)
      } else {
        setShowApplicationModal(true);
      }

    }
  };

  const handleLoginSuccess = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
    setShowLoginModal(false);
    setShowApplicationModal(true);
  };

  const isShortlisted = isJobShortlisted(job.id);

  function formatTime(time) {
    if (!time) return "-";
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // converts 0 → 12
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }


  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200  bg-card">
        <CardContent className="p-4">
          {/* Header with badge, time and heart */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center justify-between w-full">
                <Badge variant="secondary" className="bg-muted text-muted-foreground font-medium px-3 py-1 rounded-full text-xs">
                  {job?.categoryId?.name}
                </Badge>
                {(job?.applicationStatus === 'shortlisted' || job?.applicationStatus === 'applied') && (
                  <Badge className="font-medium px-3 py-1 rounded-full text-xs">
                    {job?.applicationStatus === 'shortlisted' ? 'Applied' : 'Applied'}
                  </Badge>
                )}

              </div>
            </div>
            {showShortlistButton && userRole === 'freelancer' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShortlistToggle}
                className={`p-2 hover:bg-transparent ${isShortlistPage ? 'text-red-500 hover:text-red-600' : isShortlisted ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
              >
                {isShortlistPage ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Heart className={`h-5 w-5 ${isShortlisted ? 'fill-current' : ''}`} />
                )}
              </Button>
            )}
          </div>

          {/* Job title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 capitalize">{job?.title}</h3>

          {/* Job description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{job?.description}</p>

          {/* Budget and Apply button */}


          {/* Footer info */}
          <div className="flex flex-col-reverse text-xs text-muted-foreground pt-3 border-t border-secondary-foreground gap-1">
            <div className="flex gap-1 items-start">
              <span>{job?.address}</span>
            </div>
            <div className="w-full flex items-center gap-3">
              {/* <div className="flex items-center gap-1 ">
                <Users className="h-3 w-3" />
                <span>{0} applicants</span>
              </div> */}
              <div className="flex items-center gap-1">
                <span>{job?.prefferedDate ? format(parseISO(job.prefferedDate), "dd/MM/yyyy") : "No date"}
                  &nbsp;&nbsp;&nbsp;{formatTime(job?.timeFrom)} - {formatTime(job?.timeTo)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-right">
              <div className="text-xl font-bold text-primary">₹{job.budget}</div>
            </div>
            {job?.applicationStatus === null && (
              <Button
                onClick={handleApply}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium"
              >
                Apply
              </Button>
            )}

          </div>
        </CardContent>
      </Card>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        isMobile={isMobile}
      />

      {/* Application Modal/Bottom Sheet */}
      {isMobile ? (
        <JobApplicationBottomSheet
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          job={job}
        />
      ) : (
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          job={job}
        />
      )}
      <Dialog open={verify} onOpenChange={() => setVerify(false)}>
        <DialogContent className="sm:max-w-[400px] text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-red-600 text-lg">
              Account Not Verified
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Sorry, your account has not been verified yet.
              Please verify your account to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button onClick={() => {
              setVerify(false)
              navigate('/account-settings')
            }} >
              Verify Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
