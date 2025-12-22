import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Edit, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MobileMyPosts from "@/components/mobile/MobileMyPosts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getMyJobs } from "@/store/jobSlice";
import { parseISO, format } from "date-fns";


const MyPosts = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const jobVar = useSelector((state: RootState) => state?.jobs);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);


  useEffect(() => {
    dispatch(getMyJobs(50, 0));
  }, [])

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Use mobile component on small screens
  if (isMobile) {
    return <MobileMyPosts />;
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'in-progress': return 'secondary';
      case 'closed': return 'outline';
      case 'completed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Job Posts</h1>
            <Link to="/post-job">
              <Button>Post New Job</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">
                    {jobVar.active}
                  </div>
                  <p className="text-xs text-muted-foreground">Active Jobs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">
                    {jobVar.totalApplication}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Applications</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center flex items-center justify-center flex-col">
                  <div className="text-xl font-bold text-primary mb-1">
                    {jobVar.completed}
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">{jobVar.total}</div>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Posts List */}
          <div className="space-y-6">
            {jobVar?.jobsData.length > 0 && jobVar?.jobsData?.map((job) => (
              <Card key={job._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{job?.categoryId?.name}</Badge>
                        <Badge variant={getStatusColor(job?.status)}>
                          {job?.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{job?.title}</h3>
                      <p className="text-muted-foreground mb-4">{job?.description}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-2">₹{job?.budget}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/job-applications/${job._id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/edit-job/${job._id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted: {format(parseISO(job.createdAt), "dd MMM yyyy, hh:mm a")}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job?.address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {0} applicants
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Deadline: {format(parseISO(job.deadline), "dd MMM yyyy")}
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

export default MyPosts;