import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, User, Calendar, MapPin, CreditCard, Star, 
 Phone, Mail, Clock, DollarSign, Shield, Menu, X 
} from 'lucide-react';
import { BookingData } from '@/types/bookingTypes';
import bookingData from '@/data/bookingData.json';

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Find booking from JSON data
    const foundBooking = bookingData.bookings.find(b => b.id === id) as BookingData | undefined;
    if (foundBooking) {
      setBooking(foundBooking);
    }
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      in_progress: 'outline',
      completed: 'default',
      cancelled: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      advance_paid: 'outline',
      fully_paid: 'default'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (!booking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isMobile) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-primary shadow-sm border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin?tab=bookings')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold text-primary-foreground">Booking Details</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <div className="w-64 h-full bg-primary" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar
                activeTab="bookings"
                setActiveTab={(tab) => {
                  setSidebarOpen(false);
                  navigate(`/admin?tab=${tab}`);
                }}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* Mobile Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{booking.serviceName}</CardTitle>
                  <p className="text-muted-foreground">{booking.serviceCategory}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Details */}
              <div>
                <h3 className="font-semibold mb-2">Service Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.bookingDate} at {booking.bookingTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.location}</span>
                  </div>
                </div>
              </div>

              {/* Freelancer & Employer */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Freelancer</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.freelancerName}</p>
                      <p className="text-sm text-muted-foreground">ID: {booking.freelancerId}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Employer</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.employerName}</p>
                      <p className="text-sm text-muted-foreground">ID: {booking.employerId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">${booking.payment.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    {getPaymentStatusBadge(booking.payment.paymentStatus)}
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span className="font-medium">${booking.payment.platformFee || 0}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              {booking.rating && (
                <div>
                  <h3 className="font-semibold mb-2">Rating & Review</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{booking.rating.score}/5</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.rating.review}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <AdminSidebar
        activeTab="bookings"
        setActiveTab={(tab) => navigate(`/admin?tab=${tab}`)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <main className="p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin?tab=bookings')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Bookings
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Booking Details</h1>
                  <p className="text-muted-foreground">Booking ID: {booking.id}</p>
                </div>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Service Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                    <p className="text-muted-foreground">{booking.serviceCategory}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.bookingDate} at {booking.bookingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                </div>
                {booking.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{booking.description}</p>
                  </div>
                )}
                {booking.requirements && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <p className="text-muted-foreground">{booking.requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* People Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Freelancer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{booking.freelancerName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {booking.freelancerId}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Employer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{booking.employerName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {booking.employerId}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">${booking.payment.totalAmount}</span>
                    </div>
                    {booking.payment.advanceAmount && (
                      <div className="flex justify-between">
                        <span>Advance Paid:</span>
                        <span className="font-medium">${booking.payment.advanceAmount}</span>
                      </div>
                    )}
                    {booking.payment.remainingAmount && (
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-medium">${booking.payment.remainingAmount}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <Badge variant="outline">{booking.payment.paymentMethod}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      {getPaymentStatusBadge(booking.payment.paymentStatus)}
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span className="font-medium">${booking.payment.platformFee || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freelancer Earning:</span>
                      <span className="font-semibold">${booking.payment.freelancerEarning || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OTP Details */}
            {booking.otp.otpGenerated && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>OTP Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {booking.otp.startOTP && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Start OTP</h4>
                        <p className="font-mono text-lg">{booking.otp.startOTP}</p>
                      </div>
                    )}
                    {booking.otp.endOTP && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">End OTP</h4>
                        <p className="font-mono text-lg">{booking.otp.endOTP}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rating & Review */}
            {booking.rating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Rating & Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= booking.rating!.score
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{booking.rating.score}/5</span>
                    </div>
                    <p className="text-muted-foreground">{booking.rating.review}</p>
                    <p className="text-xs text-muted-foreground">
                      Rated on {new Date(booking.rating.ratedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(booking.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{new Date(booking.updatedAt).toLocaleString()}</span>
                  </div>
                  {booking.completedAt && (
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span>{new Date(booking.completedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookingDetails;
