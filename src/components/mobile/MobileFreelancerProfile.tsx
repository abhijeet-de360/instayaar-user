import { useParams, useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { LoginModal } from "@/components/auth/LoginModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  MessageCircle,
  UserCheck,
  ArrowLeft,
  CheckCircle,
  Award,
  Clock,
  Calendar,
  StarIcon,
  Image,
} from "lucide-react";
import { useEffect, useState } from "react";
import { freelancerById } from "@/store/freelancerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getConversationId } from "@/store/chatSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


const MobileFreelancerProfile = () => {
  const { freelancerId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const freelancerVar: any = useSelector(
    (state: RootState) => state.freelancer
  );
  const authVar = useSelector((state: RootState) => state.auth);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

  useEffect(() => {
    dispatch(freelancerById(freelancerId));
  }, [freelancerId]);

  // Mock freelancer data
  const freelancer = {
    id: freelancerId,
    name: "Arjun Mehta",
    service: "Professional DJ",
    location: "Chennai, Tamil Nadu",
    rating: 4.8,
    reviews: 156,
    experience: "5+ years",
    completedJobs: 89,
    responseTime: "2 hours",
    priceRange: "₹8,000 - ₹15,000",
    isVerified: true,
    isOnline: true,
    joinedDate: "January 2020",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&h=400&q=80",
    bio: "Professional DJ with over 5 years of experience in wedding receptions, corporate events, and private parties.",
    skills: [
      "Wedding DJ",
      "Corporate Events",
      "Bollywood Music",
      "International Music",
      "Sound Systems",
      "Lighting",
    ],
    equipment: [
      "Pioneer CDJ-2000 Nexus",
      "DJM-900 Nexus Mixer",
      "Professional Sound System",
      "LED Lighting Setup",
      "Wireless Microphones",
    ],
  };

  const handleChat = (id) => {
    if (authVar?.isAuthenticated) {
      if (!authVar?.user?.firstName) {
        navigate(`/user-account-settings`);
      } else {
        dispatch(getConversationId(id, navigate));
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleHire = (id) => {
    if (authVar?.isAuthenticated) {
      navigate(`/freelancer-services/${id}`);
    } else {
      setShowLoginModal(true);
    }

    if (authVar?.isAuthenticated) {
      if (authVar?.user?.status === 'pending') {
        navigate(`/user-account-settings`);
      }
    }
  };

  const handleBookService = (id) => {
    navigate(`/multi-service-booking/${id}`)
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Mobile header and bottom nav hidden on freelancer profile */}

        <div className="relative">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">
                {freelancerVar?.freelancerDetails?.firstName}{" "}
                {freelancerVar?.freelancerDetails?.lastName}
              </h1>
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-4">
            {/* Cover & Profile Section */}
            <div className="relative">
              {/* Profile Info */}
              <div className="px-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage
                      src={freelancerVar?.freelancerDetails?.profile}
                      alt={freelancerVar?.freelancerDetails?.firstName}
                      className="object-cover object-top"
                    />
                    <AvatarFallback className="text-xl">
                      {freelancerVar?.freelancerDetails?.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 pb-2">
                    <div className="bg-background/90 rounded-lg p-2 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold">
                          {freelancerVar?.freelancerDetails?.skills[0]}
                        </h2>
                        {freelancer.isVerified && (
                          <CheckCircle className=" w-3 -mt-1 text-green-500" />
                        )}
                        <div />
                      </div>
                      {/* <p className="text-sm text-muted-foreground">{freelancer.service}</p> */}
                      <div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {freelancerVar?.freelancerDetails?.city},{" "}
                          {freelancerVar?.freelancerDetails?.state}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {freelancerVar?.freelancerDetails?.averageRating}
                          </span>
                          <span>
                            ({freelancerVar?.freelancerDetails?.totalReview})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <p>{freelancerVar?.freelancerDetails?.bio}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6 ">
                  <Button
                    className="flex-1"
                    onClick={() =>
                      handleHire(freelancerVar?.freelancerDetails?._id)
                    }
                  >
                    {/* <Button className="flex-1" onClick={() => navigate(`/freelancer-services/${freelancerVar?.freelancerDetails?._id}`)}> */}
                    Hire Now
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      handleChat(freelancerVar?.freelancerDetails?._id)
                    }
                  >
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      navigate(
                        `/freelancer-reviews/${freelancerVar?.freelancerDetails?._id}`
                      )
                    }
                  >
                    Review
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4">
              <Tabs defaultValue="services" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="services" className="text-xs">
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="text-xs">
                    Portfolio
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-4">
                  {freelancerVar?.freelancerDetails?.service.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        {/* <img
                          src={service?.images[0]}
                          alt={service?.title}
                          className="w-full h-full object-cover"
                        /> */}
                        <Swiper
                          spaceBetween={10}
                          centeredSlides={true}
                          speed={1200}
                          loop={true}
                          autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                          }}
                          pagination={{
                            clickable: true,
                          }}
                          navigation={false}
                          modules={[Autoplay, Pagination, Navigation]}
                          className="mySwiper h-full"
                        >
                          {
                            service?.images.map((image) => (
                              <SwiperSlide className="h-full">
                                <img
                                  src={image}
                                  alt={service?.title}
                                  className="w-full h-full object-cover"
                                />
                              </SwiperSlide>
                            ))
                          }
                        </Swiper>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 capitalize">
                          {service?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {service?.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-between w-full ">
                            <Button onClick={() => handleBookService(service._id)}>Book Now</Button>
                            <div className="text-lg font-bold text-primary">
                              ₹{service?.price}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.avatar} alt={review.clientName} />
                          <AvatarFallback className="text-xs">{review.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{review.clientName}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">{review.event}</Badge>
                                <span>{review.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent> */}

                <TabsContent value="portfolio" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {freelancerVar?.freelancerDetails?.portfolio?.length > 0 ? (
                      freelancerVar?.freelancerDetails?.portfolio.map(
                        (item, index) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="aspect-square relative">
                              <img
                                src={item?.image || ""}
                                alt={`Portfolio image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Card>
                        )
                      )
                    ) : (
                      <Card className="col-span-2 flex items-center flex-col gap-2 justify-center h-40">
                        <Image className="w-8 h-8 font-thin" />
                        <p className="text-muted-foreground text-sm font-medium">
                          No portfolio image found
                        </p>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={setShowLoginModal}
          onLoginSuccess={handleLogin}
          isMobile={true}
        />
      </div>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {}}
        isMobile={true}
      />
    </>
  );
};

export default MobileFreelancerProfile;
