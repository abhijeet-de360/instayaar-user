import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  Download, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Star,
  Filter
} from 'lucide-react';
import type { WalletTransaction, WithdrawalRequest } from '@/types/freelancerTypes';

interface WalletDashboardProps {
  balance: {
    available: number;
    pending: number;
    total: number;
  };
  transactions: WalletTransaction[];
  withdrawalRequests: WithdrawalRequest[];
  onWithdrawalRequest: (amount: number) => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
  balance,
  transactions,
  withdrawalRequests,
  onWithdrawalRequest,
}) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit' | 'pending'>('all');

  const handleWithdrawal = () => {
    const amount = parseInt(withdrawalAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > balance.available) {
      alert('Insufficient balance');
      return;
    }
    if (amount < 100) {
      alert('Minimum withdrawal amount is ₹100');
      return;
    }

    onWithdrawalRequest(amount);
    setWithdrawalAmount('');
    setShowWithdrawalForm(false);
  };

  const filteredTransactions = transactions.filter(transaction => 
    filterType === 'all' || transaction.type === filterType
  );

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'credit': return <ArrowDownCircle className="w-4 h-4 text-green-600" />;
      case 'debit': return <ArrowUpCircle className="w-4 h-4 text-red-600" />;
      case 'withdrawal': return <Download className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTransactionColor = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'credit': return 'text-green-600';
      case 'debit': return 'text-red-600';
      case 'withdrawal': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{balance.available.toLocaleString()}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Earnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ₹{balance.pending.toLocaleString()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{balance.total.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowWithdrawalForm(true)}
              disabled={balance.available < 100}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Withdraw Funds
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Methods
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Pending Ratings
            </Button>
          </div>
          {balance.available < 100 && (
            <p className="text-sm text-muted-foreground mt-2">
              Minimum withdrawal amount is ₹100
            </p>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {showWithdrawalForm && (
        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (₹)</label>
              <Input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount"
                max={balance.available}
              />
              <div className="text-sm text-muted-foreground mt-1">
                Available: ₹{balance.available.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm">
                <p className="font-medium mb-1">Bank Details</p>
                <p>HDFC Bank - ****1234</p>
                <p>IFSC: HDFC0001234</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleWithdrawal}>
                Request Withdrawal
              </Button>
              <Button variant="outline" onClick={() => setShowWithdrawalForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="credit">Credits</option>
                  <option value="debit">Debits</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'debit' || transaction.type === 'withdrawal' ? '-' : '+'}
                        ₹{transaction.amount.toLocaleString()}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawalRequests.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">₹{withdrawal.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Requested on {new Date(withdrawal.requestDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {withdrawal.bankDetails.bankName} - {withdrawal.bankDetails.accountNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(withdrawal.status)}
                    </div>
                  </div>
                ))}
                {withdrawalRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No withdrawal requests
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Earnings Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">How Earnings Work</h4>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>• Payments are released after client provides rating</p>
                <p>• Platform fee (10%) is deducted from total payment</p>
                <p>• Minimum withdrawal amount is ₹100</p>
                <p>• Withdrawals are processed within 1-3 business days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};