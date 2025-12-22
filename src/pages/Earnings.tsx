
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Shield,
    Clock,
    CheckCircle,
    AlertTriangle,
    IndianRupee,
    Eye,
    Calculator
} from 'lucide-react';
import { EscrowAccount } from '@/types/escrowTypes';
import escrowData from '@/data/escrowData.json';
import { useUserRole } from "@/contexts/UserRoleContext";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getFreelancerTransactions } from '@/store/transactionSlice';


const Earnings = () => {
    const dispatch = useDispatch<AppDispatch>()
    const profileVar = useSelector((state: RootState) => state.auth)
    const transactionVar = useSelector((state: RootState) => state.transaction)
    useEffect(() => {
        dispatch(getFreelancerTransactions())
    }, [dispatch])


    const escrowAccounts = escrowData.escrowAccounts as EscrowAccount[];
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'holding':
                return <Shield className="w-4 h-4 text-blue-600" />;
            case 'released':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'disputed':
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case 'partial_release':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            default:
                return <Shield className="w-4 h-4 text-gray-600" />;
        }
    };
    const { setUserRole, setIsLoggedIn } = useUserRole();

    const handleLogin = (role: string) => {
        setIsLoggedIn(true);
        setUserRole(role as 'employer' | 'freelancer');
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            holding: 'secondary',
            released: 'default',
            disputed: 'destructive',
            partial_release: 'outline'
        } as const;

        return (
            <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    const getProgress = (escrow: EscrowAccount) => {
        const conditions = escrow.releaseConditions;
        let completed = 0;
        let total = 0;
        const isReleased = escrow.escrowStatus === 'released';

        if (conditions.requiresOTP) {
            total++;
            if (isReleased) completed++;
        }

        if (conditions.requiresRating) {
            total++;
            if (isReleased) completed++;
        }

        if (conditions.requiresAdminApproval) {
            total++;
            if (isReleased) completed++;
        }

        if (conditions.directPaymentConfirmed) {
            total++;
            completed++; // Already confirmed
        }

        return total > 0 ? (completed / total) * 100 : 0;
    };

    const isConditionCompleted = (escrow: EscrowAccount, conditionType: string) => {
        const isReleased = escrow.escrowStatus === 'released';

        switch (conditionType) {
            case 'otp':
            case 'rating':
            case 'admin':
                return isReleased;
            case 'directPayment':
                return escrow.releaseConditions.directPaymentConfirmed;
            default:
                return false;
        }
    };

    const totalEscrow = escrowAccounts.reduce((sum, escrow) => sum + escrow.platformAmount, 0);
    const totalPending = escrowAccounts
        .filter(escrow => escrow.escrowStatus === 'holding')
        .reduce((sum, escrow) => sum + escrow.netPayoutAmount, 0);

    return (
        <div className="h-screen bg-background">
            <Header onLogin={handleLogin} />
            <div className="space-y-6 p-3 h-full overflow-y-auto">
                {/* Overview Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">₹{profileVar?.freelancer?.escrowWallet?.toFixed(2) || '0.00'}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Wallet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                ₹{profileVar?.freelancer?.wallet.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Escrow Accounts List */}
                <div className="space-y-4">
                    {/* <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Escrow Accounts
                    </h3> */}

                    {transactionVar.totalfreelancerTransaction > 0 ? (
                        transactionVar.freelancerTransactionList.map((escrow, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start ">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-semibold">{escrow?.bookingId?.bookingId || escrow?.jobApplicationId?.applicationId}</div>
                                                <p className='text-sm capitalize'>{escrow?.bookingId?.serviceId?.title || escrow?.jobApplicationId?.jobId?.title}</p>
                                                <div className='flex items-center gap-2'>
                                                    <div className="text-sm text-muted-foreground">
                                                        {escrow.bookingStatus === "pending" &&
                                                            <p>Pending</p>
                                                        }
                                                        {escrow.bookingStatus === "confirmed" &&
                                                            <p>Pending</p>
                                                        }
                                                        {escrow.bookingStatus === "cancelled" &&
                                                            <p>Cancelled</p>
                                                        }
                                                        {escrow.bookingStatus === "completed" &&
                                                            <p>
                                                                Confirmed: {new Date(escrow.createdAt).toLocaleDateString()}
                                                            </p>
                                                        }
                                                        {!["pending", "confirmed", "cancelled", "completed"].includes(escrow.bookingStatus) && (
                                                            <p>Pending</p>
                                                        )}
                                                    </div>
                                                    |
                                                    <p className='text-xs'>{escrow?.userId?.firstName} {escrow?.userId?.lastName}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">₹{escrow.amount.toLocaleString()}</div>
                                            {/* {getStatusBadge(escrow.escrowStatus)} */}
                                        </div>
                                    </div>


                                    {/* Direct Payment Info */}
                                    {/* {escrow.directAmount > 0 && (
                                        <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <IndianRupee className="w-4 h-4 text-yellow-600" />
                                                <span className="font-medium text-yellow-800">Direct Payment Expected</span>
                                            </div>
                                            <p className="text-sm text-yellow-700">
                                                ₹{escrow.directAmount.toLocaleString()} to be received directly from employer
                                            </p>
                                        </div>
                                    )} */}

                                    {/* Actions */}
                                    {/* <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            // onClick={() => onViewDetails(escrow.id)}
                                            className="gap-1"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View Details
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="gap-1"
                                        >
                                            <Calculator className="w-3 h-3" />
                                            Payout Calculator
                                        </Button>
                                    </div> */}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">No Transactions</h3>
                                <p className="text-muted-foreground">
                                    Your escrow amount will appear here when you receive platform bookings
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            <MobileBottomNav />

        </div>

    );
};


export default Earnings