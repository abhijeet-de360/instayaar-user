import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  MapPin,
  Clock,
  Star,
  Shield,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useUserRole } from "@/contexts/UserRoleContext";
import { cn } from "@/lib/utils";
import type { FreelancerService } from "@/types/freelancerTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getServiceById } from "@/store/ServiceSlice";
import { toast } from "sonner";
import { createBooking } from "@/store/bookingSlice";
import { openRazorpay } from "@/components/Razorpay/Razorpay";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MultiServiceBooking: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // Single page booking flow state (matching BookService.tsx)
  const bookingVar = useSelector((state: RootState) => state.booking);
  const authVar = useSelector((state: RootState) => state.auth);
  const [selectedServices, setSelectedServices] = useState<FreelancerService[]>(
    []
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [paymentType, setPaymentType] = useState<"advance" | "full">("advance");
  const serviceVar = useSelector((state: RootState) => state.service);

  const [formData, setFormData] = useState<any>({
    address: "",
    lat: null,
    lng: null,
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);

  function mergeDateAndTime(date: Date | undefined, time: string): Date | null {
    if (!date || !time) return null;

    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const merged = new Date(date);
    merged.setHours(hours, minutes, 0, 0);

    return merged;
  }

  const finalDateTime = mergeDateAndTime(selectedDate, selectedTime);

  const calculateTotalPrice = () => {
    return selectedServices.reduce(
      (total, service) => total + service.basePrice,
      0
    );
  };

  const handleLogin = (role: string) => {
    setUserRole(role as "employer" | "freelancer");
    setIsLoggedIn(true);
  };

  useEffect(() => {
    dispatch(getServiceById(id));
  }, [id]);

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

  // Calculate pricing (matching BookService.tsx structure)
  const basePrice = calculateTotalPrice();
  const platformCommission = Math.round(basePrice * 0.1); // 10%
  const tax = Math.round((basePrice + platformCommission) * 0.08); // 8%
  const totalAmount =
    serviceVar?.serviceDetails?.price + platformCommission + tax;
  const advanceAmount = Math.round(totalAmount * 0.3); // 30%

  const handleCompleteBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.warning("Please select date and time");
      return;
    }

    dispatch(
      createBooking({
        serviceId: serviceVar?.serviceDetails?._id,
        bookingDate: selectedDate.toISOString(),
        paymentType: "full",
        bookingTime: bookingTime,
        notes: "",
        lat: formData?.lat,
        lng: formData?.lng,
        address: formData?.address,
      })
    );
  };

  useEffect(() => {
     console.log(bookingVar?.bookingDetails)
    if (
      bookingVar?.bookingDetails?.razorpayKey &&
      bookingVar?.bookingDetails?.order?.id
    ) {
      openRazorpay(bookingVar?.bookingDetails, authVar, dispatch);
    }
  }, [bookingVar?.bookingDetails, authVar]);

  // Helper function to compare only date part
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Filter availability by exact date
  const slotsForDay = selectedDate
    ? serviceVar?.serviceDetails?.availability?.filter((slot) =>
      isSameDay(new Date(slot.date), selectedDate)
    )
    : [];


  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  if (serviceVar?.serviceDetails === null) {
    return <div>Loading...</div>;
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-4">
              Your booking for {selectedServices.length} service
              {selectedServices.length > 1 ? "s" : ""} has been confirmed.
              You'll receive an OTP to start the services.
            </p>
            <Badge className="bg-green-100 text-green-800">
              {paymentType === "advance"
                ? "Advance Paid"
                : "Full Payment Complete"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden on mobile */}
      <div className="hidden lg:block">
        <Header onLogin={handleLogin} />
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6 max-w-7xl">
        {/* Back Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            size="icon"
            className=" flex items-center gap-1 p-0 h-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex justify-between items-center bg-background rounded-lg p-3 w-full">
            <span className="font-medium capitalize">
              {serviceVar?.serviceDetails?.title}
            </span>
            <span className="font-bold text-primary">
              ₹{serviceVar?.serviceDetails?.price}
            </span>
          </div>
        </div>

        {/* Page Title */}
        {/* <h1 className="text-3xl font-bold mb-8">Book Service</h1> */}

        {/* Services Summary - Enhanced for desktop */}

        {/* Two Column Layout for Desktop */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Date, Time & Payment Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date and Time Selection Combined */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="w-full">
                <h3 className="text-xl font-semibold mb-4">Select Date</h3>
                <Card className="w-full">
                  <CardContent className="p-0">
                    {/* <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border shadow-sm"
                      captionLayout="dropdown"
                      disabled={{ before: new Date() }}
                    /> */}
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date); 
                        setBookingTime(""); 
                        setSelectedTime(""); 
                      }}
                      className="rounded-md border shadow-sm"
                      captionLayout="dropdown"
                      // ✅ Combined disabled logic
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); 

                        const isPast = date < today; 
                        const isAvailable = serviceVar?.serviceDetails?.availability?.some(
                          (slot) => isSameDay(new Date(slot.date), date)
                        );

                        return isPast || !isAvailable; 
                      }}
                    />

                  </CardContent>
                </Card>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Available</h3>
                {slotsForDay && slotsForDay.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {selectedDate
                      ? "No slots available for this date"
                      : "Please select a date"}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {slotsForDay?.map((slot) => {
                      const label = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;

                      return (
                        <Button
                          key={slot.scheduleId}
                          variant={selectedTime === slot.scheduleId ? "default" : "outline"}
                          size="lg"
                          onClick={() => {
                            setSelectedTime(slot.scheduleId);
                            setBookingTime(label);
                          }}
                          className="h-12"
                        >
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                )}
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
                  <ul className=" z-50 w-full bg-white border rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
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

            {/* Summary */}
            <Card>
              <div className="flex items-start justify-between gap-2 flex-col bg-muted/30 rounded-lg p-4">
                <div>
                  <h4 className="font-semibold mb-1">Skills & Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    <span>{serviceVar?.serviceDetails?.skills.join(", ")}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Years of experiences:</h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{serviceVar?.serviceDetails?.experience} Years</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    Equipments/Tools Required:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{serviceVar?.serviceDetails?.equipments}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Special Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{serviceVar?.serviceDetails?.requirements}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Service Details:</h4>
                  <div className="flex flex-wrap gap-2">
                    <p>{serviceVar?.serviceDetails?.description}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                {selectedDate ? (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                        , {selectedDate.getFullYear()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Please select a date</span>
                  </div>
                )}

                {selectedTime ? (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium">{bookingTime}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>Please select a time</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Options */}
            <div>
              {/* <h3 className="text-xl font-semibold mb-4">Payment Option</h3> */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg hidden ${paymentType === "advance"
                    ? "ring-2 ring-primary shadow-lg"
                    : ""
                    }`}
                  onClick={() => setPaymentType("advance")}
                >
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${paymentType === "advance"
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                            }`}
                        />
                        <h5 className="font-semibold text-lg">
                          Pay Advance (Recommended)
                        </h5>
                      </div>
                      <p className="text-muted-foreground">
                        Pay 30% now, remaining after service completion
                      </p>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ₹{advanceAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Remaining: ₹
                          {(totalAmount - advanceAmount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${paymentType === "full"
                    ? "ring-2 ring-primary shadow-lg"
                    : ""
                    }`}
                  onClick={() => setPaymentType("full")}
                >
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {/* <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            paymentType === "full"
                              ? "bg-primary border-primary"
                              : "border-muted-foreground"
                          }`}
                        /> */}
                        <div className="flex items-center justify-between w-full">
                          <h5 className="font-semibold text-lg">
                            Pay Full Amount
                          </h5>
                          <div className="text-2xl font-bold text-primary">
                            ₹{totalAmount}
                          </div>
                        </div>
                      </div>
                      <small className="text-xs">
                        (Including GST if applicable)
                      </small>
                      <div className="text-right"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Pricing */}
          <div className="space-y-6">
            <div className="sticky top-6">
              {/* Pricing Breakdown */}
              <Card className="mt-6 border-none shadow-none">
                <CardContent className="p-6">
                  {/* Desktop Complete Booking Button - Hidden on mobile */}
                  <Button
                    onClick={handleCompleteBooking}
                    className="w-full mt-6 hidden lg:block"
                    size="lg"
                    disabled={!selectedDate || !selectedTime || !bookingTime}
                  >
                    Complete Booking - ₹{serviceVar?.serviceDetails?.price}
                    {/* {paymentType === "advance"
                      ? advanceAmount.toLocaleString()
                      : totalAmount.toLocaleString()} */}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          onClick={handleCompleteBooking}
          className="w-full"
          size="lg"
          disabled={
            !selectedDate ||
            !bookingTime ||
            formData.address === "" ||
            formData.lat === null ||
            formData?.lng === null
          }
        >
          Complete Booking - ₹{serviceVar?.serviceDetails?.price}
        </Button>
      </div>
    </div>
  );
};

export default MultiServiceBooking;
