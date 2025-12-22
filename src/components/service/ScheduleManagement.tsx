import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Check,
  X,
} from "lucide-react";
import { AddFreelancerScheduleForm } from "@/components/service/AddFreelancerScheduleForm";
import { Label } from "../ui/label";

export default function ScheduleManagement({
  setFormData,
  initialSchedules = [],
}) {
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [freelancerSchedules, setFreelancerSchedules] = useState<any[]>([]);
  const [editFormData, setEditFormData] = useState<{
    startTime: string;
    endTime: string;
  }>({
    startTime: "",
    endTime: "",
  });

  // ✅ Update schedule
  const handleUpdateSchedule = () => {
    if (!editingSchedule) return;
    const { startTime, endTime } = editFormData;

    if (startTime >= endTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    if (hasOverlap(editingSchedule.dayOfWeek, startTime, endTime, editingSchedule._id)) {
      toast({
        title: "Error",
        description: "This time slot overlaps or touches another existing slot.",
        variant: "destructive",
      });
      return;
    }

    setFreelancerSchedules((prev) =>
      prev.map((s) =>
        s._id === editingSchedule._id
          ? { ...s, startTime, endTime }
          : s
      )
    );

    setEditingSchedule(null);
    toast({
      title: "Success",
      description: "Schedule updated successfully",
    });
  };


  // ✅ Delete schedule
  const handleDeleteSchedule = (id: string) => {
    setFreelancerSchedules((prev) => prev.filter((s) => s._id !== id));
    toast({
      title: "Success",
      description: "Schedule deleted successfully",
    });
  };

  useEffect(() => {
    if (initialSchedules && initialSchedules.length > 0) {
      setFreelancerSchedules(initialSchedules);
    }
  }, [initialSchedules]);

  const handleCancelEdit = () => {
    setEditingSchedule(null);
    setEditFormData({
      startTime: "",
      endTime: "",
    });
  };

  // ✅ Format time properly (with leading zeros)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const displayMinutes = minutes.padStart(2, "0");
    return `${displayHour}:${displayMinutes} ${ampm}`;
  };

  const allDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const groupedSchedules = allDays.reduce((acc, day, index) => {
    acc[day] = freelancerSchedules.filter((s) => s.dayOfWeek === index);
    return acc;
  }, {} as Record<string, any[]>);

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      schedules: freelancerSchedules,
    }));
  }, [freelancerSchedules, setFormData]);

  useEffect(() => {
    if (initialSchedules && initialSchedules.length > 0) {
      setFreelancerSchedules(initialSchedules);
    }
  }, [initialSchedules]);

  const hasOverlap = (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: string
  ) => {
    const newStart = new Date(`1970-01-01T${startTime}:00`).getTime();
    const newEnd = new Date(`1970-01-01T${endTime}:00`).getTime();

    return freelancerSchedules.some((slot) => {
      if (slot.dayOfWeek !== dayOfWeek) return false;
      if (excludeId && slot._id === excludeId) return false;

      const slotStart = new Date(`1970-01-01T${slot.startTime}:00`).getTime();
      const slotEnd = new Date(`1970-01-01T${slot.endTime}:00`).getTime();

      // ❌ Reject if overlaps OR touches (same start or end)
      const overlaps = newStart < slotEnd && newEnd > slotStart;
      const touches = newStart === slotEnd || newEnd === slotStart;

      return overlaps || touches;
    });
  };



  return (
    <div className="relative">
      <div className="bg-background sticky top-0 w-full">
        <div className="w-full">
          <div className="flex items-center justify-between py-3">
            <Label>Slot Availability</Label>
            <Button
              onClick={() => {
                setIsAddingNew(true);
                setEditingSchedule(null);
              }}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full">
        {isAddingNew && (
          <AddFreelancerScheduleForm
            isOpen={isAddingNew}
            onClose={() => setIsAddingNew(false)}
            onSave={(newSchedule) => {
              const { dayOfWeek, startTime, endTime } = newSchedule;

              if (hasOverlap(dayOfWeek, startTime, endTime)) {
                toast({
                  title: "Error",
                  description: "This time slot overlaps an existing slot.",
                  variant: "destructive",
                });
                return;
              }

              setFreelancerSchedules((prev) => [...prev, newSchedule]);
              toast({
                title: "Success",
                description: "Schedule added successfully",
              });
            }}
          />

        )}

        {freelancerSchedules.length === 0 ? (
          <div className="text-center py-8 border rounded-lg shadow-sm">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg text-muted-foreground mb-2">
              No schedules yet
            </p>
            <p className="text-sm text-muted-foreground">
              Add your first schedule to get started
            </p>
          </div>
        ) : (
          allDays.map((day) => {
            const daySchedules = groupedSchedules[day] || [];
            if (daySchedules.length === 0) return null;

            return (
              <Card key={day}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {daySchedules.map((schedule) => {
                      const isEditing = editingSchedule?._id === schedule._id;
                      return (
                        <div
                          key={schedule._id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          {isEditing ? (
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="time"
                                  value={editFormData.startTime}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      startTime: e.target.value,
                                    })
                                  }
                                  className="text-sm"
                                />
                                <Input
                                  type="time"
                                  value={editFormData.endTime}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      endTime: e.target.value,
                                    })
                                  }
                                  className="text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  className="h-6 text-xs px-2"
                                >
                                  <X className="h-3 w-3 mr-1" /> Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleUpdateSchedule}
                                  className="h-6 text-xs px-2"
                                >
                                  <Check className="h-3 w-3 mr-1" /> Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <div className="text-base font-medium text-gray-900">
                                  {formatTime(schedule.startTime)} -{" "}
                                  {formatTime(schedule.endTime)}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEditingSchedule(schedule);
                                    setEditFormData({
                                      startTime: schedule.startTime,
                                      endTime: schedule.endTime,
                                    });
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDeleteSchedule(schedule._id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
