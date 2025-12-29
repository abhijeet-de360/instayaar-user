import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Star, Plus, Upload, ArrowLeft, X } from "lucide-react";
import { serviceCategories } from "@/data/staticData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/store/categorySlice";
import { useNavigate } from "react-router-dom";
import { ceateService } from "@/store/ServiceSlice";
import ScheduleManagement from "@/components/service/ScheduleManagement";
import { DropzoneMulti } from "@/components/dropzone/DropZoneMulti";
import imageCompression from "browser-image-compression";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";


const predefinedSlots = [
  { _id: crypto.randomUUID(), dayOfWeek: 0, startTime: "10:00", endTime: "18:00" },
  { _id: crypto.randomUUID(), dayOfWeek: 0, startTime: "18:01", endTime: "23:59" },
  { _id: crypto.randomUUID(), dayOfWeek: 1, startTime: "10:00", endTime: "18:00" },
  { _id: crypto.randomUUID(), dayOfWeek: 1, startTime: "18:01", endTime: "23:59" },
  { _id: crypto.randomUUID(), dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
  { _id: crypto.randomUUID(), dayOfWeek: 2, startTime: "18:01", endTime: "23:59" },
  { _id: crypto.randomUUID(), dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
  { _id: crypto.randomUUID(), dayOfWeek: 3, startTime: "18:01", endTime: "23:59" },
  { _id: crypto.randomUUID(), dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
  { _id: crypto.randomUUID(), dayOfWeek: 4, startTime: "18:01", endTime: "23:59" },
  { _id: crypto.randomUUID(), dayOfWeek: 5, startTime: "10:00", endTime: "18:00" },
  { _id: crypto.randomUUID(), dayOfWeek: 5, startTime: "18:01", endTime: "23:59" },
  { _id: crypto.randomUUID(), dayOfWeek: 6, startTime: "10:00", endTime: "18:00" },
  { _id: crypto.randomUUID(), dayOfWeek: 6, startTime: "18:01", endTime: "23:59" },
];


const CreateService = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const categoryVar = useSelector((state: RootState) => state?.category)
  const serviceVar = useSelector((state: RootState) => state?.service)
  const [formData, setFormData] = useState({
    title: '',
    description: "",
    price: "",
    categoryId: "",
    skills: [],
    location: "",
    experience: "",
    equipments: "",
    requirements: "",
    images: [],
    schedules: [],
    lat: null,
    lng: null
  })
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);


  const compressImages = async (files) => {
    const options = {
      maxSizeMB: 0.8,           // target ≤ 1MB
      maxWidthOrHeight: 768, // resize if larger than 1200px
      useWebWorker: true,
    };

    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const compressedBlob = await imageCompression(file, options);
        return new File([compressedBlob], file.name, { type: file.type });
      })
    );

    return compressedFiles;
  };

  const handleSetImages = async (files) => {
    const compressedFiles = await compressImages(files);
    setFormData((prev) => ({
      ...prev,
      images: compressedFiles,
    }));
  };





  const isFormIncomplete =
    !formData.title.trim() ||
    !formData.description.trim() ||
    !formData.price.trim() ||
    !formData.categoryId.trim() ||
    formData.skills.length === 0 ||
    formData.schedules.length === 0 ||
    !formData.location.trim() ||
    !formData.experience.trim() ||
    !formData.equipments.trim() ||
    !formData.requirements.trim()

  const payload = {
    title: formData?.title,
    description: formData?.description,
    price: formData?.price,
    categoryId: formData?.categoryId,
    skills: formData?.skills,
    location: formData?.location,
    experience: formData?.experience,
    equipments: formData?.equipments,
    requirements: formData?.requirements,
    schedules: formData?.schedules,
    lat: formData?.lat,
    lon: formData?.lng

  }

  useEffect(() => {
    dispatch(getCategories())
  }, [])

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  const handleService = () => {
    dispatch(ceateService(payload, formData?.images, navigate));
  }

  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault()
      if (!formData.skills.includes(inputValue.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, inputValue.trim()],
        }))
      }
      setInputValue("")
    }
  }

  const handleAddSkill = () => {
    if (inputValue.trim() !== "") {
      if (!formData.skills.includes(inputValue.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, inputValue.trim()],
        }))
      }
      setInputValue("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleReset = () => {
    formData.title = ''
  };

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
        setFormData({ ...formData, location: description, lat, lng });
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  };

  // Use current device location
  const fetchCurrentLocation = async () => {
    try {
      let latitude, longitude;

      if (Capacitor.getPlatform() === 'web') {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              latitude = pos.coords.latitude;
              longitude = pos.coords.longitude;
              resolve();
            },
            reject
          );
        });
      } else {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'denied') {
          alert('Location permission denied');
          return;
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          setFormData({
            ...formData,
            location: results[0].formatted_address,
            lat: latitude,
            lng: longitude
          });
        }
      });
    } catch (err) {
      console.error(err);
      alert('Unable to retrieve your location');
    }
  };


  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mb-10 p-0">
          <Card className="border-none md:border shadow-none md:shadow">
            {/* <CardHeader className="px-0 md:px-6">
              <CardTitle className="text-2xl">
                <Button size="icon" variant="ghost" className="hidden md:flex items-center justify-center" onClick={() => navigate(-1)}><ArrowLeft /></Button>
                Create New Service</CardTitle>
              <p className="text-muted-foreground">
                Create a service listing to showcase your skills and attract clients
              </p>
            </CardHeader> */}
            <CardContent className="space-y-6 px-0 md:px-6">
              {/* Service Photos */}
              <div className="space-y-4">
                <Label>Service Photos</Label>
                <DropzoneMulti
                  images={formData.images}
                  setImages={handleSetImages}
                />
                <p className="text-xs text-muted-foreground">
                  Add up to 5 photos showcasing your work. First photo will be your main image.
                </p>
              </div>

              {/* Service Details */}
              <div className="space-y-2">
                {/* <Label htmlFor="title">Service Title *</Label> */}
                <Input
                  id="title"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[0-9]/g, '');
                  }}
                  placeholder="e.g, Explore top 5 eatery with me, I have a car"
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}

                />
              </div>

              <div className="space-y-2">
                {/* <Label htmlFor="category">Service Category *</Label> */}
                <Select value={formData.categoryId} onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryVar?.categoryData && categoryVar?.categoryData.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {/* <Label htmlFor="description">Service Description *</Label> */}
                <Textarea
                  id="description"
                  placeholder="Describe your service, experience, specialties, and what makes you unique..."
                  className="min-h-[120px]"
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
                <small className="text-neutral-500">*Please mention your cancellation policy explicitly</small>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-muted-foreground">₹</span>
                    <Input id="price" placeholder="00" onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                    }} className="pl-8" onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Location & Availability */}
              <div className="space-y-1 flex flex-col relative">
                <Label htmlFor="location">Location</Label>
                <Input
                  placeholder="Type your location..."
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
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

              <ScheduleManagement setFormData={setFormData} initialSchedules={predefinedSlots} />


              {/* Skills & Specialties */}
              <div className="space-y-2">
                <Label>Skills & Specialities</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="tab flex items-center gap-2">
                  <Input
                    placeholder="Add a skill or specialities"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button variant="secondary" onClick={handleAddSkill}>Add</Button>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select value={formData?.experience} onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Less than 1 year</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment/Tools Provided</Label>
                <Textarea
                  id="equipment"
                  placeholder="List any equipment, tools, or materials you provide..."
                  className="min-h-[80px]"
                  onChange={(e) => setFormData((prev) => ({ ...prev, equipments: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any special requirement you need from client (Parking, any equipment/tool, etc).."
                  className="min-h-[80px]"
                  onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-4 pt-6">
                {/* <Button variant="outline" className="flex-1" onClick={handleReset}>
                  Reset Service
                </Button> */}
                <Button className="flex-1" onClick={handleService} disabled={isFormIncomplete}>
                  {serviceVar?.status === "loading" ? 'Publishing...' : 'Publish Service'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default CreateService;