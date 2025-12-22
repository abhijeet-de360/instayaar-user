import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { completeBooking, startBooking } from '@/store/bookingSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

interface JobOTPBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'start' | 'complete';
  jobTitle: string;
  onSuccess: () => void;
  otp: string;
  setOtp: (val: string) => void;
  jobId: string;
  service?: {
    bookingDate?: string | number | Date | null;
    [key: string]: any;
  };
}

export const JobOTPBottomSheet: React.FC<JobOTPBottomSheetProps> = ({
  isOpen,
  onClose,
  action,
  jobTitle,
  onSuccess,
  otp,
  setOtp,
  jobId,
  service,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  // Compute allowed start date = bookingDate + 1 day
  const getAllowedStartDate = (): Date | null => {
    if (!service?.bookingDate) return null;
    const b = new Date(service.bookingDate);
    if (isNaN(b.getTime())) return null;
    const allowed = new Date(b);
    allowed.setDate(allowed.getDate());
    // zero out hours/minutes/seconds for date-only comparison
    allowed.setHours(0, 0, 0, 0);
    return allowed;
  };

  const allowedStartDate = getAllowedStartDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isAllowed = allowedStartDate ? today >= allowedStartDate : true;

  const formatDateFriendly = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleStart = async () => {
    if (!isAllowed) {
      toast({ title: 'Not allowed yet', description: `You can start on ${formatDateFriendly(allowedStartDate)}` });
      return;
    }
    try {
      setIsSubmitting(true);
      if (action === 'complete') {
        const success = await dispatch(completeBooking(jobId, otp) as any);
        if (success) {
          onClose();
          setOtp('');
          onSuccess?.();
        }
      } else {
        const success = await dispatch(startBooking(jobId, otp) as any);
        if (success) {
          onClose();
          onSuccess?.();
        }
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-none" />

        {/* If allowed => show OTP inputs, else show informative message */}
        {isAllowed ? (
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
                <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
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
        ) : (
          <div className="px-4 py-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-semibold">Not ready to start</div>
              <div className="text-muted-foreground">
                You can start this service on <strong>{formatDateFriendly(allowedStartDate)}</strong> or after.
              </div>
              {/* <div className="flex justify-center pt-4">
                <Button onClick={onClose}>Close</Button>
              </div> */}
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};
