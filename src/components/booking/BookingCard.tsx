import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, MessageCircle, Phone, Star, Play, Square, Clock, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { BookingData } from '@/types/bookingTypes';
import { JobOTPBottomSheet } from '@/components/job/JobOTPBottomSheet';
import { useToast } from '@/hooks/use-toast';
import { localService } from '@/shared/_session/local';
import dayjs from "dayjs";

interface BookingCardProps {
  booking: any;
  onStatusUpdate?: (bookingId: string, newStatus: string) => void;
  onRatingSubmit?: (bookingId: string, rating: number, review: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onStatusUpdate,
  onRatingSubmit
}) => {

  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const { toast } = useToast();
  const [showOTP, setShowOTP] = useState(false);
  const [otpAction, setOtpAction] = useState<'start' | 'complete'>('start');
  const [showOTPCode, setShowOTPCode] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'default';
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

  const handleStartJob = () => {
    if (userRole === 'employer') {
      // Show OTP code to employer
      setShowOTPCode(true);
    } else {
      // Show OTP input for freelancer
      setOtpAction('start');
      setShowOTP(true);
    }
  };

  const handleCompleteJob = () => {
    if (userRole === 'employer') {
      // Show OTP code to employer
      setShowOTPCode(true);
    } else {
      // Show OTP input for freelancer
      setOtpAction('complete');
      setShowOTP(true);
    }
  };

  const handleOTPSuccess = () => {
    const newStatus = otpAction === 'start' ? 'in_progress' : 'completed';
    onStatusUpdate?.(booking.id, newStatus);

    if (otpAction === 'complete' && booking.payment.paymentMethod === 'platform') {
      // Show wallet earning notification for freelancer
      toast({
        title: "Payment Received!",
        description: `₹${booking.payment.freelancerEarning} has been added to your wallet`,
      });
    }
  };

  const canShowRating = () => {
    return userRole === 'employer' &&
      booking.status === 'completed' &&
      !booking.rating;
  };

  const shouldShowChatCall = () => {
    return booking.status !== 'completed';
  };

  const getOTPButtonText = () => {
    if (booking.status === 'confirmed') {
      return 'Start OTP';
    } else if (booking.status === 'in_progress') {
      return 'Complete OTP';
    }
    return 'OTP';
  };

  const getPaymentStatusBadge = () => {

    if (booking?.paymentType === 'full') {
      return <Badge variant="outline" className="text-green-600">Fully Paid</Badge>;
    }

    if (booking?.paymentType === 'advance' && booking?.advanceAmount) {
      return <Badge variant="secondary">Advance: ₹{booking?.advanceAmount}</Badge>;
    }
    return null;
  };

  const formatted = dayjs(booking?.date).format("DD MMM YYYY [at] hh:mm A");

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{booking?.serviceId?.title}</h3>
                <p className="text-muted-foreground">
                  {localService.get('role') === 'user'
                    ? `${booking?.freelancerId?.firstName} ${booking?.freelancerId?.lastName}`
                    : booking?.employerName}
                </p>
                {booking?.serviceId?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{booking?.serviceId?.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={getStatusColor(booking.status)}>
                  {getStatusText(booking.status)}
                </Badge>
                {getPaymentStatusBadge()}
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatted}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{booking?.serviceId?.location}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                <span className="font-semibold">₹{booking?.totalPrice}</span>
              </div>
              {booking?.paymentType == 'advance' && booking?.remainingAmount > 0 && (
                <span className="text-sm text-amber-600">
                  Remaining: ₹{booking?.remainingAmount}
                </span>
              )}
            </div>

            {/* OTP Display for User */}
            {localService.get('role') === 'user' && booking.status === 'confirmed' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Start Job OTP:</span>
                  <span className="text-lg font-mono font-bold text-blue-900">{booking.startOtp}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Share this code with freelancer to start the job</p>
              </div>
            )}

            {localService.get('role') === 'user' && booking.status === 'onGoing' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Complete Job OTP:</span>
                  <span className="text-lg font-mono font-bold text-green-900">{booking.completionOtp}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Share this code with freelancer to complete the job</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Chat and Call - Only show when job is not completed */}
              {shouldShowChatCall() && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/chat/${booking.id}`)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>

                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </>
              )}

              {/* OTP Actions for Freelancers */}
              {localService.get('role') === 'freelancer' && booking.status === 'confirmed' && (
                <Button size="sm" onClick={handleStartJob}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Job
                </Button>
              )}

              {localService.get('role') === 'freelancer' && booking.status === 'in_progress' && (
                <Button size="sm" onClick={handleCompleteJob}>
                  <Square className="h-4 w-4 mr-2" />
                  Complete Job
                </Button>
              )}

              {/* Rating Button - Only for employers when job is completed */}
              {canShowRating() && (
                <Button size="sm" onClick={() => {
                  // Handle rating click - could open a rating modal
                  toast({
                    title: "Rating Feature",
                    description: "Rating feature will be implemented here",
                  });
                }}>
                  <Star className="h-4 w-4 mr-2" />
                  Rate Freelancer
                </Button>
              )}

              {/* Show completed status for already rated jobs */}
              {booking.status === 'completed' && booking.rating && userRole === 'employer' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>Rated {booking.rating.score}/5</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OTP Bottom Sheet for Freelancers */}
      <JobOTPBottomSheet
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        action={otpAction}
        jobTitle={booking.serviceName}
        onSuccess={handleOTPSuccess}
      />

      {/* OTP Code Dialog for Employers */}
      <Dialog open={showOTPCode} onOpenChange={setShowOTPCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Job OTP Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Share this OTP with the freelancer to {booking.status === 'confirmed' ? 'start' : 'complete'} the job:
            </p>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary text-2xl font-mono font-bold">
                {booking.status === 'confirmed' ? '1234' : '5678'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {booking.status === 'confirmed' ? 'Start Job OTP' : 'Complete Job OTP'}
              </p>
            </div>
            <Button onClick={() => setShowOTPCode(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};