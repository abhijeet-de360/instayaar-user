import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { localService } from "@/shared/_session/local";
import { ArrowLeft, IndianRupee, Star, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getCategories } from "@/store/categorySlice";

import { Switch } from "@/components/ui/switch"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Checkbox } from "@/components/ui/checkbox";
import { setInstantBookingFreelancer } from "@/store/authSlice";
import { bidInstantBooking, completeInstantBooking, getBookingsForFreelancer, startInstantBooking } from "@/store/instantBookingSlice";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { warningHandler } from "@/shared/_helper/responseHelper";


const FreelancerInstantBooking = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeBooking, setActiveBooking] = useState(false);
  const categoryVar = useSelector((state: RootState) => state.category);
  const [showBooking, setBooking] = useState(true)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [open, setOpen] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const authVar = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();
  const instantVar = useSelector((state: RootState) => state?.instant)
  const [bookingId, setBookingId] = useState('');
  const [jobId, setJobId] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [action, setAction] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  console.log(otp)


  const [formData, setFormData] = useState({
    limit: 50,
    offset: 0,
    lat: '',
    lng: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(bidInstantBooking(bookingId, { bidAmount: bidAmount, coverLetter: '' }, setBidAmount, setOpen))
  }

  useEffect(() => {
    setActiveBooking(authVar?.freelancer?.instantBooking)
  }, [authVar.freelancer])

  useEffect(() => {
    dispatch(getBookingsForFreelancer(formData.limit, formData.offset, formData.lat, formData.lng))
  }, [])

  const handleInstantStatus = (value) => {
    if (authVar?.freelancer?.status !== 'active') {
      navigate('/account-settings')
      warningHandler("This account is not verified!")
      return;
    }
    setActiveBooking(value);
    dispatch(setInstantBookingFreelancer(value));
  };

  const handleStart = () => {
    if (action === 'start') {
      dispatch(startInstantBooking(jobId, otp, setOtp, setOtpModal, setJobId))
    } else {
      dispatch(completeInstantBooking(jobId, otp, setOtp, setOtpModal, setJobId))
    }
  }



  return (
    <div className={`min-h-screen bg-background pb-4 flex flex-col  h-screen ${localService.get('role') === 'user' ? 'justify-between' : ''}`}>
      {/* <Header onLogin={handleLogin} /> */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link to={`${localService?.get('role') === 'freelancer' ? "/freelancer-dashboard" : "/employer-dashboard"}`} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Instant Booking</span>
          </Link>
          {localService.get('role') === 'freelancer' && <Switch id="" onCheckedChange={handleInstantStatus} checked={activeBooking} />}
        </div>
      </div>

      <div className="px-4 mt-4 ">
        {
          authVar?.freelancer?.instantBooking === false && <div className="border border-neutral-200 bg-neutral-50 rounded-lg shadow-sm p-6 text-center">
            <p className="font-semibold text-gray-700 text-lg">No Bookings Available</p>
            <p className="text-gray-500 text-sm mt-1">Please enable instant booking.</p>
          </div>
        }
        {authVar?.freelancer?.instantBooking === true && instantVar?.bookingsListForFreelancer?.length === 0 && (
          <div className="border border-neutral-200 bg-neutral-50 rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-center mb-2">
              <span className="text-gray-400 text-4xl">📭</span>
            </div>
            <p className="font-semibold text-gray-700 text-lg">No Bookings Available</p>
            <p className="text-gray-500 text-sm mt-1">New bookings will appear here.</p>
          </div>
        )}
        {authVar?.freelancer?.instantBooking === true && instantVar?.bookingsListForFreelancer.map((item) => (
          <div className="border border-neutral-300 rounded-lg shadow-sm p-4 mb-3" key={item?._id}>
            <p className="font-medium text-lg truncate">{item?.title}</p>
            <div className="flex items-center gap-2"><span className="text-gray-600 text-sm">{item?.categoryId?.name}</span> | <span className="font-medium text-md mt-0.5">₹{item?.budget}</span></div>
            <div className="flex items-center gap-2"><span className="text-gray-800 text-sm">{item?.address}</span></div>
            <small className="text-gray-400">By {item?.userId?.firstName} {item?.userId?.lastName}</small>
            {item?.applicationStatus === null && <Button className="h-8 w-full mt-2" onClick={() => {
              setBookingId(item?._id);
              setOpen(true)
            }}>Accept</Button>}
            {
              item?.applicationStatus === 'applied' && <Button variant="outline" className="h-8 w-full mt-2">Applied</Button>
            }
            {
              item?.applicationStatus === 'shortlisted' &&
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1 h-8 w-full mt-2">Chat</Button>
                <Button variant="outline" className="flex-1 h-8 w-full mt-2">Call</Button>
                <Button className="flex-1 h-8 w-full mt-2" onClick={() => {
                  setOtpModal(true);
                  setAction('start');
                  setJobId(item?.appliedJobId);
                }}>Start</Button>
              </div>
            }
            {
              item?.applicationStatus === 'inProgress' &&
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1 h-8 w-full mt-2">Chat</Button>
                <Button variant="outline" className="flex-1 h-8 w-full mt-2">Call</Button>
                <Button className="flex-1 h-8 w-full mt-2" onClick={() => {
                  setOtpModal(true);
                  setAction('complete');
                  setJobId(item?.appliedJobId);
                }}>End</Button>
              </div>
            }
          </div>
        ))}
      </div>


      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="px-4 pb-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bid Amount */}
              <div className="space-y-2">
                <Label htmlFor="bidAmount" className="text-sm">Bid Amount *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 mt-[2px] text-muted-foreground" />
                  <Input
                    id="bidAmount"
                    type="number"
                    placeholder="Enter bid amount"
                    className="pl-8"
                    required
                    onChange={(e) => setBidAmount(e.target.value)}
                  />

                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  I agree this bid can&apos;t be changed once submitted.
                </Label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { }}
                  className="flex-1"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!acceptTerms}
                  className="flex-1"
                  size="sm"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={otpModal} onOpenChange={setOtpModal}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-none" />

          {/* If allowed => show OTP inputs, else show informative message */}
          <div className="px-4 py-6 space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="otp" className="text-center block">
                  Enter 4-Digit OTP
                </Label>
                <div className="flex justify-center">
                  <InputOTP value={otp} onChange={setOtp} maxLength={4}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOtpModal(false)} className="flex-1" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting || otp?.length !== 4}
                  className="flex-1"
                  onClick={handleStart}
                >
                  {isSubmitting ? (
                    action === 'start' ? 'Starting...' : 'Completing...'
                  ) : action === 'start' ? (
                    'Start Job'
                  ) : (
                    'Complete Job'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FreelancerInstantBooking;
