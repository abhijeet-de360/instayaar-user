import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Eye, MessageCircle } from "lucide-react";
import MobileAppliedJobs from "@/components/mobile/MobileAppliedJobs";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Use mobile component on small screens
  if (isMobile) {
    return <MobileAppliedJobs />;
  }

  // Mock applied jobs data - jobs the freelancer has applied for
  const appliedJobs = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired': return 'default';
      case 'shortlisted': return 'secondary';
      case 'pending': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hired': return 'Hired ✓';
      case 'shortlisted': return 'Shortlisted';
      case 'pending': return 'Under Review';
      case 'rejected': return 'Not Selected';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Job Applications</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">
                    {appliedJobs.filter(job => job.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">
                    {appliedJobs.filter(job => job.status === 'shortlisted').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Shortlisted</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">
                    {appliedJobs.filter(job => job.status === 'hired').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Hired</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">
                    {appliedJobs.filter(job => job.status === 'rejected').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Applied Jobs List */}
          <div className="space-y-6">
            {appliedJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getStatusColor(job.status)}>
                          {getStatusText(job.status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Applied {job.appliedTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-muted-foreground mb-2">Client: {job.client}</p>
                      <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-2">{job.budget}</div>
                      {job.status === 'hired' && (
                        <Button size="sm">
                          View Contract
                        </Button>
                      )}
                      {job.status === 'shortlisted' && (
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Client
                        </Button>
                      )}
                      {job.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Application
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Job Date: {job.jobDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicants} total applicants
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Applied: {job.appliedDate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Empty State if no applications */}
          {appliedJobs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-4">No Job Applications Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start browsing and applying for jobs to see them here
                </p>
                <Button>Browse Available Jobs</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AppliedJobs;