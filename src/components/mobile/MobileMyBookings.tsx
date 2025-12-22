import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, MessageCircle, Phone, Star, Play, Square, Clock, IndianRupee, ArrowLeft, X, ClockIcon, Info } from "lucide-react";
import { BookingData } from "@/types/bookingTypes";
import { JobOTPBottomSheet } from "@/components/job/JobOTPBottomSheet";
import { useToast } from "@/hooks/use-toast";
import { getAllBooking } from "@/store/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { localService } from "@/shared/_session/local";
import dayjs from "dayjs";
import { getConversationId } from "@/store/chatSlice";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import { Textarea } from "../ui/textarea";
import ReactStars from "react-rating-stars-component";
import { createJobReview, createReview } from "@/store/reviewSlice";



const MobileMyBookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [showOTP, setShowOTP] = useState(false);
  const [otpAction, setOtpAction] = useState<'start' | 'complete'>('start');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const bookingVar = useSelector((state: RootState) => state?.booking)
  const authVar = useSelector((state: RootState) => state?.auth)
  const [reviewSheet, setReviewSheet] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [jobType, setJobType] = useState('')
  const [rateData, setRateData] = useState({
    bookingId: '',
    rating: 0,
    review: ''
  })


  const handleServiceReview = () => {
    console.log(jobType)
    if (jobType === 'job') {
      dispatch(createJobReview(rateData))
      setRateData({
        bookingId: '',
        rating: 0,
        review: ''
      })
      setJobType('')
    } else {
      dispatch(createReview(rateData))
      setRateData({
        bookingId: '',
        rating: 0,
        review: ''
      })
      setJobType('')
    }
  }




  // const safeUserRole = userRole ?? null;
  // const safeIsLoggedIn = isLoggedIn ?? false;

  const handleLogin = (role: string) => {
    // setIsLoggedIn(true);
    // setUserRole(role as 'employer' | 'freelancer');
  };


  useEffect(() => {
    dispatch(getAllBooking())
  }, [])


  // Enhanced mock booking data
  useEffect(() => {
    const mockBookings: BookingData[] = [
      {
        id: "book_001",
        serviceId: "svc_001",
        serviceName: "Wedding Chef Service",
        serviceCategory: "Chef",
        freelancerId: "fl_001",
        freelancerName: "Rajesh Kumar",
        employerId: "emp_001",
        employerName: "Priya Sharma",
        bookingDate: "2024-02-15",
        bookingTime: "6:00 PM",
        location: "Mumbai, Maharashtra",
        status: "confirmed",
        description: "Traditional Indian wedding cuisine",
        payment: {
          totalAmount: 5000,
          paymentMethod: "platform",
          paymentStatus: "fully_paid",
          platformFee: 500,
          freelancerEarning: 4500
        },
        otp: { otpGenerated: true, startOTP: "1234", endOTP: "5678" },
        createdAt: "2024-02-10T10:00:00Z",
        updatedAt: "2024-02-12T15:30:00Z"
      },
      {
        id: "book_002",
        serviceId: "svc_002",
        serviceName: "Corporate Event DJ",
        serviceCategory: "DJ",
        freelancerId: "fl_002",
        freelancerName: "Kavya Iyer",
        employerId: "emp_001",
        employerName: "Priya Sharma",
        bookingDate: "2024-02-20",
        bookingTime: "8:00 PM",
        location: "Chennai, Tamil Nadu",
        status: "in_progress",
        description: "Corporate annual party",
        payment: {
          totalAmount: 12000,
          advanceAmount: 5000,
          remainingAmount: 7000,
          paymentMethod: "advance",
          paymentStatus: "advance_paid",
          freelancerEarning: 11400
        },
        otp: { otpGenerated: true, startOTP: "9876", endOTP: "5432" },
        createdAt: "2024-02-08T14:20:00Z",
        updatedAt: "2024-02-10T09:15:00Z"
      },
      {
        id: "book_003",
        serviceId: "svc_003",
        serviceName: "Home Cleaning",
        serviceCategory: "Cleaning",
        freelancerId: "fl_003",
        freelancerName: "Sunita Devi",
        employerId: "emp_001",
        employerName: "Priya Sharma",
        bookingDate: "2024-02-05",
        bookingTime: "10:00 AM",
        location: "Bangalore, Karnataka",
        status: "completed",
        payment: {
          totalAmount: 2500,
          paymentMethod: "platform",
          paymentStatus: "fully_paid",
          freelancerEarning: 2250
        },
        otp: { otpGenerated: true },
        createdAt: "2024-02-01T12:00:00Z",
        updatedAt: "2024-02-05T16:30:00Z",
        completedAt: "2024-02-05T14:30:00Z",
        rating: {
          score: 5,
          review: "Excellent service!",
          ratedAt: "2024-02-05T18:00:00Z"
        }
      },
      {
        id: "book_004",
        serviceId: "svc_004",
        serviceName: "Event Photography",
        serviceCategory: "Photography",
        freelancerId: "fl_004",
        freelancerName: "Amit Sharma",
        employerId: "emp_001",
        employerName: "Priya Sharma",
        bookingDate: "2024-02-18",
        bookingTime: "2:00 PM",
        location: "Delhi, India",
        status: "completed",
        description: "Birthday party photography",
        payment: {
          totalAmount: 8000,
          paymentMethod: "platform",
          paymentStatus: "fully_paid",
          freelancerEarning: 7200
        },
        otp: { otpGenerated: true },
        createdAt: "2024-02-15T09:00:00Z",
        updatedAt: "2024-02-18T18:30:00Z",
        completedAt: "2024-02-18T17:00:00Z"
        // No rating - review pending
      }
    ];
    setBookings(mockBookings);
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'onGoing': return 'destructive';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'booked': return 'Booked';
      case 'onGoing': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  function formatTime(time) {
    if (!time) return "-";
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // converts 0 → 12
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }



  const handleStartJob = (booking: BookingData) => {
    setSelectedBooking(booking);
    setOtpAction('start');
    setShowOTP(true);
  };

  const handleCompleteJob = (booking: BookingData) => {
    setSelectedBooking(booking);
    setOtpAction('complete');
    setShowOTP(true);
  };

  const handleOTPSuccess = () => {
    if (!selectedBooking) return;

    const newStatus = otpAction === 'start' ? 'onGoing' : 'completed';
    setBookings(prev => prev.map(booking =>
      booking.id === selectedBooking.id
        ? { ...booking, status: newStatus as any, updatedAt: new Date().toISOString() }
        : booking
    ));

    if (otpAction === 'complete' && selectedBooking.payment.paymentMethod === 'platform') {
      toast({
        title: "Payment Received!",
        description: `₹${selectedBooking.payment.freelancerEarning} added to your wallet`,
      });
    }
  };

  const canShowRating = (booking: BookingData) => {
    return localService.get('role') === 'user' &&
      booking.status === 'completed' &&
      !booking.rating;
  };

  const shouldShowChatCall = (booking: BookingData) => {
    return booking.status !== 'completed';
  };

  const getOTPButtonText = (booking: BookingData) => {
    if (booking.status === 'confirmed') {
      return 'Start OTP';
    } else if (booking.status === 'onGoing') {
      return 'Complete OTP';
    }
    return 'OTP';
  };


  const handleServiceView = (servie) => {
    setSelectedService(servie)
  }

  const handleJobView = (job) => {
    setSelectedJob(job)
  }


  return <div className="min-h-screen bg-background pb-20">
    {/* Hide header when logged in on mobile */}
    {!authVar.isAuthenticated && <Header onLogin={handleLogin} />}

    <div className="sticky top-0 z-20 bg-background border-b">
      <div className="flex items-center justify-between p-4">
        <Link to="/employer-dashboard" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">My Bookings</span>
        </Link>
      </div>
    </div>

    {/* Mobile-First Content */}
    <div className="px-4 py-4 space-y-4">

      {/* Booking Cards */}
      <div className="space-y-4">
        {bookingVar.bookingData.length > 0 && bookingVar.bookingData.map(booking => (
          booking.bookingType === "service" ? (
            // -------------------------
            // SERVICE BOOKING CARD
            // -------------------------
            <Card key={booking._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-3 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base capitalize">{booking?.serviceId?.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs capitalize">
                          {booking?.bookingId} | {localService.get('role') === 'user'
                            ? `${" " + booking?.freelancerId?.firstName} ${booking?.freelancerId?.lastName}`
                            : booking?.employerName}
                        </p>
                        {/* {booking?.paymentType === 'full' && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 capitalize">
                            Direct
                          </Badge>
                        )} */}
                      </div>

                      {/* Payment Status */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {booking.paymentType === 'advance' && booking.advanceAmount && (
                          <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            Advance: ₹{booking.advanceAmount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {/* <Calendar className="h-3 w-3" /> */}
                      <span>{dayjs(booking?.bookingDate).format("DD MMM YYYY")}</span>
                      {/* <ClockIcon className="h-3 w-3" /> */}
                      <span>{booking?.bookingTime}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      {/* <div><MapPin className="h-3 w-3 mt-1" /></div> */}
                      <span>{booking?.address}</span>
                    </div>
                    <div className=" flex justify-end">
                      {booking?.status === 'cancelled' && <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{booking?.status === 'cancelled' ? 'Canceled' : ""}</span>}
                    </div>
                  </div>

                  {/* OTP Sections */}
                  {localService.get('role') === 'user' && booking.status === 'confirmed' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-orange-800">Share with freelancer to start:</span>
                        <span className="text-base font-mono font-bold text-orange-900">{booking.startOtp}</span>
                      </div>
                    </div>
                  )}
                  {localService.get('role') === 'user' && booking.status === 'onGoing' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-800">Share with freelancer to complete:</span>
                        <span className="text-base font-mono font-bold text-green-900">{booking.completionOtp}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {booking?.status !== 'cancelled' && <div className="flex flex-wrap gap-2 pt-1">
                    {shouldShowChatCall(booking) && (
                      <div className="flex justify-end w-full gap-2">
                        <Button
                          className="h-8  text-xs"
                          size="icon"
                          variant="outline"

                          onClick={() => handleServiceView(booking)}>
                          <Info className="w-8 h-8 text-primary" />
                        </Button>
                        <a href={`tel:${booking?.freelancerId?.phoneNumber}`} className="min-w-20">
                          <Button size="sm" variant="outline" className="h-8 w-full">
                            Call
                          </Button>
                        </a>
                        {booking?.status === 'onGoing' && <Link to={`/freelancer-services/${booking?.freelancerId?._id}`} className="min-w-20">
                          <Button size="sm" variant="outline" className="h-8 w-full">
                            Extend
                          </Button>
                        </Link>}
                        <Button size="sm" className="h-8 min-w-20" onClick={() => dispatch(getConversationId(booking?.freelancerId?._id, navigate))}>
                          Chat
                        </Button>

                      </div>
                    )}

                    {localService.get('role') === 'freelancer' && booking.status === 'confirmed' && (
                      <Button size="sm" className="h-8 flex-1" onClick={() => handleStartJob(booking)}>
                        <Play className="h-3 w-3 mr-1" /> Start
                      </Button>
                    )}

                    {localService.get('role') === 'freelancer' && booking.status === 'in_progress' && (
                      <Button size="sm" className="h-8 flex-1" onClick={() => handleCompleteJob(booking)}>
                        <Square className="h-3 w-3 mr-1" /> Complete
                      </Button>
                    )}
                    {booking.status === 'completed' && booking.rating && localService.get('role') === 'user' && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>Rated {booking.rating.score}/5</span>
                      </div>
                    )}
                  </div>}
                  <div className="flex justify-end">
                    {booking?.status === 'completed' && booking?.isReviewed === false && (
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          setReviewSheet(true);
                          setJobType(booking?.bookingType)
                          setRateData((prev) => ({
                            ...prev,
                            bookingId: booking._id,
                          }));
                        }}

                      >
                        <Star className="h-3 w-3 mr-1" /> Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // -------------------------
            // JOB BOOKING CARD
            // -------------------------
            <Card key={booking._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-3 space-y-3 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base capitalize">{booking?.jobData?.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-muted-foreground text-xs">
                            {booking?.applicationId} | {booking?.freelancerId.firstName} {booking?.freelancerId.lastName}
                          </p>
                          {/* <span className="text-xs font-medium border px-2 py-0.5 rounded-xl capitalize">{booking?.status}</span> */}
                        </div>
                        {/* <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Post
                        </Badge> */}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {/* <Calendar className="h-3 w-3" /> */}
                      <span>
                        {booking.type === "instant"
                          ? `${dayjs(booking?.createdAt).format("DD MMM YYYY")}  ${formatTime(booking?.createdAt)}`
                          : `${dayjs(booking?.jobData?.prefferedDate).format("DD MMM YYYY")}   ${formatTime(booking?.jobData?.timeFrom)} - ${formatTime(booking?.jobData?.timeTo)}`
                        }
                      </span>

                    </div>
                    <div className="flex items-start gap-1">
                      {/* <div><MapPin className="h-3 w-3 mt-1" /></div> */}
                      <span>{booking?.jobData?.address}</span>
                    </div>
                  </div>

                  {/* OTP Sections */}
                  {localService.get('role') === 'user' && booking.status === 'hired' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-orange-800">Share with freelancer to start:</span>
                        <span className="text-base font-mono font-bold text-orange-900">{booking.startOtp}</span>
                      </div>
                    </div>
                  )}
                  {localService.get('role') === 'user' && booking.status === 'inProgress' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-800">Share with freelancer to complete:</span>
                        <span className="text-base font-mono font-bold text-green-900">{booking.completionOtp}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions same as service card */}
                  <div className="flex flex-wrap justify-end gap-2 pt-1">
                    {shouldShowChatCall(booking) && booking.status !== 'rejected' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          className="h-8  text-xs"
                          size="icon"
                          variant="outline"
                          onClick={() => handleJobView(booking)}
                        >
                          <Info className="w-8 h-8 text-primary" />
                        </Button>
                        <a href={`tel:${booking?.freelancerId?.phoneNumber}`} className="min-w-20">
                          <Button size="sm" variant="outline" className="h-8 w-full">
                            Call
                          </Button>
                        </a>
                        {booking?.status === 'inProgress' && <Link to={`/freelancer-services/${booking?.freelancerId?._id}`} className="min-w-20">
                          <Button size="sm" variant="outline" className="h-8 w-full">
                            Extend
                          </Button>
                        </Link>}
                        <Button size="sm" className="h-8 min-w-20" onClick={() => dispatch(getConversationId(booking?.freelancerId._id, navigate))}>
                          Chat
                        </Button>

                      </div>
                    )}

                    {booking?.status === 'completed' && booking?.isReviewed === false && (
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          setReviewSheet(true);
                          setJobType(booking?.bookingType);
                          setRateData((prev) => ({
                            ...prev,
                            bookingId: booking._id,
                          }));
                        }}
                      >
                        <Star className="h-3 w-3 mr-1" /> Review</Button>
                    )}
                  </div>
                  {booking.status === 'rejected' && (
                    <div className="flex items-start self-end justify-end gap-2 text-xs text-muted-foreground flex-col">
                      <span className="bg-red-100 text-red-600 p-0.5 rounded-lg px-1">Canceled</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        ))}

      </div>

      {/* Empty State */}
      {bookingVar.bookingData.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No bookings yet</h3>
              <p className="text-muted-foreground">
                {localService.get('role') === 'user'
                  ? 'Start by browsing services'
                  : 'Apply to jobs to receive bookings'
                }
              </p>
            </div>
            <Button onClick={() => navigate('/discover')}>
              {localService.get('role') === 'user' ? 'Browse Services' : 'Browse Jobs'}
            </Button>
          </div>
        </Card>
      )}
    </div>

    <MobileBottomNav />

    {/* OTP Bottom Sheet */}
    {selectedBooking && (
      <JobOTPBottomSheet
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        action={otpAction}
        jobTitle={selectedBooking.serviceName}
        onSuccess={handleOTPSuccess}
      />
    )}

    <Drawer open={reviewSheet} onOpenChange={() => setReviewSheet(false)}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Rate Your Experience</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 items-center">
            <ReactStars
              count={5}
              value={rateData.rating}
              onChange={(e) => { setRateData((prev) => ({ ...prev, rating: e })) }}
              size={60}
              classNames={`flex items-center gap-2`}
              activeColor="#ffd700"
            />
            <Textarea placeholder="Give your feedback..." value={rateData?.review} onChange={(e) => setRateData((prev) => ({ ...prev, review: e.target.value }))} />
          </div>

          <DrawerFooter>
            <div className="flex items-center gap-4 justify-center">
              <Button onClick={() => {
                setReviewSheet(false);
                handleServiceReview()
              }} disabled={rateData.rating === 0}>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => setReviewSheet(false)}>Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>


    {selectedService && <Drawer
      open={!!selectedService}
      onOpenChange={() => setSelectedService(null)}
    >
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl">
            {selectedService?.serviceId?.title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-2 flex-col rounded-lg p-4">
            <div>
              <h4 className="font-semibold mb-1">
                Skills & Specialties
              </h4>
              <div className="flex flex-wrap gap-2">
                <span>{selectedService?.serviceId?.skills.join(", ")}</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">
                Years of experiences:
              </h4>
              <div className="flex flex-wrap gap-2">
                <p>{selectedService?.serviceId?.experience} Years</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">
                Equipments/Tools Required:
              </h4>
              <div className="flex flex-wrap gap-2">
                <p>{selectedService?.serviceId?.equipments}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">
                Special Requirements:
              </h4>
              <div className="flex flex-wrap gap-2">
                <p>{selectedService?.serviceId?.requirements}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">
                Service Details:
              </h4>
              <div className="flex flex-wrap gap-2">
                <p>{selectedService?.serviceId?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>}

    {selectedJob && <Drawer
      open={!!selectedJob}
      onOpenChange={() => setSelectedJob(null)}
    >
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl">
            {selectedJob?.jobData?.title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-2 flex-col rounded-lg p-4">
            <div>
              <h4 className="font-semibold mb-1">
                Description
              </h4>
              <div className="flex flex-wrap gap-2">
                <span>{selectedJob?.jobData?.description}</span>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>}
  </div>;
};
export default MobileMyBookings;