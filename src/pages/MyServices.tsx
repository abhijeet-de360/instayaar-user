import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit, Plus, Eye, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileMyServices from "@/components/mobile/MobileMyServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { deletedService, getAllServices } from "@/store/ServiceSlice";

const MyServices = () => {
  // const { setUserRole, setIsLoggedIn } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>()
  const serviceVar: any = useSelector((state: RootState) => state?.service);
  const authVar: any = useSelector((state: RootState) => state?.auth);

  useEffect(() => {
    if(authVar?.isAuthenticated){
      dispatch(getAllServices());
    }
  }, [])



  // Use mobile component on small screens
  if (isMobile) {
    return <MobileMyServices />;
  }




  const handleDeleteService = (id: string) => {
    dispatch(deletedService(id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };
  const handleLogin = (role: string) => {
  };

  return (
    <div className="min-h-screen bg-background">
      <Header  onLogin={handleLogin}/>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Services</h1>
            <Link to="/create-service">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Service
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Service Visibility</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Make your services discoverable to potential clients
                </p>
                <Button size="sm" className="w-full">Boost Visibility</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Portfolio Gallery</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Showcase your work with photos and videos
                </p>
                <Link to="/portfolio-gallery">
                  <Button size="sm" variant="outline" className="w-full">Manage Gallery</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{serviceVar.totalService}</div>
                  <p className="text-sm text-muted-foreground">Active Services</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">0</div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">0.0</div>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 0 }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services List */}
          <div className="space-y-6">
            {serviceVar?.status === "loading"
              ? Array.from({ length: 3 }).map((_, i) =>
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-5 w-20 rounded-full" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-[90%] mb-4" />
                        <div className="flex items-center gap-4 text-sm">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>

                      <div className="text-right">
                        <Skeleton className="h-6 w-20 mb-4 ml-auto" />
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="h-8 w-16 rounded-md" />
                          <Skeleton className="h-8 w-16 rounded-md" />
                          <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
              : serviceVar?.serviceData?.map((service) => (
                <Card key={service?._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{service?.categoryId?.name}</Badge>
                          <Badge variant={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{service?.title}</h3>
                        <p className="text-muted-foreground mb-4">{service?.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {0} ({0} reviews)
                          </div>
                          <span>•</span>
                          <span>{67} bookings</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-4">₹{service.price}/hr</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/edit-service/${service._id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteService(service._id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

export default MyServices;