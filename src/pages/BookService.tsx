import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, MapPin, Clock, Star, Shield, CreditCard, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useUserRole } from '@/contexts/UserRoleContext';
import { cn } from '@/lib/utils';
import freelancerData from '@/data/freelancerData.json';

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  
  // Single page booking flow state
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentType, setPaymentType] = useState<'advance' | 'full'>('advance');

  // Find service by ID
  const service = freelancerData.services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-muted-foreground mb-4">The service you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleLogin = (role: string) => {
    setUserRole(role as 'employer' | 'freelancer');
    setIsLoggedIn(true);
  };

  // Calculate pricing
  const basePrice = service.basePrice;
  const platformCommission = Math.round(basePrice * 0.1); // 10%
  const tax = Math.round((basePrice + platformCommission) * 0.08); // 8%
  const totalAmount = basePrice + platformCommission + tax;
  const advanceAmount = Math.round(totalAmount * 0.3); // 30%

  const handleCompleteBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setIsConfirmed(true);
      setTimeout(() => {
        navigate('/my-bookings', { state: { newBooking: 'booking_new_' + Date.now() } });
      }, 2000);
    }, 1500);
  };

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
              Your booking has been confirmed. You'll receive an OTP to start the service.
            </p>
            <Badge className="bg-green-100 text-green-800">
              {paymentType === 'advance' ? 'Advance Paid' : 'Full Payment Complete'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header onLogin={handleLogin} />
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Book Service</h1>

        {/* Service Summary */}
        <div className="flex gap-4 p-4 bg-muted/50 rounded-lg mb-6">
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold">{service.title}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{service.rating}</span>
              <span>•</span>
              <span>{service.completedJobs} jobs</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span>{service.location}</span>
            </div>
          </div>
        </div>

        {/* Single Step Booking Form */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Date, Time & Payment Options */}
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Date & Time</h3>
              <Card>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Available Time Slots</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'].map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-xs"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Option</h3>
              <div className="space-y-3">
                <Card 
                  className={`cursor-pointer transition-colors ${
                    paymentType === 'advance' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setPaymentType('advance')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">Pay Advance (Recommended)</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay 30% now, remaining after service completion
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{advanceAmount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          Remaining: ₹{(totalAmount - advanceAmount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-colors ${
                    paymentType === 'full' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setPaymentType('full')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">Pay Full Amount</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          Complete payment now, no pending amount
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{totalAmount.toLocaleString()}</div>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          5% Discount Applied
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Pricing */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  {selectedDate ? (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      <span>{selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Please select a date</span>
                    </div>
                  )}
                  {selectedTime ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{selectedTime}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Please select a time</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{service.location}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">
                        Secure payment via Stripe
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Pricing Details</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>₹{basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Platform Commission (10%)</span>
                      <span>₹{platformCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax (8%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-primary font-medium bg-primary/5 p-2 rounded">
                      <span>Amount to Pay ({paymentType === 'advance' ? '30% Advance' : 'Full Payment'})</span>
                      <span className="font-semibold">₹{paymentType === 'advance' ? advanceAmount.toLocaleString() : totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden">
        <Button onClick={handleCompleteBooking} className="w-full" size="lg">
          Complete Booking - ₹{paymentType === 'advance' ? advanceAmount.toLocaleString() : totalAmount.toLocaleString()}
        </Button>
      </div>

      {/* Desktop Bottom Button */}
      <div className="hidden md:block fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <Button onClick={handleCompleteBooking} size="lg" className="px-8">
          Complete Booking - ₹{paymentType === 'advance' ? advanceAmount.toLocaleString() : totalAmount.toLocaleString()}
        </Button>
      </div>

    </div>
  );
};

export default BookService;