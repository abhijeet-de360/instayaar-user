import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Plus, TrendingUp, Eye, Edit, AlertTriangle, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deletedService, getAllServices } from "@/store/ServiceSlice";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const MobileMyServices = () => {
  const authVar: any = useSelector((state: RootState) => state?.auth);
  const serviceVar = useSelector((state: RootState) => state?.service);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [deleteView, setDeleteView] = useState<any>(false);

  useEffect(() => {
    if (authVar?.isAuthenticated) {
      dispatch(getAllServices());
    }
  }, []);

  const handleLogin = (role: string) => { };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hide header when logged in on mobile */}
      {!authVar.isAuthenticated && <Header onLogin={handleLogin} />}

      <div className="px-4 py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Services</h1>
            <p className="text-sm text-muted-foreground">
              Manage your offerings
            </p>
          </div>
          <div onClick={() => {
            if (authVar?.freelancer?.status !== 'active') {
              navigate('/account-settings')
              toast.warning("This account is not verified!")
            } else {
              navigate('/create-service')
            }
          }}>
            <Button size="sm" className="h-10 px-4">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold">₹00</div>
                <div className="text-xs text-muted-foreground">Total Earnings</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold">0.0</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </Card>
        </div>
        <Card className="p-4">
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Portfolio</h1>
            <p className="text-sm text-muted-foreground">Showcase your work</p>
          </div>
          <Link to="/portfolio-gallery">
            <Button size="sm" variant="outline" className="h-10 px-4">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </Link>
        </div>
        </Card> */}

        {/* Performance Overview */}
        {/* <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Bookings</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">0</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">
                {serviceVar?.serviceData?.length}
              </div>
              <div className="text-xs text-muted-foreground">Services</div>
            </div>
          </div>
        </Card> */}

        {/* Services List */}
        <div className="space-y-4">
          {serviceVar?.serviceData?.map((service) => (
            <Card key={service._id} className="overflow-hidden">
              <div className="aspect-[16/9] relative">
                {/* <img
                  src={service?.images[0]}
                  alt={service?.title}
                  className="w-full h-full object-cover"
                /> */}
                <div className=" w-full h-64">
                  <Swiper
                    spaceBetween={10}
                    centeredSlides={true}
                    speed={1200}
                    loop={true}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={false}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper h-full rounded-t-lg"
                  >
                    {
                      service?.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img src={image} alt={service?.title} className="w-full h-full object-cover" />
                        </SwiperSlide>
                      ))
                    }
                  </Swiper>
                </div>
                <div className="absolute top-3 left-3 z-20">
                  <Badge variant="default" className="text-xs">
                    {service?.status === "pending" ? "Pending" : "Active"}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 z-20">
                  <Badge variant="secondary" className="text-xs">
                    {service?.categoryId?.name}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="">
                  <h4 className="font-semibold text-base leading-tight capitalize">
                    {service?.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">0.0</span>
                      <span className="text-sm text-muted-foreground">
                        ({0})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between gap-4 py-2 border-t border-secondary-foreground">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{service?.totalBookings}</div>
                    <div className="text-xs text-muted-foreground">
                      Bookings
                    </div>
                  </div>
                  {/* <div className="text-center">
                    <div className="text-sm font-semibold">{0}</div>
                    <div className="text-xs text-muted-foreground">Earned</div>
                  </div> */}
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">
                      ₹{service?.price}
                    </div>
                    <div className="text-xs text-muted-foreground">Price</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/edit-service/${service._id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeleteView(true)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Dialog open={deleteView} onOpenChange={() => setDeleteView(false)}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <div className="flex items-center gap-2 text-red-600 justify-center">
                          <AlertTriangle className="h-5 w-5" />
                          <DialogTitle>Delete Service</DialogTitle>
                        </div>
                        <DialogDescription className="mt-2">
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="sm:justify-end">
                        <Button variant="destructive" onClick={() => {
                          dispatch(deletedService(service._id))
                          setDeleteView(false)
                        }}>
                          Yes, Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        {/* <div className="space-y-3">
          <Button variant="outline" className="w-full h-12 mb-2">
            Boost Your Services
          </Button>
          <Link to="/create-service">
            <Button className="w-full h-12">
              <Plus className="h-4 w-4 mr-2" />
              Create New Service
            </Button>
          </Link>
        </div> */}
      </div>


      <MobileBottomNav />
    </div>
  );
};

export default MobileMyServices;
