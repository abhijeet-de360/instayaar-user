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
  ArrowLeft, CreditCard, Calendar, MapPin, DollarSign, 
  RefreshCw, CheckCircle, XCircle, User, Building2, 
  Menu, X, IndianRupee, Receipt, Clock, TrendingUp 
} from 'lucide-react';
import { PaymentData } from '@/types/paymentTypes';
import paymentData from '@/data/paymentData.json';

const PaymentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Find payment from JSON data
    const foundPayment = paymentData.payments.find(p => p.id === id) as PaymentData | undefined;
    if (foundPayment) {
      setPayment(foundPayment);
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
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    } as const;

    const colors = {
      completed: 'text-green-700 bg-green-100',
      pending: 'text-yellow-700 bg-yellow-100',
      failed: 'text-red-700 bg-red-100',
      refunded: 'text-blue-700 bg-blue-100'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  const getPaymentTypeBadge = (type: string) => {
    const colors = {
      advance: 'text-orange-700 bg-orange-100',
      full: 'text-green-700 bg-green-100',
      remaining: 'text-blue-700 bg-blue-100',
      cash_on_delivery: 'text-purple-700 bg-purple-100'
    };

    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  if (!payment) {
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
              onClick={() => navigate('/admin?tab=payments')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold text-primary-foreground">Payment Details</h1>
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
                activeTab="payments"
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
                  <CardTitle className="text-xl">{payment.serviceName}</CardTitle>
                  <p className="text-muted-foreground">{payment.serviceCategory}</p>
                </div>
                {getStatusBadge(payment.paymentStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Amount */}
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold flex items-center justify-center">
                  <IndianRupee className="w-8 h-8 mr-2" />
                  {payment.amount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getPaymentTypeBadge(payment.paymentType)} • {payment.paymentMethod}
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <h3 className="font-semibold mb-2">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{payment.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gateway:</span>
                    <span>{payment.paymentGateway || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Date:</span>
                    <span>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'Pending'}</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div>
                <h3 className="font-semibold mb-2">Fee Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>₹{payment.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>₹{payment.processingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span>₹{payment.taxes.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Net Amount:</span>
                    <span>₹{payment.netAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Refund Information */}
              {payment.refundStatus && (
                <div>
                  <h3 className="font-semibold mb-2">Refund Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Refund Status:</span>
                      <Badge variant="outline">{payment.refundStatus}</Badge>
                    </div>
                    {payment.refundDate && (
                      <div className="flex justify-between">
                        <span>Refund Date:</span>
                        <span>{new Date(payment.refundDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {payment.refundAmount && (
                      <div className="flex justify-between">
                        <span>Refund Amount:</span>
                        <span className="font-medium">₹{payment.refundAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {payment.refundReason && (
                      <div>
                        <span className="font-medium">Reason:</span>
                        <p className="text-muted-foreground mt-1">{payment.refundReason}</p>
                      </div>
                    )}
                  </div>
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
        activeTab="payments"
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
                  onClick={() => navigate('/admin?tab=payments')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Payments
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Payment Details</h1>
                  <p className="text-muted-foreground">Transaction ID: {payment.transactionId}</p>
                </div>
              </div>
              {getStatusBadge(payment.paymentStatus)}
            </div>

            {/* Payment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold flex items-center justify-center mb-2">
                        <IndianRupee className="w-10 h-10 mr-2" />
                        {payment.amount.toLocaleString()}
                      </div>
                      <div className="space-y-1">
                        {getPaymentTypeBadge(payment.paymentType)}
                        <p className="text-sm text-muted-foreground">{payment.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Payment Date: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'Pending'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Service Location: {payment.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Service Date: {new Date(payment.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Receipt className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Gateway: {payment.paymentGateway || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">{payment.serviceName}</h3>
                  <p className="text-muted-foreground">{payment.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* People Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Employer (Payer)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{payment.employerName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {payment.employerId}</p>
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
                    <span>Freelancer (Service Provider)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{payment.freelancerName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {payment.freelancerId}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Financial Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Payment Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Payment Amount:</span>
                        <span className="font-semibold">₹{payment.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Booking Amount:</span>
                        <span>₹{payment.totalBookingAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Payment Progress:</span>
                        <span>{Math.round((payment.amount / payment.totalBookingAmount) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Fee Structure</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Platform Fee:</span>
                        <span className="font-medium">₹{payment.platformFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>₹{payment.processingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & GST:</span>
                        <span>₹{payment.taxes.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Net Amount to Freelancer:</span>
                        <span>₹{payment.netAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5" />
                  <span>Transaction Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-sm">{payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking ID:</span>
                      <span className="font-mono text-sm">{payment.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Gateway:</span>
                      <span>{payment.paymentGateway || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gateway Transaction ID:</span>
                      <span className="font-mono text-sm">{payment.gatewayTransactionId || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{payment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Type:</span>
                      {getPaymentTypeBadge(payment.paymentType)}
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getStatusBadge(payment.paymentStatus)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Information (if applicable) */}
            {payment.refundStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5" />
                    <span>Refund Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Refund Status:</span>
                          <Badge variant="outline">{payment.refundStatus}</Badge>
                        </div>
                        {payment.refundDate && (
                          <div className="flex justify-between">
                            <span>Refund Date:</span>
                            <span>{new Date(payment.refundDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {payment.refundAmount && (
                          <div className="flex justify-between">
                            <span>Refund Amount:</span>
                            <span className="font-semibold">₹{payment.refundAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {payment.refundReason && (
                      <div>
                        <h4 className="font-medium mb-2">Refund Reason</h4>
                        <p className="text-muted-foreground p-3 bg-muted rounded-lg">{payment.refundReason}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentDetails;