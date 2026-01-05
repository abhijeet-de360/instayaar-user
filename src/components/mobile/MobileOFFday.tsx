import React, { useState, useEffect } from "react";
import { MobileBottomNav } from "../layout/MobileBottomNav";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getFreelancerProfile, setFreelancerOffDays } from "@/store/authSlice";

const MobileOFFday = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authVar = useSelector((state: RootState) => state.auth);

  const [date, setDate] = useState<Date | null>(null);
  const [offDays, setOffDays] = useState<string[]>([]);
  const [initialOffDays, setInitialOffDays] = useState<string[]>([]);
  const [showMobileAuth, setShowMobileAuth] = useState(false);

  const handleMobileProfileClick = () => setShowMobileAuth(true);

  // ----------------------------
  // DATE HELPERS
  // ----------------------------
  const toServerDate = (dateObj: Date | null) => {
    if (!dateObj) return null;
    const utcDate = new Date(
      Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
    );
    return utcDate.toISOString().replace("Z", "+00:00");
  };

  const fromServerDate = (isoString: string) => new Date(isoString);

  const sortDatesAsc = (dates: string[]) =>
    [...dates].sort(
      (a, b) =>
        new Date(a).getTime() - new Date(b).getTime()
    );

  // ----------------------------
  // LOAD PROFILE
  // ----------------------------
  useEffect(() => {
    dispatch(getFreelancerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (authVar?.freelancer?.blackoutDates) {
      const sorted = sortDatesAsc(authVar.freelancer.blackoutDates);
      setOffDays(sorted);
      setInitialOffDays(sorted);
    }
  }, [authVar?.freelancer?.blackoutDates]);

  // ----------------------------
  // ACTIONS
  // ----------------------------
  const handleAddOffDay = () => {
    if (!date) return;
    const serverDate = toServerDate(date);
    if (!serverDate) return;

    if (!offDays.includes(serverDate)) {
      setOffDays(prev =>
        sortDatesAsc([...prev, serverDate])
      );
    }
  };

  const handleRemoveOffDay = (removeDate: string) => {
    setOffDays(prev =>
      sortDatesAsc(prev.filter(d => d !== removeDate))
    );
  };

  const handleSaveOffDay = async (days: string[]) => {
    const sortedDays = sortDatesAsc(days);
    await dispatch(setFreelancerOffDays(sortedDays));
    setInitialOffDays(sortedDays); // reset baseline after save
  };

  const blackoutDatesAsDate = offDays.map(fromServerDate);

  // Detect unsaved changes
  const hasChanges =
    JSON.stringify(offDays) !== JSON.stringify(initialOffDays);

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="md:hidden h-screen flex flex-col justify-between bg-white overflow-y-auto">
      {/* Header */}
      <div className="shadow h-12 flex items-center gap-2 px-4 sticky top-0 bg-white z-10">
        <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <p className="text-sm font-medium">Blocked Dates</p>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto pb-20">
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={{
                  blackout: blackoutDatesAsDate,
                }}
                modifiersStyles={{
                  blackout: {
                    backgroundColor: "#dc2626",
                    color: "white",
                    borderRadius: "13%",
                  },
                }}
                disabled={[
                  { before: new Date() },
                  {
                    after: new Date(
                      new Date().setDate(new Date().getDate() + 90)
                    ),
                  },
                ]}
                className="rounded-md"
                initialFocus
              />
            </div>

            <Button
              className="mt-3 w-full text-white"
              onClick={handleAddOffDay}
              disabled={!date}
            >
              Add Blocked Date
            </Button>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="p-0 border-none shadow-none">
          <CardContent className="p-0">
            <p className="text-sm mb-2 font-medium text-gray-700">
              Your Blocked Dates
            </p>

            {offDays.length === 0 ? (
              <div className="border h-20 rounded-md flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">No off-days selected</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 overflow-y-auto py-2 px-2">
                {offDays.map((serverDate, idx) => {
                  const d = fromServerDate(serverDate);
                  return (
                    <div
                      key={idx}
                      className="relative border border-primary rounded-lg flex flex-col items-center justify-center p-2 text-center"
                    >
                      <button
                        onClick={() => handleRemoveOffDay(serverDate)}
                        className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 8.586L4.293 2.879A1 1 0 102.879 4.293L8.586 10l-5.707 5.707a1 1 0 101.414 1.414L10 11.414l5.707 5.707a1 1 0 001.414-1.414L11.414 10l5.707-5.707a1 1 0 00-1.414-1.414L10 8.586z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <p className="text-xs font-semibold text-primary">
                        {format(d, "MMM")}
                      </p>
                      <p className="text-lg font-bold leading-none">
                        {format(d, "dd")}
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {format(d, "yyyy")}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {hasChanges && (
          <Button
            className="w-full text-white mt-4"
            onClick={() => handleSaveOffDay(offDays)}
          >
            Save Blocked Dates
          </Button>
        )}
      </div>

      <MobileBottomNav onProfileClick={handleMobileProfileClick} />
    </div>
  );
};

export default MobileOFFday;
