import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FreelancerWallet } from "@/components/freelancer/FreelancerWallet";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getFreelancerProfile } from "@/store/authSlice";
import { getAllWalletWidthrawal } from "@/store/widthrawalSlice";

const Wallet = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const authVar = useSelector((state: RootState) => state?.auth)
  const dispatch = useDispatch<AppDispatch>()


  useEffect(() => {
    dispatch(getFreelancerProfile())
    dispatch(getAllWalletWidthrawal())
  }, [])

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

  // Mock wallet data for freelancers
  const walletData = {
    balance: {
      available: 2450.0,
      pending: 850.0,
      total: 3300.0,
    },
    transactions: [
      {
        id: "txn_001",
        type: "credit" as const,
        description: "Payment for Wedding Photography",
        amount: 1200.0,
        date: "2024-01-15",
        status: "completed" as const,
        bookingId: "book_001",
      },
      {
        id: "txn_002",
        type: "credit" as const,
        description: "AC Repair Service",
        amount: 450.0,
        date: "2024-01-12",
        status: "completed" as const,
        bookingId: "book_002",
      },
      {
        id: "txn_003",
        type: "withdrawal" as const,
        description: "Bank Transfer",
        amount: 800.0,
        date: "2024-01-10",
        status: "completed" as const,
      },
      {
        id: "txn_004",
        type: "credit" as const,
        description: "Home Cleaning Service",
        amount: 200.0,
        date: "2024-01-08",
        status: "pending" as const,
        bookingId: "book_003",
      },
    ],
    withdrawalRequests: [
      {
        id: "wd_001",
        amount: 1500.0,
        requestDate: "2024-01-14",
        status: "pending" as const,
        bankDetails: {
          accountNumber: "**** 4567",
          bankName: "State Bank of India",
          ifscCode: "SBIN0001234",
        },
      },
      {
        id: "wd_002",
        amount: 800.0,
        requestDate: "2024-01-10",
        status: "completed" as const,
        bankDetails: {
          accountNumber: "****4567",
          bankName: "State Bank of India",
          ifscCode: "SBIN0001234",
        },
      },
    ],
  };

  const handleWithdrawalRequest = (amount: number) => {
    // Handle withdrawal logic here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Header onLogin={handleLogin} /> */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link to="/freelancer-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Payouts</span>
          </Link>
          {/* {(!showWithdrawalForm && (authVar?.freelancer?.withdrawMethod == "bank" || authVar?.freelancer?.withdrawMethod === "upi" )) &&
            <Button size="sm" onClick={() => setShowWithdrawalForm(true)} className="h-8 px-3">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          } */}
        </div>
      </div>
      <div className="container mx-auto px-4">
        <FreelancerWallet
          balance={walletData.balance}
          transactions={walletData.transactions}
          withdrawalRequests={walletData.withdrawalRequests}
          onWithdrawalRequest={handleWithdrawalRequest}
          setShowWithdrawalForm={setShowWithdrawalForm}
          showWithdrawalForm={showWithdrawalForm}
        />
      </div>
      <MobileBottomNav />
    </div >
  );
};

export default Wallet;
