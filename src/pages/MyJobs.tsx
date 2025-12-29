import { useEffect, useState } from "react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobOTPBottomSheet } from "@/components/job/JobOTPBottomSheet";
import {
  Calendar,
  MapPin,
  MessageCircle,
  CheckCircle,
  Star,
  Briefcase,
  Clock10Icon,
  Calendar1Icon,
  Clock10,
  PhoneCallIcon,
  X,
  PhoneCall,
  Lock,
  Phone,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  cancelBooking,
  closeModal,
  confirmBooking,
  getAllFreelancerBookings,
} from "@/store/bookingSlice";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getConversationId } from "@/store/chatSlice";
import { useNavigate } from "react-router-dom";
import {
  closeJobsModal,
  completJobApplication,
  confirmJobApplication,
  rejectJobApplication,
  startJobApplication,
} from "@/store/jobSlice";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyJobs = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [activeTab, setActiveTab] = useState("active");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpAction, setOtpAction] = useState<"start" | "complete">("start");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedPostJob, setSelectedPostJob] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const bookingVar = useSelector((state: RootState) => state?.booking);
  const jobsVar = useSelector((state: RootState) => state?.jobs)
  const dispatch = useDispatch<AppDispatch>();
  const [confirm, setConfirm] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [formVar, setFromvar] = useState({
    limit: 100,
    offset: 0,
    allLimit: 100,
    allOffset: 0,
  });

  const [jobsData, setJobsData] = useState({
    activeJobs: [],
    completedJobs: [],
  });

  useEffect(() => {
    dispatch(
      getAllFreelancerBookings(
        formVar?.limit,
        formVar?.offset,
        formVar?.allLimit,
        formVar?.allOffset
      )
    );
  }, []);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

  const handleStartJob = (job: any) => {
    setService(job);
    setSelectedJob(job);
    setOtpModalOpen(true);
    setOtp("");
  };

  const handleCompleteJob = (job: any) => {
    setSelectedJob(job);
    setOtpAction("complete");
    setOtpModalOpen(true);
    setOtp("");
  };

  const handleConfirm = (id) => {
    dispatch(confirmBooking(id));
    setConfirm(false);
  };

  const handleCancel = (id) => {
    dispatch(cancelBooking(id));
    setCancelConfirm(false);
  };

  const handleOTPSuccess = () => {
    if (selectedJob && otpAction === "start") {
      // Update job status to in-progress
      setJobsData((prev) => ({
        ...prev,
        activeJobs: prev.activeJobs.map((job) =>
          job.id === selectedJob.id ? { ...job, status: "in-progress" } : job
        ),
      }));
    } else if (selectedJob && otpAction === "complete") {
      // Move job from active to completed
      const completedJob = {
        ...selectedJob,
        status: "completed",
        completedDate: new Date().toISOString().split("T")[0],
        rating: 5, // Default rating for demo
      };

      setJobsData((prev) => ({
        activeJobs: prev.activeJobs.filter((job) => job.id !== selectedJob.id),
        completedJobs: [completedJob, ...prev.completedJobs],
      }));
    }
  };

  // Mock stats data
  const stats = {
    activeJobs: jobsData.activeJobs.length,
    completedJobs: jobsData.completedJobs.length,
    thisMonthEarnings: 0,
    rating: 0.0,
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "onGoing":
        return "destructive";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return null;
      case "onGoing":
        return null;
      case "pending":
        return null;
      case "completed":
        return null;
      default:
        return null;
    }
  };

  const handleChat = (userId) => {
    dispatch(getConversationId(userId, navigate));
  };

  const handleServiceChat = (userid) => {
    dispatch(getConversationId(userid, navigate));
  };

  const handleReject = (id) => {
    dispatch(rejectJobApplication(id));
  };

  const handleConfirmJob = (id) => {
    dispatch(confirmJobApplication(id));
  };

  const [jobOtpModal, setJobOtpModal] = useState(false);
  const [action, setAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseJobOtp = () => {
    setJobOtpModal(false);
    setOtp("");
    // Select Job
  };

  const handleStart = async () => {
    if (action === "complete") {
      await dispatch(completJobApplication(selectedPostJob?._id, otp));
      handleCloseJobOtp();
    } else {
      await dispatch(startJobApplication(selectedPostJob?._id, otp));
      handleCloseJobOtp();
    }
  };

  const handleJobStart = (job) => {
    setJobOtpModal(true);
    setSelectedPostJob(job);
  };

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedJobView, setSelectedJobView] = useState<any>(null);
  const handleServiceView = (service) => {
    setSelectedService(service);
  };

  const handleJobView = (job) => {
    setSelectedJobView(job);
  };

  function formatTime(time) {
    if (!time) return "-";
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // converts 0 → 12
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }

  const JobCard = ({
    job,
    isCompleted = false,
  }: {
    job: any;
    isCompleted?: boolean;
  }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight mb-1 truncate capitalize">
                  {job?.serviceId?.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {job?.bookingId} | {job?.userId?.firstName} {job?.userId?.lastName}
                </p>
              </div>
              {/* <Badge variant="outline" className="ml-2 text-xs">
                Direct
              </Badge> */}
            </div>

            <div className="space-y-2">
              <div className="flex items-start flex-col gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {/* <Calendar className="h-3 w-3" /> */}
                    <span>
                      {new Date(job?.bookingDate).getDate()}/
                      {new Date(job?.bookingDate).getMonth() + 1}/
                      {new Date(job?.bookingDate).getFullYear()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* <Clock10Icon className="h-3 w-3" /> */}
                    <span>{job?.bookingTime}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  {/* <MapPin className="h-5 w-5" /> */}
                  <span>{job?.address}</span>
                </div>
                {job?.status === "cancelled" && (
                  <Badge
                    className="flex capitalize text-xs self-end"
                    variant="destructive"
                  >
                    {job?.status === "cancelled" ? "Rejected" : ""}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                {job?.status !== "cancelled" && (
                  <div className="text-lg font-bold text-primary">
                    ₹{job?.totalPrice}
                  </div>
                )}
                {isCompleted && job.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{job.rating}</span>
                  </div>
                )}
              </div>

              {!isCompleted && job?.status !== "cancelled" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    className="h-8  text-xs"
                    size="icon"
                    variant="outline"
                    onClick={() => handleServiceView(job)}
                  >
                    <Info className="w-8 h-8 text-primary" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleServiceChat(job?.userId?._id)}
                  >
                    Chat
                  </Button>
                  {job?.status === "booked" && (
                    <>
                      <Button
                        className="h-8 flex-1 text-xs"
                        variant="outline"
                        onClick={() => setCancelConfirm(true)}
                      >
                        Reject
                      </Button>
                      <Dialog
                        open={cancelConfirm}
                        onOpenChange={() => setCancelConfirm(false)}
                      >
                        <DialogContent className="sm:max-w-[360px] rounded-lg shadow-lg">
                          <DialogHeader className="text-center">
                            <DialogTitle className="text-lg font-semibold">
                              Cancel Service
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Sure you want to cancel this service booking?
                            </DialogDescription>
                          </DialogHeader>

                          <DialogFooter className="flex justify-center gap-3 mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">No</Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() => handleCancel(job?._id)}
                            >
                              Yes, Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  {job.status === "booked" && (
                    <>
                      <Button
                        className="flex-1 h-8 text-xs"
                        size="sm"
                        onClick={() => setConfirm(true)}
                      >
                        Confirm
                      </Button>
                      <Dialog
                        open={confirm}
                        onOpenChange={() => setConfirm(false)}
                      >
                        <DialogContent className="sm:max-w-[360px] rounded-lg shadow-lg">
                          <DialogHeader className="text-center">
                            <DialogTitle className="text-lg font-semibold">
                              Confirm Service
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Sure you want to confirm this service booking?
                            </DialogDescription>
                          </DialogHeader>

                          <DialogFooter className="flex justify-center gap-3 mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                            <Button onClick={() => handleConfirm(job?._id)}>
                              Confirm
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  {job.status === "confirmed" && (
                    <>
                      <a
                        href={`tel:${job?.userId?.phoneNumber}`}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          className="h-8 text-xs w-full"
                          variant="outline"
                        >
                          <Phone />
                          Call
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleStartJob(job)}
                      >
                        Start
                      </Button>
                    </>
                  )}
                  {job.status === "onGoing" && (
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleCompleteJob(job)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {selectedService && (
        <Drawer
          open={!!selectedService}
          onOpenChange={() => setSelectedService(null)}
        >
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle className="text-xl">
                {selectedService?.serviceId?.title}
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2 flex-col rounded-lg p-4">
                <div>
                  <h4 className="font-semibold mb-1">Skills & Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    <span>{selectedService?.serviceId?.skills.join(", ")}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Years of experiences:</h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{selectedService?.serviceId?.experience} Years</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    Equipments/Tools Required:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{selectedService?.serviceId?.equipments}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Special Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{selectedService?.serviceId?.requirements}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Service Details:</h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{selectedService?.serviceId?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              {/* <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg mb-2 mx-auto">
                <Briefcase className="h-4 w-4 text-primary" />
              </div> */}
              <div className="text-lg font-bold">
                {bookingVar?.freelancerBookings.all?.total}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              {/* <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mb-2 mx-auto">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div> */}
              <div className="text-lg font-bold">
                {bookingVar?.freelancerBookings.completed?.total}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              {/* <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg mb-2 mx-auto">
                <X className="h-4 w-4 text-red-600" />
              </div> */}
              <div className="text-lg font-bold">
                {bookingVar?.freelancerBookings?.cancelledBooking || 0}
              </div>
              <div className="text-xs text-muted-foreground">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active" className="text-sm">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-sm">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="">
            {bookingVar?.freelancerBookings.all?.total > 0 ? (
              bookingVar?.freelancerBookings?.all?.result.map((job, index) => {
                if (job.type === "service") {
                  return <JobCard key={index} job={job?.data} />;
                }

                if (job.type === "job") {
                  return (
                    <Card key={index} className="mb-4">
                      <div className="p-4">
                        <div className="w-full flex items-center justify-between">
                          <div>
                            <p className="font-semibold capitalize">
                              {job?.data?.jobId?.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {job?.data?.applicationId} | {` ${job?.data?.jobId?.userId?.firstName}  ${job?.data?.jobId?.userId?.lastName}`}
                            </p>
                          </div>
                          {/* <Badge variant="outline">
                            {job?.type === "job" ? "Post" : "Service"}
                          </Badge> */}
                        </div>
                        <div className="flex items-start justify-start flex-col gap-2 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 font-[300] text-xs">
                              {/* <Calendar1Icon className="w-3 h-3 font-medium" /> */}
                              {job?.data?.jobId?.prefferedDate
                                ? new Date(
                                  job.data.jobId.prefferedDate
                                ).toLocaleDateString("en-GB")
                                : "No date"}
                            </span>

                            <span className="flex items-center gap-1 font-[300] text-xs">
                              {/* <Clock10 className="w-3 h-3" /> */}
                              {formatTime(job?.data?.jobId?.timeFrom)} - {formatTime(job?.data?.jobId?.timeTo)}
                            </span>
                          </div>

                          <span className="flex items-start gap-1 font-[300] text-xs">

                            {job?.data?.jobId?.address}
                          </span>

                          {job?.data?.status === 'rejected' && <Badge
                            className="flex capitalize self-end"
                            variant="destructive"
                          >
                            {job?.data?.status}
                          </Badge>}
                        </div>

                        {job?.data?.status !== "rejected" && (
                          <p className="font-semibold text-primary mt-2">
                            ₹{job?.data?.bidAmount}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 w-full">
                          {job.data.status !== "rejected" && (
                            <Button
                              className="h-8  text-xs"
                              size="icon"
                              variant="outline"
                              onClick={() => handleJobView(job?.data)}
                            >
                              <Info className="w-8 h-8 text-primary" />
                            </Button>
                          )}
                          {job?.data?.status !== "rejected" && (
                            <Button
                              className="flex-1 h-8 text-xs"
                              variant="outline"
                              onClick={() =>
                                handleChat(job?.data?.jobId?.userId?._id)
                              }
                            >
                              Chat
                            </Button>
                          )}
                          {job?.data?.status === "shortlisted" && (
                            <>
                              {/* <Button variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleReject(job?.data?._id)}>Reject</Button>
                              <Button className="flex-1 h-8 text-xs" onClick={() => handleConfirmJob(job?.data?._id)}>Confirm</Button> */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="flex-1 h-8 text-xs"
                                  >
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Sure you want to reject this job?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The job will
                                      be marked as rejected.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleReject(job?.data?._id)
                                      }
                                      className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              {/* Confirm Alert Dialog */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button className="flex-1 h-8 text-xs">
                                    Confirm
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {" "}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleConfirmJob(job?.data?._id)
                                      }
                                      className="bg-green-600 text-white hover:bg-green-700"
                                    >
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {job?.data?.status === "hired" && (
                            <>
                              <a
                                href={`tel:${job?.data?.jobId?.userId?.phoneNumber}`}
                                className="flex-1"
                              >
                                <Button
                                  className="h-8 text-xs w-full"
                                  variant="outline"
                                >
                                  Call
                                </Button>
                              </a>
                              <Button
                                className="flex-1 h-8 text-xs"
                                onClick={() => {
                                  handleJobStart(job?.data);
                                  setAction("start");
                                }}
                              >
                                Start
                              </Button>
                            </>
                          )}
                          {job?.data?.status === "inProgress" && (
                            <>
                              <Button
                                className="flex-1 h-8 text-xs"
                                onClick={() => {
                                  handleJobStart(job?.data);
                                  setAction("complete");
                                }}
                              >
                                Complete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                }

                // if not service and not shortlisted job, render nothing (or something else if needed)
                return null;
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Active Jobs</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start browsing for new opportunities
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="">
            {bookingVar?.freelancerBookings.completed?.total > 0 ? (
              bookingVar?.freelancerBookings.completed?.result.map(
                (job, index) =>
                  job.type === "service" ? (
                    <JobCard key={index} job={job?.data} />
                  ) : (
                    <Card key={index} className="mb-4">
                      <div className="p-4">
                        <div className="w-full flex items-center justify-between">
                          <p className="font-semibold capitalize">
                            {job?.data?.jobId?.title}
                          </p>
                          {/* <Badge>
                            {job?.type === "job" ? "Job" : "Service"}
                          </Badge> */}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {job?.data?.applicationId} | {` ${job?.data?.jobId?.userId?.firstName}  ${job?.data?.jobId?.userId?.lastName}`}
                        </p>
                        <div className="flex items-start flex-col gap-2 mt-2">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs">
                              {(() => {
                                const dateToUse = job?.data?.jobId?.prefferedDate
                                  ? job.data.jobId.prefferedDate
                                  : job?.data?.jobId?.createdAt;

                                const dateObj = new Date(dateToUse);

                                const formattedDate = dateObj.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                });

                                const formattedTime = dateObj.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                });

                                return `${formattedDate}  ${formattedTime}`;
                              })()}
                            </span>



                            {/* <span className="flex items-center gap-1 text-xs">
                              <Clock10 className="w-3 h-3 font-medium" />
                              {job?.data?.jobId?.timeFrom} -{" "}
                              {job?.data?.jobId?.timeTo}
                            </span> */}
                          </div>

                          <span className="flex items-start gap-1 text-xs">
                            {job?.data?.jobId?.address}
                          </span>
                        </div>

                        {job?.data?.status !== "rejected" && (
                          <p className="font-bold text-primary mt-2">
                            ₹{job?.data?.bidAmount}
                          </p>
                        )}
                        <div className="flex items-center justify-end gap-2 mt-2 w-full">
                          <Button
                            className="h-8  text-xs"
                            size="icon"
                            variant="outline"
                            onClick={() => handleJobView(job?.data)}
                          >
                            <Info className="w-8 h-8 text-primary" />
                          </Button>
                          <Button
                            className=" h-9 w-full"
                            variant="outline"
                            onClick={() =>
                              handleChat(job?.data?.jobId?.userId?._id)
                            }
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
              )
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Completed Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed jobs will appear here
                  </p>
                </CardContent>
              </Card>
            )}
            {/* <Button>Load More Completed</Button> */}
          </TabsContent>
        </Tabs>
      </div>

      <MobileBottomNav />

      {/* OTP Bottom Sheet */}
      <JobOTPBottomSheet
        isOpen={otpModalOpen}
        onClose={() => {
          setOtpModalOpen(false);
          setSelectedJob(null);
        }}
        service={service}
        action={otpAction}
        jobTitle={selectedJob?.title || ""}
        onSuccess={handleOTPSuccess}
        otp={otp}
        setOtp={setOtp}
        jobId={selectedJob?._id}
      />

      {/* <Drawer open={jobOtpModal} onOpenChange={handleCloseJobOtp}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-none">
            <div className="flex items-center justify-between">
            </div>
          </DrawerHeader>

          <div className="px-4 py-6 space-y-6">

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="otp" className="text-center block">
                  Enter 4-Digit OTP
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={4}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseJobOtp}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || otp?.length !== 4}
                  className="flex-1"
                  onClick={handleStart}
                >
                  {isSubmitting
                    ? `${action === 'start' ? 'Starting...' : 'Completing...'}`
                    : `${action === 'start' ? 'Start Job' : 'Complete Job'}`
                  }
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer> */}

      <Drawer open={jobOtpModal} onOpenChange={handleCloseJobOtp}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-none" />

          <div className="px-4 py-6 space-y-6">
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const prefDateRaw = selectedPostJob?.jobId?.prefferedDate;
              const prefDate = prefDateRaw ? new Date(prefDateRaw) : null;
              if (prefDate) prefDate.setHours(0, 0, 0, 0);

              const isFuture = prefDate && prefDate.getTime() > today.getTime();

              const formattedDate = prefDate
                ? prefDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "";

              // 🔹 CASE 1: Future preferred date → show message
              if (isFuture) {
                return (
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-lg">
                      You can start this job on {formattedDate} or after
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Please come back on the preferred date to start the job.
                    </p>
                    {/* <Button
                      variant="outline"
                      onClick={handleCloseJobOtp}
                      className="mt-4"
                    >
                      Close
                    </Button> */}
                  </div>
                );
              }

              // 🔹 CASE 2: Today or before → show OTP boxes
              return (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="otp" className="text-center block">
                      Enter 4-Digit OTP
                    </Label>
                    <div className="flex justify-center">
                      <InputOTP value={otp} onChange={setOtp} maxLength={4}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseJobOtp}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || otp?.length !== 4}
                      className="flex-1"
                      onClick={handleStart}
                    >
                      {isSubmitting
                        ? `${action === "start" ? "Starting..." : "Completing..."
                        }`
                        : `${action === "start" ? "Start Job" : "Complete Job"
                        }`}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </DrawerContent>
      </Drawer>

      {selectedJobView && (
        <Drawer
          open={!!selectedJobView}
          onOpenChange={() => setSelectedJobView(null)}
        >
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle className="text-xl capitalize">
                {selectedJobView?.jobId?.title}
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2 flex-col rounded-lg p-4">
                <div>
                  <p>
                    Created At:{" "}
                    {selectedJobView?.createdAt
                      ? new Date(selectedJobView.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }).replace(",", "")
                      : "-"}
                  </p>
                  <h4 className="font-semibold mb-1">Description</h4>
                  <div className="flex flex-wrap gap-2">
                    <span>{selectedJobView?.jobId?.description}</span>
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <Dialog open={bookingVar?.modalOpen} onOpenChange={() => dispatch(closeModal(false))}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-start justify-between">
            <DialogHeader className="w-full">
              <DialogTitle className="text-lg">Action not allowed</DialogTitle>
              <div className=" w-full">
                <p>To cancel please contact to support</p>
              </div>
            </DialogHeader>
          </div>

          <DialogFooter className="mt-4">
            <Button asChild className="" onClick={() => {
              navigate('/help-support');
              dispatch(closeModal(false))
            }}>
              <a href="mailto:support@example.com">Contact Support</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={jobsVar?.jobModalOpen} onOpenChange={() => dispatch(closeJobsModal(false))}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-start justify-between">
            <DialogHeader className="w-full">
              <DialogTitle className="text-lg">Action not allowed</DialogTitle>
              <div className=" w-full">
                <p>To cancel please contact to support</p>
              </div>
            </DialogHeader>
          </div>

          <DialogFooter className="mt-4">
            <Button asChild className="" onClick={() => {
              navigate('/help-support');
              dispatch(closeJobsModal(false))
            }}>
              <a href="mailto:support@example.com">Contact Support</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyJobs;
