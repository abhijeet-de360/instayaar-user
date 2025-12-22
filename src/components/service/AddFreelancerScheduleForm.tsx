import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface AddFreelancerScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: {
    _id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    duration: number;
  }) => void;
}

const days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export function AddFreelancerScheduleForm({
  isOpen,
  onClose,
  onSave,
}: AddFreelancerScheduleFormProps) {
  const [formData, setFormData] = useState<{
    dayOfWeek: number | undefined;
    startTime: string;
    endTime: string;
  }>({
    dayOfWeek: undefined,
    startTime: "",
    endTime: "",
  });

  if (!isOpen) return null;

  const getDurationInMinutes = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    return endH * 60 + endM - (startH * 60 + startM);
  };

  const handleSubmit = () => {
    if (formData.dayOfWeek === undefined || !formData.startTime || !formData.endTime) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (formData.startTime >= formData.endTime) {
      toast({ title: "Error", description: "End time must be after start time", variant: "destructive" });
      return;
    }

    const newSchedule = {
      _id: crypto.randomUUID(),
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: getDurationInMinutes(formData.startTime, formData.endTime),
    };

    onSave(newSchedule);
    // toast({ title: "Success", description: "Schedule added successfully" });

    setFormData({ dayOfWeek: undefined, startTime: "", endTime: "" });
    onClose();
  };

  const handleClose = () => {
    setFormData({ dayOfWeek: undefined, startTime: "", endTime: "" });
    onClose();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Day selector */}
          <div>
            <Select
              value={formData.dayOfWeek !== undefined ? formData.dayOfWeek.toString() : ""}
              onValueChange={(value) =>
                setFormData({ ...formData, dayOfWeek: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day, index) => (
                  <SelectItem key={day} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Time From</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="endTime">Time To</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancel
            </Button>
            <Button onClick={handleSubmit} size="sm">
              Create Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
