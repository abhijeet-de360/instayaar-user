import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useJobShortlist } from "@/hooks/useJobShortlist";
import { LoginModal } from "@/components/auth/LoginModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/shared/JobCard";
import { ArrowLeft, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { recentJobs } from "@/data/staticData";
import { useMemo } from "react";

const ShortlistJobs = () => {
  const { setUserRole, setIsLoggedIn, isLoggedIn, userRole } = useUserRole();
  const { isMobile, showLoginModal, setShowLoginModal, checkAuth } =
    useAuthCheck();
  const { getShortlistedJobs, shortlistCount, shortlistedJobIds } =
    useJobShortlist();
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

  // Filter jobs based on shortlisted IDs - this will re-render when shortlistedJobIds changes
  const shortlistedJobs = useMemo(() => {
    return recentJobs.filter((job) => shortlistedJobIds.includes(job.id));
  }, [shortlistedJobIds]);

  const handleApplyToJob = (jobId: number) => {
    if (!isLoggedIn) {
      checkAuth();
      return;
    }

    if (userRole !== "freelancer") {
      toast.error("Only freelancers can apply to jobs");
      return;
    }

    // TODO: Implement actual job application logic
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Header onLogin={handleLogin} />
      </div>

      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link to="/freelancer-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Shortlist Jobs</span>
          </Link>
          {/* <Button size="sm" className="h-8 px-3">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button> */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Shortlisted Jobs</h1>
          <p className="text-muted-foreground">
            Your saved job opportunities ({shortlistCount} saved)
          </p>
        </div> */}

        {shortlistedJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Heart className="w-16 h-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold">
                No jobs in your shortlist
              </h3>
              <p className="text-muted-foreground">
                Start browsing and save jobs you're interested in
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {shortlistedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApplyToJob}
                showShortlistButton={true}
                isShortlistPage={true}
              />
            ))}
          </div>
        )}
      </div>

      <MobileBottomNav />

      <LoginModal
        isOpen={showLoginModal}
        onClose={setShowLoginModal}
        onLoginSuccess={handleLogin}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ShortlistJobs;
