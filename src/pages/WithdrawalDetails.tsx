import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Wallet, Calendar, User, Building2, 
  CreditCard, CheckCircle, XCircle, Clock, 
  Menu, X, IndianRupee, Phone, Mail, AlertTriangle 
} from 'lucide-react';
import { WithdrawalData } from '@/types/withdrawalTypes';
import withdrawalData from '@/data/withdrawalData.json';

const WithdrawalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [withdrawal, setWithdrawal] = useState<WithdrawalData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    // Find withdrawal from JSON data
    const foundWithdrawal = withdrawalData.withdrawals.find(w => w.id === id) as WithdrawalData | undefined;
    if (foundWithdrawal) {
      setWithdrawal(foundWithdrawal);
      setAdminNotes(foundWithdrawal.adminNotes || '');
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

  const handleStatusUpdate = (newStatus: 'approved' | 'paid' | 'rejected') => {
    if (!withdrawal) return;

    // In a real app, this would make an API call
    const updatedWithdrawal = {
      ...withdrawal,
      status: newStatus,
      processedDate: new Date().toISOString(),
      processedBy: 'admin_001',
      adminNotes: adminNotes
    };

    setWithdrawal(updatedWithdrawal);

    toast({
      title: "Status Updated",
      description: `Withdrawal ${newStatus} successfully`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'outline',
      paid: 'default',
      rejected: 'destructive'
    } as const;

    const colors = {
      pending: 'text-yellow-700 bg-yellow-100',
      approved: 'text-blue-700 bg-blue-100',
      paid: 'text-green-700 bg-green-100',
      rejected: 'text-red-700 bg-red-100'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      bank_transfer: 'text-blue-700 bg-blue-100',
      upi: 'text-green-700 bg-green-100',
      wallet: 'text-purple-700 bg-purple-100'
    };

    return (
      <Badge variant="outline" className={colors[method as keyof typeof colors]}>
        {method.replace('_', ' ')}
      </Badge>
    );
  };

  if (!withdrawal) {
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
              onClick={() => navigate('/admin?tab=withdrawals')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold text-primary-foreground">Withdrawal Details</h1>
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
                activeTab="withdrawals"
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
                  <CardTitle className="text-xl">{withdrawal.freelancerName}</CardTitle>
                  <p className="text-muted-foreground">{withdrawal.freelancerEmail}</p>
                </div>
                {getStatusBadge(withdrawal.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Withdrawal Amount */}
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold flex items-center justify-center">
                  <IndianRupee className="w-8 h-8 mr-2" />
                  {withdrawal.amount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getPaymentMethodBadge(withdrawal.paymentMethod)}
                </div>
              </div>

              {/* Status Actions */}
              {withdrawal.status === 'pending' && (
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleStatusUpdate('approved')}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('paid')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Mark Paid
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    variant="destructive"
                    size="sm"
                  >
                    Reject
                  </Button>
                </div>
              )}

              {withdrawal.status === 'approved' && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleStatusUpdate('paid')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Mark as Paid
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    variant="destructive"
                    size="sm"
                  >
                    Reject
                  </Button>
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
        activeTab="withdrawals"
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
                  onClick={() => navigate('/admin?tab=withdrawals')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Withdrawals
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Withdrawal Details</h1>
                  <p className="text-muted-foreground">Request ID: {withdrawal.id}</p>
                </div>
              </div>
              {getStatusBadge(withdrawal.status)}
            </div>

            {/* Withdrawal Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Withdrawal Request</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold flex items-center justify-center mb-2">
                        <IndianRupee className="w-10 h-10 mr-2" />
                        {withdrawal.amount.toLocaleString()}
                      </div>
                      <div className="space-y-1">
                        {getPaymentMethodBadge(withdrawal.paymentMethod)}
                        <p className="text-sm text-muted-foreground">
                          Available: ₹{withdrawal.availableBalance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Request Date: {new Date(withdrawal.requestDate).toLocaleString()}</span>
                    </div>
                    {withdrawal.processedDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Processed: {new Date(withdrawal.processedDate).toLocaleString()}</span>
                      </div>
                    )}
                    {withdrawal.transactionId && (
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Transaction ID: {withdrawal.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Freelancer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Freelancer Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{withdrawal.freelancerName}</h3>
                      <p className="text-muted-foreground">ID: {withdrawal.freelancerId}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{withdrawal.freelancerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{withdrawal.freelancerPhone}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Earnings Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Earned:</span>
                        <span>₹{withdrawal.earnings.totalEarned.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fees:</span>
                        <span>₹{withdrawal.earnings.platformFees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Previous Withdrawals:</span>
                        <span>₹{withdrawal.earnings.previousWithdrawals.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Available Balance:</span>
                        <span>₹{withdrawal.availableBalance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawal.paymentMethod === 'bank_transfer' && withdrawal.bankDetails && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Bank Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Account Holder:</span>
                          <span className="font-medium">{withdrawal.bankDetails.accountHolderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Number:</span>
                          <span className="font-mono">{withdrawal.bankDetails.accountNumber}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>IFSC Code:</span>
                          <span className="font-mono">{withdrawal.bankDetails.ifscCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bank Name:</span>
                          <span>{withdrawal.bankDetails.bankName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {withdrawal.paymentMethod === 'upi' && withdrawal.upiDetails && (
                  <div className="space-y-3">
                    <h4 className="font-medium">UPI Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>UPI ID:</span>
                        <span className="font-mono">{withdrawal.upiDetails.upiId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>UPI Name:</span>
                        <span>{withdrawal.upiDetails.upiName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Admin Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this withdrawal request..."
                    className="mt-1"
                  />
                </div>

                {withdrawal.status === 'pending' && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('paid')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('rejected')}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {withdrawal.status === 'approved' && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleStatusUpdate('paid')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('rejected')}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {withdrawal.rejectionReason && (
                  <div>
                    <h4 className="font-medium mb-2">Rejection Reason</h4>
                    <p className="text-muted-foreground p-3 bg-red-50 border border-red-200 rounded-lg">
                      {withdrawal.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WithdrawalDetails;