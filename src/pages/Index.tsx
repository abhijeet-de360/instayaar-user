import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { RecentJobs } from "@/components/home/RecentJobs";
import { LoginModal } from "@/components/auth/LoginModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import Slider from "@/components/home/Slider";

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showMobileAuth, setShowMobileAuth] = useState(false);


  const handleMobileProfileClick = () => {
    setShowMobileAuth(true);
  };
  useEffect(() => {
    // dispatch(getCategories())
    // dispatch(getHomePageCategoryServices())
  }, [dispatch])

  return (
    <div className="min-h-screen mb-20">
      <Header onLogin={null} />

      <Slider />
      <ServiceCategories />
      <RecentJobs />
      <MobileBottomNav onProfileClick={handleMobileProfileClick} />

      <LoginModal
        isOpen={showMobileAuth}
        onClose={() => setShowMobileAuth(false)}
        onLoginSuccess={null}
        isMobile={true}
      />
    </div>
  );
};

export default Index;