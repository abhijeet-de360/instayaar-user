import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: number;
  title: string;
  category: string;
  budget: string;
  location: string;
  description: string;
}

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bidAmount || !proposal || !estimatedDays || !acceptTerms) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Application submitted successfully!",
        description: "The employer will review your proposal and get back to you."
      });
      
      onClose();
      // Reset form
      setBidAmount('');
      setProposal('');
      setEstimatedDays('');
      setAcceptTerms(false);
    } catch (error) {
      toast({
        title: "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
        </DialogHeader>
        
        {/* Job Summary */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">{job?.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{job.budget}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job?.address}</span>
            </div>
          </div>
          <p className="text-sm">{job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bid Amount */}
          <div className="space-y-2">
            <Label htmlFor="bidAmount">Your Bid Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bidAmount"
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a competitive bid amount for this job
            </p>
          </div>

          {/* Estimated Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline">Estimated Completion Time *</Label>
            <Select value={estimatedDays} onValueChange={setEstimatedDays} required>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3 days</SelectItem>
                <SelectItem value="4-7">4-7 days</SelectItem>
                <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                <SelectItem value="1-2-months">1-2 months</SelectItem>
                <SelectItem value="3+ months">3+ months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Proposal */}
          <div className="space-y-2">
            <Label htmlFor="proposal">Cover Letter/Proposal *</Label>
            <Textarea
              id="proposal"
              placeholder="Describe your approach, relevant experience, and why you're the best fit for this job..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              {proposal.length}/500 characters
            </p>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-5">
              I agree to the terms and conditions and understand that this bid is binding once accepted by the employer.
            </Label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !acceptTerms}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};