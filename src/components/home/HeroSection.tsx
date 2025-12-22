
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginModal } from "@/components/auth/LoginModal";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroCleaning from "@/assets/hero-cleaning.jpg";
import heroElectrician from "@/assets/hero-electrician.jpg";
import heroPlumber from "@/assets/hero-plumber.jpg";
import heroAcRepair from "@/assets/hero-ac-repair.jpg";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface HeroSectionProps {
  isLoggedIn: boolean;
  userRole?: string;
  onLogin: (role: string) => void;
}

export const HeroSection = ({ isLoggedIn, userRole, onLogin }: HeroSectionProps) => {
  const categoryVar = useSelector((state: RootState) => state.category)


  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    navigate(`/discover?service=${encodeURIComponent(serviceId  )}`);
  };

  const handlePostJob = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      // Navigate to post creation
    }
  };

  const handleExploreFreelancers = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      // Navigate to freelancer listing
    }
  };




  return (
    <>
      <section className="relative bg-white py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6 md:space-y-8">

              {/* Search Section - Hidden on mobile, shown on desktop */}
              <div className="hidden md:block space-y-4">
                <h2 className="text-lg font-medium text-foreground">
                  What are you looking for?
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search for services..."
                    className="pl-10 h-12 text-base border-gray-300 focus:border-primary"
                  />
                </div>
              </div>

              {/* Service Categories Grid - Mobile: 2x3 (6 services), Desktop: 3x3 (9 services) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {/* Mobile: Show only first 6 services */}
                {categoryVar.categoryData.slice(0, 6).map((category, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-2 md:p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors md:hidden"
                    onClick={() => handleServiceClick(category._id)}
                  >
                    <div className="w-[100px] h-[100px] mb-2 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-center text-foreground font-medium leading-tight">
                      {category.name}
                    </span>
                  </div>
                ))}

                {/* Desktop: Show all 9 services */}
                {categoryVar.categoryData.slice(0, 6).map((category, index) => (
                  <div
                    key={`desktop-${index}`}
                    className="hidden md:flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleServiceClick(category?._id)}
                  >
                    <div className="w-40 h-40 mb-2 rounded-lg overflow-hidden shadow-sm border">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-center text-foreground font-medium leading-tight">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Search Section for Mobile - Moved below service categories */}
              <div className="md:hidden space-y-3">
                <h2 className="text-base font-medium text-foreground">
                  What are you looking for?
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search for services..."
                    className="pl-10 h-10 text-sm border-gray-300 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Images Grid - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-2 gap-4">

              {/* Desktop: Show all 4 images in 2x2 grid */}
              <div className="hidden md:block space-y-4">
                <img
                  src={heroCleaning}
                  alt="Professional cleaning service"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <img
                  src={heroPlumber}
                  alt="Professional plumber service"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="hidden md:block space-y-4 mt-8">
                <img
                  src={heroElectrician}
                  alt="Professional electrician service"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <img
                  src={heroAcRepair}
                  alt="Professional AC repair service"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={onLogin}
        isMobile={true}
      />
    </>
  );
};
