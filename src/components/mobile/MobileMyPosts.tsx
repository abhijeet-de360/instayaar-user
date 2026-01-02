import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye,
  Plus,
  ArrowLeft,
  XCircle,
  CheckCircle,
  DeleteIcon,
  Clock10,
  TableOfContents,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { getMyJobs, updateJobStatus } from "@/store/jobSlice";
import { parseISO, format, set } from "date-fns";
import { toast } from "sonner";
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
import { Switch } from "../ui/switch";
import { warningHandler } from "@/shared/_helper/responseHelper";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

const MobileMyPosts = () => {
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };
  const [open, setOpen] = useState(false)
  const [deletepop, setDeletepop] = useState(false);
  const jobVar = useSelector((state: RootState) => state?.jobs);
  const authVar = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getMyJobs(10, 0));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "closed":
        return "outline";
      case "inActive":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "closed":
        return "Closed";
      case "pending":
        return "Pending";
      case "inActive":
        return "Inactive";
      default:
        return status;
    }
  };

  const handleDelete = (id) => {
    dispatch(updateJobStatus("deleted", id));
    setDeletepop(false);
  };

  function formatTime(time) {
    if (!time) return "-";
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // converts 0 → 12
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }

  

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hide header when logged in on mobile */}
      {!authVar?.isAuthenticated && <Header onLogin={handleLogin} />}

      <div className="sticky top-0 z-20 bg-background border-b">
        <div className="flex items-center justify-between p-4 py-2">
          <Link to="/employer-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">My Post</span>
          </Link>
          <Button
            size="sm"
            onClick={() => {
              if (
                !authVar?.user?.firstName ||
                !authVar?.user?.lastName ||
                !authVar?.user?.city ||
                !authVar?.user?.state ||
                !authVar?.user?.email ||
                !authVar?.user?.profile
              ) {
                warningHandler("Update your account settings to continue.");
                navigate('/user-account-settings')
              } else {
                // navigate("/post-job");
                setOpen(true)
              }
            }}
            className="px-2 pr-3 "
          >
            <Plus className="h-4 w-4" />
            Post
          </Button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Header */}
        {/* <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">My Job Posts</h1>
            <p className="text-sm text-muted-foreground">Manage your job listings</p>
          </div>
          <Link to="/post-job">
            <Button size="sm" className="h-10 px-4">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </Link>
        </div> */}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2 text-center">
            <div className="text-md">{jobVar?.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </Card>
          <Card className="p-2 text-center">
            <div className="text-md">{jobVar?.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </Card>
          <Card className="p-2 text-center flex items-center justify-center flex-col">
            <div className="text-md">{jobVar?.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-2 text-center">
            <div className="text-md">{jobVar?.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </Card>
        </div>

        {/* Job Posts List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Posts</h3>

          {jobVar?.jobsData?.map((job) => (
            <Card key={job._id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {job?.categoryId?.name}
                    </Badge>
                    <Badge
                      variant={getStatusColor(job.status)}
                      className="text-xs capitalize"
                    >
                      {getStatusText(job?.status)}
                    </Badge>
                    {job?.status !== "pending" && job?.status !== "deleted" && (
                      <Switch
                        id="inActive"
                        onClick={() => {
                          if (job?.status === "active") {
                            dispatch(updateJobStatus("inActive", job?._id));
                          } else if (job?.status === "inActive") {
                            dispatch(updateJobStatus("active", job?._id));
                          }
                        }}
                        checked={job?.status === "active"}
                      />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      ₹{job?.budget}
                    </div>
                  </div>
                </div>

                {/* Job Title */}
                <h4 className="font-semibold text-base leading-tight capitalize">
                  {job?.title}
                </h4>

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {/* <Calendar className="h-3 w-3" /> */}
                    Due: {format(parseISO(job.deadline), "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {/* <Calendar className="h-3 w-3" /> */}
                    Event: {format(parseISO(job?.prefferedDate), "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {/* <Users className="h-3 w-3" /> */}
                    {job?.totalApplications} Applicants
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {/* <Clock10 className="h-3 w-3" /> */}
                    Time: {formatTime(job?.timeFrom)} -{" "}
                    {formatTime(job?.timeTo)}
                  </div>
                </div>

                <div className="">
                  <div className="flex items-start gap-1 text-xs text-muted-foreground">
                    {job?.address}
                  </div>
                  <p className="text-xs mt-2">
                    Description: {job?.description}
                  </p>
                </div>

                {/* Actions */}
                {job?.status !== "deleted" && (
                  <div className="flex gap-2 pt-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className=""
                      onClick={() => {
                        if (job?.status === "pending") {
                          toast.warning(
                            "This job is not yet approved by admin."
                          );
                        } else {
                          navigate(`/job-applications/${job._id}`);
                        }
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {job?.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        {job?.status !== "deleted" && (
                          <Button
                            variant={"outline"}
                            size="icon"
                            className="h-9"
                          >
                            <Trash2 className="h-2" />
                          </Button>
                        )}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will close your
                            post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(job._id)}
                          >
                            Yes! Delete & Close
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
              {/* <AlertDialog open={deletepop} onOpenChange={() => setDeletepop(false)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(job?._id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
            </Card>
          ))}
        </div>
      </div>

      <MobileBottomNav />
      <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Choose Booking Type</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 items-center">
            <Button variant="outline" className="h-28LO border-neutral-400 p-4 flex flex-col items-start space-y-1 hover:bg-accent w-full" onClick={() => navigate('/instant-booking')}>
              <p>Instant Booking</p>
              <small className="text-sm text-gray-500">Book freelancers for an immediate requirement.</small>
            </Button>
            <Button variant="outline" className="h-auto border-neutral-400 p-4 flex flex-col items-start space-y-1 hover:bg-accent w-full" onClick={() => navigate('/post-job')}>
              <p>Post for Future</p>
              <small className="text-sm text-gray-500 text-left">Post a requirement and let Freelancers see <br /> details and apply with their offer.</small>
            </Button>
          </div>

          <DrawerFooter>
            {/* <div className="flex items-center gap-4 justify-center">
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </DrawerClose>
            </div> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
    </div>
  );
};

export default MobileMyPosts;
