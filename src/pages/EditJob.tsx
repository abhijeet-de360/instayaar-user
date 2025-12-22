import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, useParams } from "react-router-dom";
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
import { serviceCategories } from "@/data/staticData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/store/categorySlice";
import { localService } from "@/shared/_session/local";
import { createJob, getJobById, updateJob } from "@/store/jobSlice";
import { parseISO, format } from "date-fns";
import { toast } from "sonner";

const EditJob = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const categoryVar = useSelector((state: RootState) => state.category);
  const jobVar: any = useSelector((state: RootState) => state?.jobs);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
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

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getJobById(id));
  }, [id]);

  useEffect(() => {
    if (jobVar?.JobDetails) {
      setFormData({
        title: jobVar.JobDetails.title || "",
        categoryId: jobVar.JobDetails.categoryId || "",
        budget: jobVar.JobDetails.budget || "",
        address: jobVar.JobDetails.address || "",
        description: jobVar.JobDetails.description || "",
        prefferedDate: jobVar.JobDetails.prefferedDate
          ? format(parseISO(jobVar.JobDetails.prefferedDate), "yyyy-MM-dd")
          : "",
        deadline: jobVar.JobDetails.deadline
          ? format(parseISO(jobVar.JobDetails.deadline), "yyyy-MM-dd")
          : "",
        timeFrom: jobVar?.JobDetails?.timeFrom || "",
        timeTo: jobVar?.JobDetails?.timeTo || "",
        lat: jobVar?.JobDetails?.lat || null,
        lng: jobVar?.JobDetails?.lng || null,
      });
    }
  }, [jobVar?.JobDetails]);

  const handleUpdateJob = () => {
    if (localService.get("role") === "user") {
      dispatch(
        updateJob(
          id,
          {
            title: formData.title,
            categoryId: formData.categoryId,
            budget: formData.budget,
            address: formData.address,
            description: formData.description,
            prefferedDate: formData.prefferedDate,
            deadline: formData.deadline,
            timeFrom: formData?.timeFrom,
            timeTo: formData?.timeTo,
            lat: formData?.lat,
            lng: formData?.lng,
          },
          navigate
        )
      );
    }
  };

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
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === "OK" && results && results[0].formatted_address) {
              setFormData({
                ...formData,
                address: results[0].formatted_address,
                lat: latitude,
                lng: longitude,
              });
            }
          }
        );
      },
      (err) => {
        alert("Unable to retrieve your location");
      }
    );
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6 pb-36 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 p-0 h-auto text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Form Layout - Two columns on desktop */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Job Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Need a Chef for Birthday Party"
                className="h-12"
                value={formData.title}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[0-9]/g,
                    ""
                  );
                }}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Service Category
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a service category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryVar?.categoryData?.map((category) => (
                    <SelectItem key={category._id} value={category?._id}>
                      {category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-base font-medium">
                  Budget
                </Label>
                <Input
                  id="budget"
                  placeholder="e.g., ₹5,000"
                  className="h-12"
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(" ", ""))
                  }
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                />
              </div>
              {/* <div className="space-y-2">
                                <Label htmlFor="location" className="text-base font-medium">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Mumbai, Maharashtra"
                                    className="h-12"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div> */}
              <div className="space-y-1 flex flex-col">
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
                  <ul className="absolute z-50 w-full bg-white border rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
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

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Job Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what you need, when you need it, and any specific requirements..."
                className="min-h-[150px] resize-none"
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
                  min={today}
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
                      setFormData({
                        ...formData,
                        timeFrom: e.target.value,
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label>To</Label>
                  <Input
                    type="time"
                    value={formData.timeTo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeTo: e.target.value,
                      })
                    }
                    className="text-sm"
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
          </div>
        </div>
      </div>

      {/* Desktop Fixed Action Button */}
      <div className="hidden lg:block fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
          size="lg"
          onClick={handleUpdateJob}
        >
          Update Job & Find Freelancers
        </Button>
      </div>

      {/* Mobile Sticky Bottom Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pt-2 bg-background border-t ">
        <small className="-mb-1">
          *Your Post will be Published after Admin Approval.
        </small>
        <Button
          className="w-full h-14 text-base font-semibold"
          size="lg"
          onClick={handleUpdateJob}
          disabled={isFormIncomplete}
        >
          {jobVar?.status === "loading"
            ? "Updating..."
            : "Update & Send for Review"}
        </Button>
      </div>
    </div>
  );
};

export default EditJob;
