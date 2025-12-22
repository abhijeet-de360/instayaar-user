import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, MessageCircle, Phone, Star, Plus, Filter, ArrowLeft, Text, FileText, } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { cancelJobApplication, getAllAppliedJob } from "@/store/jobApplicationSlice";
import { setChatModal } from "@/store/authSlice";


const MobileAppliedJobs = () => {
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();
  const dispatch = useDispatch<AppDispatch>();
  const jobVar = useSelector((state: RootState) => state?.jobApplication);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

  // Mock applied jobs data
  const appliedJobs = [];


  useEffect(() => {
    dispatch(getAllAppliedJob())
  }, [])

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "shortlisted":
        return "Hired";
      case "hired":
        return "Hired";
      case "rejected":
        return "Not Selected";
      case "applied":
        return "Applied";
      default:
        return status;
    }
  };


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Always show header on mobile applied jobs */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Applied Jobs</span>
          </div>
          {/* <Button size="sm" className="h-8 px-3">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button> */}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Applied Jobs List */}
        <div className="space-y-4">
          {jobVar?.appliedJobs?.length > 0 ? (
            jobVar.appliedJobs.map((job) => (
              <Card key={job._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={job?.freelancerId?.profile}
                          alt={job.employer}
                          className="object-top object-cover"
                        />
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-base leading-tight">
                              {job?.jobId?.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              by {job?.freelancerId?.firstName}{" "}
                              {job?.freelancerId?.lastName}
                            </p>
                          </div>
                          <Badge className={`text-xs ${job.statusColor}`}>
                            {getStatusText(job.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start flex-col gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                        {job?.jobId?.categoryId?.name}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Applied{" "}
                        {job?.createdAt &&
                          new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(job.createdAt))}
                      </div>
                      </div>

                      <div className="flex items-start gap-1">
                        <MapPin className="h-5 w-5" />
                        {job?.jobId?.address}
                      </div>
                    </div>

                    <div className="text-lg font-bold text-primary">{job.budget}</div>

                    {job.status !== "rejected" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          // onClick={() => navigate(`/chat/${job.id}`)}
                          onClick={() => dispatch(setChatModal(true))}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        {job.status === "shortlisted" && (
                          <Button size="sm" className="flex-1">
                            View
                          </Button>
                        )}
                        {job.status === "applied" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" className="flex-1">
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete from your
                                  account and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Discard</AlertDialogCancel>
                                <AlertDialogAction onClick={() => dispatch(cancelJobApplication(job?.jobId?._id))}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Jobs Applied Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse job to apply
              </p>
            </Card>
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileAppliedJobs;
