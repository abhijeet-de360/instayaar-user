import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Clock, Star, Shield, CreditCard } from 'lucide-react';
import type { FreelancerService } from '@/types/freelancerTypes';

interface BookingFlowProps {
  service: FreelancerService;
  onClose: () => void;
  onBookingComplete: (bookingId: string) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  service,
  onClose,
  onBookingComplete,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentType, setPaymentType] = useState<'advance' | 'full'>('advance');

  // Calculate pricing
  const basePrice = service.basePrice;
  const platformCommission = Math.round(basePrice * 0.1); // 10%
  const tax = Math.round((basePrice + platformCommission) * 0.08); // 8%
  const totalAmount = basePrice + platformCommission + tax;
  const advanceAmount = Math.round(totalAmount * 0.3); // 30%

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    setStep('payment');
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setStep('confirmation');
      setTimeout(() => {
        onBookingComplete('booking_new_' + Date.now());
      }, 2000);
    }, 1500);
  };

  if (step === 'confirmation') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl mx-auto my-8 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {step === 'details' ? 'Book Service' : 'Payment Details'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Service Summary */}
          <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
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

          {step === 'details' && (
            <>
              {/* Date & Time Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['2024-02-15', '2024-02-16', '2024-02-17', '2024-02-18', '2024-02-19', '2024-02-20'].map((date) => (
                      <Button
                        key={date}
                        variant={selectedDate === date ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDate(date)}
                        className="text-xs"
                      >
                        {new Date(date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Time</label>
                  <div className="grid grid-cols-4 gap-2">
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
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold">Pricing Breakdown</h4>
                <div className="space-y-2">
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
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleProceedToPayment} className="w-full" size="lg">
                Proceed to Payment
              </Button>
            </>
          )}

          {step === 'payment' && (
            <>
              {/* Payment Options */}
              <div className="space-y-4">
                <h4 className="font-semibold">Payment Option</h4>
                <div className="grid gap-3">
                  <Card 
                    className={`cursor-pointer transition-colors ${
                      paymentType === 'advance' ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setPaymentType('advance')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Pay Advance (Recommended)</h5>
                          <p className="text-sm text-muted-foreground">
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
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Pay Full Amount</h5>
                          <p className="text-sm text-muted-foreground">
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

              {/* Payment Method */}
              <div className="space-y-3">
                <h4 className="font-semibold">Payment Method</h4>
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

              {/* Service Details Summary */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{selectedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
              </div>

              <Button onClick={handlePayment} className="w-full" size="lg">
                Pay ₹{paymentType === 'advance' ? advanceAmount.toLocaleString() : totalAmount.toLocaleString()}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};