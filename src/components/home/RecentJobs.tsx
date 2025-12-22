import freelancerData from "@/data/freelancerData.json";
import type { FreelancerData } from "@/types/freelancerTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getRecentJobs } from "@/store/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LoginModal } from "../auth/LoginModal";

export const RecentJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const jobsVar = useSelector((state: RootState) => state.jobs);
  const navigate = useNavigate();
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const authVar = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getRecentJobs());
  }, [dispatch]);

  const handleApply = () => {
    if (!authVar.isAuthenticated) {
      setShowMobileAuth(true);
      return;
    }
  };

  function formatTime(time) {
  if (!time) return "-";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12; // converts 0 → 12
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}


  return (
    <section className="">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">
            <span className="md:hidden">Recent Jobs</span>
            <span className="hidden md:inline">Recently Posted Jobs</span>
          </h2>
          <span
            className="text-sm text-primary cursor-pointer"
            onClick={(e) => {
              if(authVar?.isAuthenticated){
                navigate("/browse-jobs")
              }else{
                setShowMobileAuth(true)
              }
            }}
          >
            View All →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jobsVar.recentJobs.map((job, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {job?.categoryId?.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(job.prefferedDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}, {formatTime(job?.timeFrom)} - {formatTime(job?.timeTo)}
                  </span>
                </div>

                <h3 className="font-medium text-foreground mb-2 line-clamp-2 capitalize">
                  {job.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground ">
                    <span className="leading-tight">
                      Address: {job.address}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-xl">
                    <span className="font-semibold text-primary">
                      ₹{job.budget}
                    </span>
                  </div>
                  <Button size="sm" onClick={handleApply}>
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <LoginModal
        isOpen={showMobileAuth}
        onClose={() => setShowMobileAuth(false)}
        onLoginSuccess={() => {}}
        isMobile={true}
      />
    </section>
  );
};
