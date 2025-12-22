import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Search, Filter, CreditCard, TrendingUp, DollarSign, RefreshCw, IndianRupee, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentData } from '@/types/paymentTypes';
import paymentData from '@/data/paymentData.json';

const ITEMS_PER_PAGE = 10;

export const PaymentManagement: React.FC = () => {
  const [allPayments] = useState<PaymentData[]>(paymentData.payments as PaymentData[]);
  const [displayedPayments, setDisplayedPayments] = useState<PaymentData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const navigate = useNavigate();

  const observerRef = useRef<IntersectionObserver>();
  const lastPaymentRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMorePayments();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage]);

  // Filter payments based on current filters
  const getFilteredPayments = useCallback(() => {
    return allPayments.filter(payment => {
      const matchesSearch = !searchTerm ||
        payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || payment.paymentStatus === statusFilter;
      const matchesType = paymentTypeFilter === 'all' || payment.paymentType === paymentTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allPayments, searchTerm, statusFilter, paymentTypeFilter]);

  // Load more payments (simulate infinite scroll)
  const loadMorePayments = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const filteredPayments = getFilteredPayments();
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newPayments = filteredPayments.slice(startIndex, endIndex);
      
      if (newPayments.length > 0) {
        setDisplayedPayments(prev => [...prev, ...newPayments]);
        setCurrentPage(prev => prev + 1);
        setHasNextPage(endIndex < filteredPayments.length);
      } else {
        setHasNextPage(false);
      }
      
      setIsLoading(false);
    }, 500);
  }, [currentPage, isLoading, hasNextPage, getFilteredPayments]);

  // Reset payments when filters change
  useEffect(() => {
    const filteredPayments = getFilteredPayments();
    const initialPayments = filteredPayments.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedPayments(initialPayments);
    setCurrentPage(2);
    setHasNextPage(filteredPayments.length > ITEMS_PER_PAGE);
  }, [searchTerm, statusFilter, paymentTypeFilter, getFilteredPayments]);

  // Initial load
  useEffect(() => {
    const filteredPayments = getFilteredPayments();
    const initialPayments = filteredPayments.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedPayments(initialPayments);
    setCurrentPage(2);
    setHasNextPage(filteredPayments.length > ITEMS_PER_PAGE);
  }, []);

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

  // Calculate stats
  const totalRevenue = allPayments.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + p.platformFee, 0);
  const totalPayments = allPayments.filter(p => p.paymentStatus === 'completed').length;
  const pendingPayments = allPayments.filter(p => p.paymentStatus === 'pending').length;
  const refundedAmount = allPayments.filter(p => p.paymentStatus === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payment Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5 mr-1" />
              {totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Platform fees collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5 mr-1" />
              {refundedAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total refunds processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="advance">Advance</SelectItem>
                <SelectItem value="full">Full Payment</SelectItem>
                <SelectItem value="remaining">Remaining</SelectItem>
                <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments (Infinite Scroll Enabled)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {displayedPayments.length} of {getFilteredPayments().length} payments
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Platform Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPayments.map((payment, index) => (
                <TableRow 
                  key={payment.id}
                  ref={index === displayedPayments.length - 1 ? lastPaymentRef : null}
                >
                  <TableCell>
                    <div className="font-mono text-sm">{payment.transactionId}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.employerName}</div>
                      <div className="text-sm text-muted-foreground">{payment.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.serviceName}</div>
                      <div className="text-sm text-muted-foreground">{payment.serviceCategory}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {payment.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of ₹{payment.totalBookingAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaymentTypeBadge(payment.paymentType)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{payment.paymentMethod}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Pending'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium flex items-center">
                      <IndianRupee className="w-3 h-3 mr-1" />
                      {payment.platformFee.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/payment/${payment.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading more payments...</span>
            </div>
          )}
          
          {/* End of data indicator */}
          {!hasNextPage && displayedPayments.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>You've reached the end of the payments list.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};