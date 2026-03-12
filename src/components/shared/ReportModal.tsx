import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const REPORT_REASONS = [
  { id: "inappropriate", label: "Inappropriate Content" },
  { id: "spam", label: "Spam or Misleading" },
  { id: "harassment", label: "Harassment or Bullying" },
  { id: "fake", label: "Fake Profile or Job" },
  { id: "other", label: "Other" },
];

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details?: string) => void;
  title?: string;
}

export const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Report",
}: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call or give time for parent to handle
      await onSubmit(selectedReason, details);
      // Reset form on success
      setSelectedReason("");
      setDetails("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedReason("");
      setDetails("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please select a reason for reporting. This information will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <RadioGroup 
            value={selectedReason} 
            onValueChange={setSelectedReason}
            className="space-y-3"
          >
            {REPORT_REASONS.map((reason) => (
              <div key={reason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.id} id={reason.id} />
                <Label htmlFor={reason.id} className="cursor-pointer font-normal">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === "other" && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea
                id="details"
                placeholder="Please describe the issue..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="resize-none h-24"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedReason || isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
