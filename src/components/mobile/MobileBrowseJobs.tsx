import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { LoginModal } from "@/components/auth/LoginModal";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Filter, Search, Heart, SlidersHorizontal, Briefcase, Check, MapPinIcon } from "lucide-react";
import { serviceFreelancers, serviceCategories, recentJobs } from "@/data/staticData";
import { JobCard } from "@/components/shared/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getallFreelancerJobs, getallJobs } from "@/store/jobSlice";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { getServiceByCategoryId } from "@/store/ServiceSlice";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { localService } from "@/shared/_session/local";

const MobileBrowseJobs = () => {
  const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const [visibleJobsCount, setVisibleJobsCount] = useState(6);
  const dispatch = useDispatch<AppDispatch>();
  const jobVar = useSelector((state: RootState) => state?.jobs)
  const authVar = useSelector((state: RootState) => state?.auth)
  const categoryVar = useSelector((state: RootState) => state?.category)
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("");

  const [formData, setFormData] = useState<any>({
    categoryId: '',
    limit: 100,
    offset: 0,
    address: localService.get('address') || '',
    lat: localService.get('lat') || 0,
    lng: localService.get('lng') || 0
  });


  useEffect(() => {
    localService.set("lat", formData?.lat);
    localService.set("lng", formData?.lng);
    localService.set("address", formData?.address);
  }, [formData?.lat, formData?.lng])

  useEffect(() => {
    dispatch(getallFreelancerJobs(formData?.limit, formData.offset, formData?.categoryId, formData?.lat, formData?.lng))
  }, [formData?.lat, formData?.lng])

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
      } else {
        setTimeout(initAutocomplete, 500);
      }
    };
    initAutocomplete();
  }, []);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  const fetchAddressSuggestions = (input: string) => {
    if (!input.trim() || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      { input, componentRestrictions: { country: "in" } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  // When a suggestion is selected, get lat/lng using Geocoder
  const handleSuggestionSelect = (description: string) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: description }, (results, status) => {
      if (status === "OK" && results && results[0].geometry.location) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setFormData({ ...formData, address: description, lat, lng });
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  };

  // Use current device location
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === "OK" && results && results[0].formatted_address) {
            setFormData({ ...formData, address: results[0].formatted_address, lat: latitude, lng: longitude });
          }
        });
      },
      (err) => {
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  const handleMobileProfileClick = () => {
    setShowMobileAuth(true);
  };

  const handleLoadMore = () => {
    setVisibleJobsCount(prev => prev + 6); // Load 6 more jobs each time
  };

  useEffect(() => {
    if (!authVar?.isAuthenticated) {
      dispatch(getallJobs(100, 0))
    } else {
      dispatch(getallFreelancerJobs(formData.limit, formData.offset, '', formData?.lat, formData?.lng))
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hide header when logged in on mobile */}
      {!authVar?.isAuthenticated && <Header onLogin={handleLogin} />}

      {/* Mobile-First Content */}
      <div className="px-4 py-4 space-y-3">
        {/* Search Header */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value
                    ? categoryVar?.categoryData?.find((category) => category._id === value)?.name
                    : "Search Jobs..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-screen p-0">
                <Command>
                  <CommandInput placeholder="Search jobs..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No services found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key="all"
                        value=""
                        onSelect={() => {
                          setValue("");
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: "", // clear categoryId for "All Services"
                          }));
                          dispatch(
                            getallFreelancerJobs(
                              formData.limit,
                              formData.offset,
                              "",
                              formData?.lat,
                              formData?.lng
                            )
                          );
                          setOpen(false);
                        }}
                      >
                        All Services
                        <Check
                          className={cn(
                            "ml-auto",
                            value === "" ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>

                      {categoryVar?.categoryData?.map((category) => (
                        <CommandItem
                          key={category?._id}
                          value={category?._id}
                          onSelect={(currentValue) => {
                            const newCategoryId =
                              currentValue === value ? "" : category?._id;

                            // ✅ update formData.categoryId
                            setFormData((prev) => ({
                              ...prev,
                              categoryId: newCategoryId,
                            }));

                            // ✅ update value state
                            setValue(newCategoryId);

                            // ✅ trigger API call
                            dispatch(
                              getallFreelancerJobs(
                                formData.limit,
                                formData.offset,
                                newCategoryId,
                                formData?.lat,
                                formData?.lng
                              )
                            );

                            setOpen(false);
                          }}
                        >
                          {category?.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === category?._id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

          </div>
          <Dialog open={visible} onOpenChange={setVisible}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline">
                <MapPinIcon />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md top-16">
              <DialogHeader>
                {/* <DialogTitle>Select Location</DialogTitle> */}
              </DialogHeader>
              <div className="flex items-start gap-2">
                <div className="space-y-1 flex flex-col relative w-full">
                  <Input
                    placeholder="Type your location..."
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      fetchAddressSuggestions(e.target.value);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute top-16 z-50 w-full bg-white border rounded-md shadow-md mt-1 max-h-80 overflow-y-auto">
                      {suggestions.map((item) => (
                        <li
                          key={item.place_id}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => {
                            handleSuggestionSelect(item.description);
                            setVisible(false)
                          }}
                        >
                          {item.description}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex w-full justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        fetchCurrentLocation();
                        setVisible(false);
                      }}
                      className="self-end text-xs text-primary font-medium"
                    >
                      Use Current Location
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          address: "",
                          lat: 0,
                          lng: 0,
                        }))
                        setVisible(false);
                      }}
                      className="self-end text-xs text-primary font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Job Cards */}
        <div className="space-y-4 ">
          {jobVar?.allJobs && jobVar.allJobs.length > 0 ? (
            jobVar.allJobs.map((job: any) => (
              <div key={job._id} className="space-y-3">
                <JobCard job={job} showShortlistButton />
              </div>
            ))
          ) : (
            // <p className="text-center">No Job Post</p>
            <Card className="max-w-md mx-auto shadow border border-border rounded-lg">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">No Job Post</h2>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  List your services to start getting direct bookings.
                </p>
              </CardContent>
            </Card>
          )}
        </div>


        {/* Load More */}
        {/* {visibleJobsCount < recentJobs.length && (
          <Button 
            variant="outline" 
            className="w-full h-12"
            onClick={handleLoadMore}
          >
            Load More Jobs ({recentJobs.length - visibleJobsCount} remaining)
          </Button>
        )} */}

        {/* End of jobs message */}
        {visibleJobsCount >= recentJobs.length && (
          <div className="text-center py-6 text-muted-foreground">
            <p>You've reached the end of available jobs</p>
            <p className="text-sm mt-1">Check back later for new opportunities!</p>
          </div>
        )}
      </div>

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

export default MobileBrowseJobs;