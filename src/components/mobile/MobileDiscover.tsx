import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

import { useUserRole } from "@/contexts/UserRoleContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { Users, Clock, MapPin, Heart, StarIcon, Map, MapPinCheckIcon, MapPinIcon, Search, CircleCheckBig } from "lucide-react";
import freelancerData from "@/data/freelancerData.json";
import type { FreelancerData, Freelancer } from "@/types/freelancerTypes";
import { FreelancerCardMobile } from "@/components/shared/FreelancerCardMobile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAllFreelancer } from "@/store/freelancerSlice";
import { getServiceByCategoryId } from "@/store/ServiceSlice";
import { LoginModal } from "../auth/LoginModal";
import { localService } from "@/shared/_session/local";
import { searchService } from "@/store/searchSlice";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

const MobileDiscover = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const freelancerVar = useSelector((state: RootState) => state.freelancer);
  const serviceVar = useSelector((state: RootState) => state.service);
  const authVar = useSelector((state: RootState) => state.auth);
  const [searchParams] = useSearchParams();
  const { userRole, isLoggedIn } = useUserRole();
  const { handleLogin, isMobile } = useAuthCheck();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [isAvailableToday, setIsAvailableToday] = useState(false);
  const [isTopRated, setIsTopRated] = useState(false);
  const [visibleFreelancers, setVisibleFreelancers] = useState(6);
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const categoryVar = useSelector((state: RootState) => state.category);
  const searchVar = useSelector((state: RootState) => state?.search);
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false)

  const [formData, setFormData] = useState<any>({
    address: localService.get('address') || '',
    lat: localService.get('lat') || 0,
    lng: localService.get('lng') || 0,
  });


  useEffect(() => {
    localService.set("lat", formData?.lat);
    localService.set("lng", formData?.lng);
    localService.set("address", formData?.address);
  }, [formData?.lat, formData?.lng])

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    // Wait until Google Maps script is ready
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

  useEffect(() => {
    dispatch(getServiceByCategoryId("", formData?.lat, formData?.lng))
  }, [formData?.lat, formData?.lng])

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
      () => {
        alert("Unable to retrieve your location");
      }
    );
  };

  useEffect(() => {
    dispatch(getAllFreelancer(100, 0, ""));
  }, [dispatch]);

  useEffect(() => {
    dispatch(searchService(searchQuery));
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const service = searchParams.get("service");
    if (service) {
      setSelectedCategories([service]);
    }
  }, [searchParams]);

  const handleMobileProfileClick = () => {
    setShowMobileAuth(true);
  };

  const allFreelancers = (freelancerData as FreelancerData).freelancers;


  const isFreelancer = isLoggedIn && userRole === "freelancer";

  // 👇 Added Effect for outside click detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {!authVar?.isAuthenticated && <Header onLogin={handleLogin} />}

      <div className="px-4 py-4 space-y-6">
        {/* Search Section */}
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
                    : "Search Service..."}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-screen p-0">
                <Command>
                  <CommandInput placeholder="Search services..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No services found.</CommandEmpty>
                    <CommandGroup>

                      {/* ✅ All Button — resets filter */}
                      <CommandItem
                        key="all"
                        value=""
                        onSelect={() => {
                          setValue("");
                          dispatch(getServiceByCategoryId("", formData?.lat, formData?.lng));
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

                      {/* ✅ Existing categories */}
                      {categoryVar?.categoryData?.map((category) => (
                        <CommandItem
                          key={category?._id}
                          value={category?._id}
                          onSelect={(currentValue) => {
                            dispatch(getServiceByCategoryId(category?._id, formData?.lat, formData?.lng));
                            setValue(currentValue === value ? "" : currentValue);
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
                        setFormData({ address: "", lat: 0, lng: 0 })
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

        {/* Freelancer or job content */}
        {(!authVar?.isAuthenticated || localService.get("role") === "user") && (
          <div className="space-y-4">
            {serviceVar?.serviceByCategory?.length > 0 ? (
              serviceVar.serviceByCategory.map((freelancer: Freelancer) => (
                <FreelancerCardMobile
                  key={freelancer._id}
                  freelancer={freelancer}
                  showPrice={true}
                />
              ))
            ) : (
              <Card className="w-full max-w-md mx-auto border-dashed shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <Users className="h-10 w-10 mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No freelancers available</h3>
                  <p className="text-sm mt-1">
                    We couldn&apos;t find any freelancers at the moment. Please check back later or
                    adjust your filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {isFreelancer && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Job Postings</h2>
            <div className="space-y-4">
              {(freelancerData as FreelancerData).recentJobs.slice(0, 6).map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {job.category}
                        </Badge>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-base leading-tight">{job.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.timePosted}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.applicants} applied
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-lg font-bold text-primary">{job.budget}</div>
                      <Button size="sm" className="px-6">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
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

export default MobileDiscover;
