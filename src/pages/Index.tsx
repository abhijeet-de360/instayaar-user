import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { ServiceFreelancers } from "@/components/home/ServiceFreelancers";
import { RecentJobs } from "@/components/home/RecentJobs";
import { LoginModal } from "@/components/auth/LoginModal";
import { CTABanner } from "@/components/home/CTABanner";
import { ParallaxSection } from "@/components/home/ParallaxSection";
import { FeatureHighlight } from "@/components/home/FeatureHighlight";
import { useUserRole } from "@/contexts/UserRoleContext";
import { testimonials } from "@/data/staticData";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Search, Shield, Clock, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getCategories, getHomePageCategoryServices } from "@/store/categorySlice";
import Slider from "@/components/home/Slider";

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoryVar = useSelector((state: RootState) => state.category);
  const authVar = useSelector((state: RootState) => state.auth);
  const { setUserRole, setIsLoggedIn, isLoggedIn, userRole } = useUserRole();
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
    setShowMobileAuth(false);
  };


  const handleMobileProfileClick = () => {
    setShowMobileAuth(true);
  };
  useEffect(() => {
    dispatch(getCategories())
    dispatch(getHomePageCategoryServices())
  }, [dispatch])

  return (
    <div className="min-h-screen mb-20">
      <Header onLogin={handleLogin} />

      {/* Hero Section */}
      {/* <HeroSection isLoggedIn={authVar?.isAuthenticated} onLogin={handleLogin} /> */}

      {/* Slider */}
      <Slider />

      {/* Service Categories */}
      <ServiceCategories />

      {/* Service 1 */}
      {/* {categoryVar.homeCategoryData[0] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[0]} />
      } */}

      {/* <CTABanner
        title="Earn Extra Income - Join 1000+ Freelancers"
        subtitle="Start earning today by offering your skills to customers in your area"
        buttonText="Become a Freelancer"
        variant="accent"
      /> */}
      {/* {categoryVar.homeCategoryData[2] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[2]} />
      } */}

      {/* <CTABanner
        title="Planning an Event?"
        subtitle="Find the perfect professionals for your special occasion. From chefs to entertainers, we've got you covered."
        buttonText="Browse Event Services"
        variant="primary"
      /> */}
      {/* {categoryVar.homeCategoryData[3] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[3]} />
      } */}
      {/* <CTABanner
        title="First Booking 20% Off!"
        subtitle="New customers get instant discount on their first service booking"
        buttonText="Claim Your Discount"
        variant="primary"
      /> */}
      {/* {categoryVar.homeCategoryData[4] &&

        <ServiceFreelancers props={categoryVar.homeCategoryData[4]} />
      } */}
      {/* <CTABanner
        title="Book Services On-the-Go"
        subtitle="Download our mobile app for instant booking and real-time updates"
        buttonText="Get the App"
        variant="secondary"
      /> */}

      {/* {categoryVar.homeCategoryData[5] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[5]} />
      } */}
      {/* <CTABanner
        title="Need Help Right Now?"
        subtitle="24/7 emergency services available - Plumbers, electricians, and more"
        buttonText="Find Emergency Help"
        variant="accent"
      /> */}
      {/* {categoryVar.homeCategoryData[6] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[6]} />
      } */}
      {/* <CTABanner
        title="Invite Friends, Earn Rewards"
        subtitle="Get ₹500 credit for every friend who books their first service"
        buttonText="Start Referring"
        variant="primary"
      /> */}
      {/* {categoryVar.homeCategoryData[7] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[7]} />
      } */}

      {/* <CTABanner
        title="Professional Services at Your Fingertips"
        subtitle="Quality guaranteed professionals ready to help with your specialized needs"
        buttonText="View All Services"
        variant="secondary"
      /> */}

      {/* {categoryVar.homeCategoryData[8] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[8]} />
      } */}
      {/* <CTABanner
        title="100% Satisfaction Guaranteed"
        subtitle="Not happy with the service? We'll make it right or refund your money"
        buttonText="Learn More"
        variant="secondary"
      /> */}
      {/* {categoryVar.homeCategoryData[8] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[8]} />
      }
      {categoryVar.homeCategoryData[9] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[9]} />
      }
      {categoryVar.homeCategoryData[10] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[10]} />
      }
      {categoryVar.homeCategoryData[11] &&
        <ServiceFreelancers props={categoryVar.homeCategoryData[11]} />
      } */}


      {/* Recent Jobs */}
      <RecentJobs />

      {/* Testimonials */}
      {/* <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from both service seekers and providers about their experience on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <MobileBottomNav onProfileClick={handleMobileProfileClick} />

      <LoginModal
        isOpen={showMobileAuth}
        onClose={() => setShowMobileAuth(false)}
        onLoginSuccess={handleLogin}
        isMobile={true}
      />
    </div>
  );
};

export default Index;