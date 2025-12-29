import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/store/categorySlice";
import { localService } from "@/shared/_session/local";
import { createJob } from "@/store/jobSlice";
import { toast } from "sonner";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

const PostJob = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const categoryVar = useSelector((state: RootState) => state.category);
  const jobVar = useSelector((state: RootState) => state.jobs);

  const [formData, setFormData] = useState<any>({
    title: "",
    categoryId: "",
    budget: "",
    address: "",
    description: "",
    prefferedDate: "",
    deadline: "",
    timeFrom: "",
    timeTo: "",
    lat: null,
    lng: null,
  });

  const isFormIncomplete = Object.values(formData).some(
    (value) => value === "" || value === null
  );

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  useEffect(() => {
    if (window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    dispatch(getCategories());
  }, [dispatch]);

  // Job post handler
  const handleJobPost = () => {
    if (localService.get("role") === "user") {
      dispatch(
        createJob(
          {
            title: formData.title,
            categoryId: formData.categoryId,
            budget: formData.budget,
            address: formData.address,
            description: formData.description,
            prefferedDate: formData.prefferedDate,
            deadline: formData.deadline,
            timeFrom: formData.timeFrom,
            timeTo: formData.timeTo,
            lat: formData.lat,
            lng: formData.lng,
          },
          navigate
        )
      );
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const [deadlineKey, setDeadlineKey] = useState(0);

  const handlePreferredDateChange = (e) => {
    const prefferedDate = e.target.value;

    setFormData((prevFormVar) => ({
      ...prevFormVar,
      prefferedDate,
      deadline: "",
    }));
    setDeadlineKey((prev) => prev + 1);
  };

  const handleDeadlineChange = (e) => {
    const deadline = e.target.value;
    if (formData.prefferedDate && deadline >= formData.prefferedDate) {
      toast.error("Deadline must be before the preferred date");
      return;
    }
    setFormData((prev) => ({ ...prev, deadline }));
  };

  const maxDeadline = formData.prefferedDate
    ? new Date(
        new Date(formData.prefferedDate).setDate(
          new Date(formData.prefferedDate).getDate() - 1
        )
      )
        .toISOString()
        .split("T")[0]
    : "";

  
  const fetchAddressSuggestions = (input: string) => {
    if (!input.trim() || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      { input, componentRestrictions: { country: "in" } },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
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

  const fetchCurrentLocation = async () => {
    try {
      let latitude, longitude;

      if (Capacitor.getPlatform() === "web") {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            resolve();
          }, reject);
        });
      } else {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === "denied") {
          alert("Location permission denied");
          return;
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000,
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            setFormData({
              ...formData,
              address: results[0].formatted_address,
              lat: latitude,
              lng: longitude,
            });
          }
        }
      );
    } catch (err) {
      console.error(err);
      alert("Unable to retrieve your location");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6 pb-20 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 p-0 h-auto text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Form Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g, Looking for my Tour Yaar"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[0-9]/g,
                    ""
                  );
                }}
              />
            </div>

            {/* Service Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Service Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryVar?.categoryData?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  placeholder="e.g., ₹5,000"
                  type="number"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                  }}
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: e.target.value.replace(/[^0-9.]/g, ""),
                    })
                  }
                />
              </div>

              <div className="space-y-1 flex flex-col relative">
                <Label htmlFor="location">Location</Label>
                <Input
                  placeholder="Type your location..."
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    fetchAddressSuggestions(e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute top-16 z-50 w-full bg-white border rounded-md shadow-md mt-1 max-h-80 overflow-y-auto">
                    {suggestions.map((item) => (
                      <li
                        key={item.place_id}
                        className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                        onClick={() => handleSuggestionSelect(item.description)}
                      >
                        {item.description}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={fetchCurrentLocation}
                  className="self-end text-xs text-primary font-medium"
                >
                  Use Current Location
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Requierment and Hosts’ Head count</Label>
              <Textarea
                id="description"
                placeholder="Describe your requirement and your Group Size..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Input
                  type="date"
                  min={
                    new Date(Date.now() + 86400000).toISOString().split("T")[0]
                  }
                  value={formData.prefferedDate}
                  onChange={handlePreferredDateChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>From</Label>
                  <Input
                    type="time"
                    value={formData.timeFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, timeFrom: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>To</Label>
                  <Input
                    type="time"
                    value={formData.timeTo}
                    onChange={(e) =>
                      setFormData({ ...formData, timeTo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Input
                  key={deadlineKey} // this forces re-render (prevents auto-fill)
                  type="date"
                  min={today}
                  max={maxDeadline}
                  value={formData.deadline}
                  onChange={handleDeadlineChange}
                  disabled={!formData.prefferedDate}
                />
              </div>
            </div>
            {/* Job Preview Card */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Job Preview</h3>
              <div className="border rounded-lg p-6 bg-muted/20 space-y-4">
                <div>
                  <h4 className="font-semibold">Job Title</h4>
                  <p>{formData.title}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Budget</h4>
                  <p>₹{formData.budget}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p>{formData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="hidden lg:block fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button onClick={handleJobPost}>Post Job & Find Freelancers</Button>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          className="w-full"
          onClick={handleJobPost}
          disabled={isFormIncomplete}
        >
          {jobVar?.status === "loading" ? "Posting Job..." : "Post Job"}
        </Button>
      </div>
    </div>
  );
};

export default PostJob;
