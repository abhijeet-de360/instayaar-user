import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, Square, Star, Shield, Clock } from 'lucide-react';
import type { ServiceBooking } from '@/types/freelancerTypes';

interface OTPWorkflowProps {
  booking: ServiceBooking;
  userRole: 'employer' | 'freelancer';
  onStatusUpdate: (bookingId: string, status: ServiceBooking['status']) => void;
  onRatingSubmit: (bookingId: string, rating: number, review: string) => void;
}

export const OTPWorkflow: React.FC<OTPWorkflowProps> = ({
  booking,
  userRole,
  onStatusUpdate,
  onRatingSubmit,
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartService = () => {
    if (otpInput === booking.startOtp) {
      onStatusUpdate(booking.id, 'in_progress');
      setOtpInput('');
    } else {
      alert('Invalid OTP. Please check and try again.');
    }
  };

  const handleEndService = () => {
    if (otpInput === booking.endOtp) {
      onStatusUpdate(booking.id, 'completed');
      setOtpInput('');
    } else {
      alert('Invalid OTP. Please check and try again.');
    }
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onRatingSubmit(booking.id, rating, review);
      setIsSubmitting(false);
    }, 1000);
  };

  const getStatusColor = (status: ServiceBooking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'advance_paid': return 'bg-blue-100 text-blue-800';
      case 'full_paid': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{booking.serviceName}</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Service Date: {new Date(booking.serviceDate).toLocaleDateString()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Service Provider Info */}
        <div className="flex items-center gap-3">
          <img
            src={booking.freelancerImage}
            alt={booking.freelancerName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{booking.freelancerName}</div>
            <div className="text-sm text-muted-foreground">{booking.location}</div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Payment Status</span>
            <Badge className={getStatusColor(booking.paymentStatus)}>
              {booking.paymentStatus === 'advance_paid' ? 'Advance Paid' : 'Fully Paid'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {booking.paymentStatus === 'advance_paid' && (
              <div>
                Paid: ₹{booking.advancePayment.toLocaleString()} | 
                Remaining: ₹{booking.remainingPayment.toLocaleString()}
              </div>
            )}
            {booking.paymentStatus === 'full_paid' && (
              <div>Total Paid: ₹{booking.totalAmount.toLocaleString()}</div>
            )}
          </div>
        </div>

        {/* OTP Workflow */}
        {booking.paymentStatus === 'full_paid' && (
          <div className="space-y-4">
            {booking.status === 'full_paid' && (
              <div className="p-4 border-2 border-dashed border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Start Service</span>
                </div>
                {userRole === 'employer' ? (
                  <div className="text-sm text-muted-foreground">
                    Share the Start OTP with the service provider to begin the service.
                    <div className="mt-2 p-2 bg-green-100 rounded text-green-800 font-mono">
                      Start OTP: {booking.startOtp}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Get the Start OTP from the client to begin the service.
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Start OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        maxLength={4}
                      />
                      <Button onClick={handleStartService} disabled={otpInput.length !== 4}>
                        Start
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {booking.status === 'in_progress' && (
              <div className="p-4 border-2 border-dashed border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Service In Progress</span>
                </div>
                {userRole === 'employer' ? (
                  <div className="text-sm text-muted-foreground">
                    Service is currently in progress. Share the End OTP when service is completed.
                    <div className="mt-2 p-2 bg-orange-100 rounded text-orange-800 font-mono">
                      End OTP: {booking.endOtp}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Get the End OTP from the client to complete the service.
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter End OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        maxLength={4}
                      />
                      <Button onClick={handleEndService} disabled={otpInput.length !== 4}>
                        Complete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {booking.status === 'completed' && userRole === 'employer' && !booking.rating && (
              <div className="p-4 border-2 border-dashed border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Rate & Review</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Review (Optional)</label>
                    <Textarea
                      placeholder="Share your experience..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleRatingSubmit} 
                    disabled={isSubmitting || rating === 0}
                    className="w-full"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    💡 Payment will be released to the freelancer after rating submission
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed with Rating */}
        {booking.rating && (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Service Completed</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= booking.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {booking.rating}/5
              </span>
            </div>
            {booking.review && (
              <p className="text-sm text-gray-700 italic">"{booking.review}"</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};