import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Search, Filter, Calendar, MapPin, User, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookingData } from '@/types/bookingTypes';
import bookingData from '@/data/bookingData.json';

const ITEMS_PER_PAGE = 10;

export const BookingManagement: React.FC = () => {
  const [allBookings] = useState<BookingData[]>(bookingData.bookings as BookingData[]);
  const [displayedBookings, setDisplayedBookings] = useState<BookingData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const observerRef = useRef<IntersectionObserver>();
  const lastBookingRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMoreBookings();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage]);

  // Filter bookings based on current filters
  const getFilteredBookings = useCallback(() => {
    return allBookings.filter(booking => {
      const matchesSearch = !searchTerm || 
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allBookings, searchTerm, statusFilter]);

  // Load more bookings (simulate infinite scroll)
  const loadMoreBookings = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const filteredBookings = getFilteredBookings();
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newBookings = filteredBookings.slice(startIndex, endIndex);
      
      if (newBookings.length > 0) {
        setDisplayedBookings(prev => [...prev, ...newBookings]);
        setCurrentPage(prev => prev + 1);
        setHasNextPage(endIndex < filteredBookings.length);
      } else {
        setHasNextPage(false);
      }
      
      setIsLoading(false);
    }, 500);
  }, [currentPage, isLoading, hasNextPage, getFilteredBookings]);

  // Reset bookings when filters change
  useEffect(() => {
    const filteredBookings = getFilteredBookings();
    const initialBookings = filteredBookings.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedBookings(initialBookings);
    setCurrentPage(2);
    setHasNextPage(filteredBookings.length > ITEMS_PER_PAGE);
  }, [searchTerm, statusFilter, getFilteredBookings]);

  // Initial load
  useEffect(() => {
    const filteredBookings = getFilteredBookings();
    const initialBookings = filteredBookings.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedBookings(initialBookings);
    setCurrentPage(2);
    setHasNextPage(filteredBookings.length > ITEMS_PER_PAGE);
  }, []);

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

  const filteredBookings = getFilteredBookings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Booking Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allBookings.filter(b => b.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allBookings.filter(b => b.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${allBookings.reduce((sum, b) => sum + (b.payment.platformFee || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings (Infinite Scroll Enabled)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {displayedBookings.length} of {filteredBookings.length} bookings
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedBookings.map((booking, index) => (
                <TableRow 
                  key={booking.id}
                  ref={index === displayedBookings.length - 1 ? lastBookingRef : null}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.serviceName}</div>
                      <div className="text-sm text-muted-foreground">{booking.serviceCategory}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{booking.freelancerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{booking.employerName}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.bookingDate}</div>
                      <div className="text-sm text-muted-foreground">{booking.bookingTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{booking.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(booking.payment.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${booking.payment.totalAmount}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/booking/${booking.id}`)}
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
              <span className="ml-2 text-muted-foreground">Loading more bookings...</span>
            </div>
          )}
          
          {/* End of data indicator */}
          {!hasNextPage && displayedBookings.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>You've reached the end of the bookings list.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};