import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { LoginModal } from "@/components/auth/LoginModal";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Users, Clock, Search, Filter, SlidersHorizontal } from "lucide-react";
import { recentJobs, serviceCategories } from "@/data/staticData";
import { JobCard } from "@/components/shared/JobCard";
import MobileBrowseJobs from "@/components/mobile/MobileBrowseJobs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getallJobs } from "@/store/jobSlice";
import { getCategories } from "@/store/categorySlice";

const BrowseJobs = () => {
  const { setUserRole, setIsLoggedIn, isLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const jobVar = useSelector((state: RootState) => state?.jobs);
  const categoryVar = useSelector((state: RootState) => state?.category)

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

  const handleMobileProfileClick = () => {
    setShowMobileAuth(true);
  };

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
  if (isMobile) {
    return <MobileBrowseJobs />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Browse Available Jobs</h1>

          {/* Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
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
                    {/* Job Categories */}
                    <div>
                      <h3 className="font-medium mb-3">Job Category</h3>
                      <div className="space-y-2">
                        {categoryVar?.categoryData?.map((category) => (
                          <div key={category._id} className="flex items-center space-x-2">
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
                              {category.name}
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

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategories([]);
                          setSelectedLocation("all");
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {jobVar?.allJobs && jobVar.allJobs.length > 0 ? (
              jobVar.allJobs.map((job: any) => (
                <div key={job._id} className="space-y-3">
                  <JobCard job={job} showShortlistButton />
                </div>
              ))
            ) : (
              <p className="text-center">No Job Post</p>
            )}
          </div>

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

export default BrowseJobs;