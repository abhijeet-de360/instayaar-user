import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Search, Filter, Wallet, TrendingDown, Clock, CheckCircle, XCircle, IndianRupee, Download, Upload, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WithdrawalData } from '@/types/withdrawalTypes';
import withdrawalData from '@/data/withdrawalData.json';
import { useToast } from '@/hooks/use-toast';

export const WithdrawalManagement: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<WithdrawalData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load withdrawal data from JSON file
    setWithdrawals(withdrawalData.withdrawals as WithdrawalData[]);
    setFilteredWithdrawals(withdrawalData.withdrawals as WithdrawalData[]);
  }, []);

  useEffect(() => {
    let filtered = withdrawals;

    if (searchTerm) {
      filtered = filtered.filter(withdrawal =>
        withdrawal.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        withdrawal.freelancerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        withdrawal.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(withdrawal => withdrawal.status === statusFilter);
    }

    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(withdrawal => withdrawal.paymentMethod === paymentMethodFilter);
    }

    setFilteredWithdrawals(filtered);
  }, [searchTerm, statusFilter, paymentMethodFilter, withdrawals]);

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

  // Calculate stats
  const totalPendingAmount = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);
  const totalPaidAmount = withdrawals.filter(w => w.status === 'paid').reduce((sum, w) => sum + w.amount, 0);
  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const rejectedCount = withdrawals.filter(w => w.status === 'rejected').length;

  // Export functionality
  const handleExport = () => {
    const dataToExport = filteredWithdrawals.map(withdrawal => ({
      'Request ID': withdrawal.id,
      'Freelancer Name': withdrawal.freelancerName,
      'Freelancer Email': withdrawal.freelancerEmail,
      'Amount': withdrawal.amount,
      'Available Balance': withdrawal.availableBalance,
      'Payment Method': withdrawal.paymentMethod,
      'Status': withdrawal.status,
      'Request Date': new Date(withdrawal.requestDate).toLocaleDateString(),
      'Processed Date': withdrawal.processedDate ? new Date(withdrawal.processedDate).toLocaleDateString() : '',
      'Transaction ID': withdrawal.transactionId || '',
      'Admin Notes': withdrawal.adminNotes || '',
      'Bank Account': withdrawal.bankDetails?.accountNumber || '',
      'IFSC Code': withdrawal.bankDetails?.ifscCode || '',
      'Bank Name': withdrawal.bankDetails?.bankName || '',
      'UPI ID': withdrawal.upiDetails?.upiId || ''
    }));

    const csvContent = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `withdrawals_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${dataToExport.length} withdrawal records to CSV.`,
    });
  };

  // Import functionality
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        const updates: Array<{ id: string; status: string }> = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          const rowData: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });
          
          if (rowData['Request ID'] && rowData['Status']) {
            updates.push({
              id: rowData['Request ID'],
              status: rowData['Status']
            });
          }
        }

        // Simulate updating withdrawal statuses
        const updatedWithdrawals = withdrawals.map(withdrawal => {
          const update = updates.find(u => u.id === withdrawal.id);
          if (update && ['pending', 'approved', 'paid', 'rejected'].includes(update.status)) {
            return {
              ...withdrawal,
              status: update.status as 'pending' | 'approved' | 'paid' | 'rejected',
              processedDate: update.status !== 'pending' ? new Date().toISOString() : withdrawal.processedDate,
              processedBy: update.status !== 'pending' ? 'admin_import' : withdrawal.processedBy
            };
          }
          return withdrawal;
        });

        setWithdrawals(updatedWithdrawals);
        
        toast({
          title: "Import Successful",
          description: `Updated status for ${updates.length} withdrawal records.`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Error processing CSV file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  // Generate sample CSV template
  const handleDownloadTemplate = () => {
    const template = [
      'Request ID,Status',
      'withdrawal_001,paid',
      'withdrawal_002,approved',
      'withdrawal_003,rejected'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'withdrawal_status_update_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded",
      description: "Use this template to update withdrawal statuses.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Withdrawal Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download Template
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="import-csv"
            />
            <Button
              variant="default"
              className="flex items-center gap-2"
              asChild
            >
              <label htmlFor="import-csv" className="cursor-pointer">
                <Upload className="w-4 h-4" />
                Import CSV
              </label>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5 mr-1" />
              {totalPendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5 mr-1" />
              {totalPaidAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Declined requests</p>
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
                  placeholder="Search withdrawals..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Withdrawal Requests 
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredWithdrawals.length} records)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Available Balance</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Processed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    <div className="font-mono text-sm">{withdrawal.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{withdrawal.freelancerName}</div>
                      <div className="text-sm text-muted-foreground">{withdrawal.freelancerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {withdrawal.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {withdrawal.availableBalance.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodBadge(withdrawal.paymentMethod)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(withdrawal.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {withdrawal.processedDate ? new Date(withdrawal.processedDate).toLocaleDateString() : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/withdrawal/${withdrawal.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};