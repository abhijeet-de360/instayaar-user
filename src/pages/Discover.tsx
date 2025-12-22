import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CentralizedLoginModal } from "@/components/auth/CentralizedLoginModal";

import { useUserRole } from "@/contexts/UserRoleContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MapPin, Filter, Search, Heart, Users, Clock, SlidersHorizontal } from "lucide-react";

import freelancerData from "@/data/freelancerData.json";
import type { FreelancerData, Freelancer } from "@/types/freelancerTypes";
import MobileDiscover from "@/components/mobile/MobileDiscover";
import { FreelancerCard } from "@/components/shared/FreelancerCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { getAllFreelancer } from "@/store/freelancerSlice";
import { AppDispatch, RootState } from "@/store/store";
import { getServiceByCategoryId } from "@/store/ServiceSlice";
import { localService } from "@/shared/_session/local";
import { LoginModal } from "@/components/auth/LoginModal";

const Discover = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const freelancerVar = useSelector((state: RootState) => state.freelancer);
  const serviceVar = useSelector((state: RootState) => state.service);
  const authVar = useSelector((state: RootState) => state.auth);
  const [showMobileAuth, setShowMobileAuth] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { userRole, isLoggedIn } = useUserRole();
  const { isMobile, } = useAuthCheck();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [isAvailableToday, setIsAvailableToday] = useState(false);
  const [isTopRated, setIsTopRated] = useState(false);
  const [visibleFreelancers, setVisibleFreelancers] = useState(8);


  useEffect(() => {
    dispatch(getAllFreelancer(100, 0, ''));
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getServiceByCategoryId(searchParams.get('service') || ''));
  // }, [searchParams]);

  const handleLogin = (role: string) => {

  };


  const debounceQuery = useDebounce(searchQuery, 500)
  useEffect(() => {
    if (debounceQuery) {
    }
  }, [debounceQuery])


  // Handle URL search parameters for service filtering
  useEffect(() => {
    const service = searchParams.get('service');
    if (service) {
      setSelectedCategories([service]);
    }
  }, [searchParams]);

  const handleMobileProfileClick = () => {
    setShowMobileAuth(true);
  };

  // Get all freelancers from freelancerData.json
  const allFreelancers = (freelancerData as FreelancerData).freelancers;

  // Filter freelancers based on search and filters
  const filteredFreelancers = allFreelancers.filter((freelancer: Freelancer) => {
    // const matchesSearch = searchQuery === "" || 
    //   freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   freelancer.primaryService.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(freelancer.primaryService);

    const matchesLocation = selectedLocation === "" || selectedLocation === "all" ||
      freelancer.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesVerified = !isVerifiedOnly;
    const matchesAvailable = !isAvailableToday;
    const matchesTopRated = !isTopRated || freelancer.rating >= 4.5;

    return matchesCategory && matchesLocation && matchesVerified && matchesAvailable && matchesTopRated;
  });

  // Use mobile component on small screens
  if (isMobile) {
    return <MobileDiscover />;
  }


  // Show different content based on user role
  const isEmployer = isLoggedIn && userRole === 'employer';
  const isFreelancer = isLoggedIn && userRole === 'freelancer';

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Discover Local Talent</h1>
          <p className="text-muted-foreground mb-8">Find the perfect freelancer for your next project</p>


          {/* Search & Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for services or freelancers..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="h-12 w-12 shrink-0">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    {/* Service Categories */}
                    <div>
                      <h3 className="font-medium mb-3">Service Category</h3>
                      <div className="space-y-2">
                        {(freelancerData as FreelancerData).serviceCategories.slice(0, 8).map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.name}
                              checked={selectedCategories.includes(category.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories([...selectedCategories, category.name]);
                                } else {
                                  setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                                }
                              }}
                            />
                            <label htmlFor={category.name} className="text-sm">
                              {category.icon} {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className="font-medium mb-3">Location</h3>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="chennai">Chennai</SelectItem>
                          <SelectItem value="pune">Pune</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quick Filters */}
                    <div>
                      <h3 className="font-medium mb-3">Quick Filters</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="verified"
                            checked={isVerifiedOnly}
                            onCheckedChange={(checked) => setIsVerifiedOnly(checked === true)}
                          />
                          <label htmlFor="verified" className="text-sm">Verified Only</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="available"
                            checked={isAvailableToday}
                            onCheckedChange={(checked) => setIsAvailableToday(checked === true)}
                          />
                          <label htmlFor="available" className="text-sm">Available Today</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="toprated"
                            checked={isTopRated}
                            onCheckedChange={(checked) => setIsTopRated(checked === true)}
                          />
                          <label htmlFor="toprated" className="text-sm">Top Rated</label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategories([]);
                          setSelectedLocation("all");
                          setIsVerifiedOnly(false);
                          setIsAvailableToday(false);
                          setIsTopRated(false);
                          setVisibleFreelancers(8);
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Filter Badges */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Badge
                variant={isVerifiedOnly ? "default" : "outline"}
                className="whitespace-nowrap px-4 py-2 cursor-pointer"
                onClick={() => setIsVerifiedOnly(!isVerifiedOnly)}
              >
                Verified Only
              </Badge>
              <Badge
                variant={isAvailableToday ? "default" : "outline"}
                className="whitespace-nowrap px-4 py-2 cursor-pointer"
                onClick={() => setIsAvailableToday(!isAvailableToday)}
              >
                Available Today
              </Badge>
              <Badge
                variant={isTopRated ? "default" : "outline"}
                className="whitespace-nowrap px-4 py-2 cursor-pointer"
                onClick={() => setIsTopRated(!isTopRated)}
              >
                Top Rated
              </Badge>
            </div>
          </div>

          {/* For Employers or Guests - Show Freelancers */}
          {(!authVar?.isAuthenticated || localService.get('role') === 'user') && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Top Rated Freelancers</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {serviceVar?.serviceByCategory.map((freelancer: Freelancer) => (
                  <FreelancerCard
                    key={freelancer._id}
                    freelancer={freelancer}
                    variant="default"
                    showPrice={true}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {visibleFreelancers < filteredFreelancers.length && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleFreelancers(prev => prev + 8)}
                    className="px-8"
                  >
                    Load More Freelancers
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* For Freelancers - Show Jobs */}
          {isFreelancer && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Recent Job Postings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(freelancerData as FreelancerData).recentJobs.slice(0, 6).map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{job.category}</Badge>
                            <span className="text-sm text-muted-foreground">{job.timePosted}</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                          <p className="text-muted-foreground text-sm">{job.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{job.budget}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applicants} applicants
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.timePosted}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => {
                          // TODO: Handle job application
                        }}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <MobileBottomNav onProfileClick={handleMobileProfileClick} />
      <LoginModal
        isOpen={showMobileAuth}
        onClose={() => setShowMobileAuth(false)}
        onLoginSuccess={handleLogin}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Discover;
