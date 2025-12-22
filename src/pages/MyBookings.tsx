import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookingCard } from "@/components/booking/BookingCard";
import { BookingData } from "@/types/bookingTypes";
import MobileMyBookings from "@/components/mobile/MobileMyBookings";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAllBooking } from "@/store/bookingSlice";
import { localService } from "@/shared/_session/local";

const MyBookings = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const bookingVar = useSelector((state: RootState) => state?.booking)

  const handleLogin = (role: string) => {
    // setIsLoggedIn(true);
    // setUserRole(role as 'employer' | 'freelancer');
  };


  useEffect(() => {
    dispatch(getAllBooking())
  }, [])

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus as any, updatedAt: new Date().toISOString() }
        : booking
    ));
    
    toast({
      title: "Status Updated",
      description: `Booking status updated to ${newStatus}`,
    });
  };

  const handleRatingSubmit = (bookingId: string, rating: number, review: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            rating: { 
              score: rating, 
              review, 
              ratedAt: new Date().toISOString() 
            } 
          }
        : booking
    ));
    
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    });
  };

  // Use mobile component on small screens after all hooks are called
  if (isMobile) {
    return <MobileMyBookings />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">
                {localService.get('role') === 'user' ? 'Manage your service bookings' : 'Track your work assignments'}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {bookingVar.bookingData.length > 0 ? (bookingVar.bookingData.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onStatusUpdate={handleStatusUpdate}
                  onRatingSubmit={handleRatingSubmit}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No bookings yet</h3>
                    <p className="text-muted-foreground">
                      {localService.get('role') === 'user' 
                        ? 'Start by browsing services and booking freelancers'
                        : 'Apply to jobs to start receiving bookings'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MyBookings;