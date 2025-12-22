import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, DollarSign, X, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { createJobApplication } from '@/store/jobApplicationSlice';
import { localService } from '@/shared/_session/local';

interface Job {
  _id: number;
  title: string;
  category: string;
  budget: string;
  location: string;
  description: string;
}

interface JobApplicationBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export const JobApplicationBottomSheet: React.FC<JobApplicationBottomSheetProps> = ({
  isOpen,
  onClose,
  job
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const jobVar = useSelector((state: RootState) => state?.jobs)
  const [formVar, setFormVar] = useState({
    bidAmount: '',
    coverLetter: ''
  });

  useEffect(() => {
    setFormVar((prev) => ({
      ...prev,
      bidAmount: job?.budget || ''
    }));
  }, [job?.budget]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formVar?.bidAmount || !formVar?.coverLetter) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // setIsSubmitting(true);

    dispatch(createJobApplication(job?._id, formVar, localService.get('lat'), localService.get('lng'))).then((res) => {
      onClose();
    })
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        {/* <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>Apply for Job</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader> */}

        <div className="px-4 pb-4 overflow-y-auto">
          {/* Job Summary */}
          {/* <div className="bg-muted/50 p-3 rounded-lg mb-4 space-y-2">
            <h3 className="font-semibold capitalize">{job.title}</h3>
            <div className="flex items-start gap-3 text-sm text-muted-foreground flex-col">
              <div className="flex items-center gap-1">
                <span>₹{job.budget}</span>
              </div>
              <div className="flex items-start gap-1">
                <span>{job?.address}</span>
              </div>
            </div>
            <p className="text-sm line-clamp-2">{job.description}</p>
          </div> */}

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
                  value={formVar?.bidAmount}
                  onChange={(e) =>
                    setFormVar((prev) => ({
                      ...prev,                  
                      bidAmount: e.target.value
                    }))
                  }
                  className="pl-8"
                  required
                />

              </div>
            </div>

            {/* Proposal */}
            <div className="space-y-2">
              <Label htmlFor="proposal" className="text-sm">Proposal *</Label>
              <Textarea
                id="proposal"
                placeholder="Describe your approach and why you're the best fit..."
                value={formVar?.coverLetter}
                onChange={(e) =>
                    setFormVar((prev) => ({
                      ...prev,                  
                      coverLetter: e.target.value
                    }))
                  }
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                {proposal.length}/500 characters
              </p>
            </div>

            {/* Terms */}
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
                onClick={onClose}
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
                {jobVar?.status === "loading" ? 'Submiting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};