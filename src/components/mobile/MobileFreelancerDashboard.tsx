import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Calendar,
  MapPin,
  Clock,
  Award,
  Target,
  Briefcase,
  Heart,
  Download,
  Banknote,
  IndianRupee,
  FileText,
  Image,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getAllWalletWidthrawal } from "@/store/widthrawalSlice";
import { getFreelancerDashboardData } from "@/store/dashboardSlice";

const MobileFreelancerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();
  const authVar = useSelector((state: RootState) => state?.auth);
  const transactionVar = useSelector((state: RootState) => state.widthrawal)
  const dashboardVar = useSelector((state: RootState) => state.dashboard);

  console.log(authVar)
  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };
  useEffect(() => {
    dispatch(getAllWalletWidthrawal())
    dispatch(getFreelancerDashboardData())
  }, [dispatch])
  


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Always show header on mobile freelancer dashboard */}
      <Header onLogin={handleLogin} />

      <div className="px-4 py-3 space-y-3">
        {/* Welcome Header */}
        {/* <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Welcome back, Chef Rajesh!</h1>
          <p className="text-sm text-muted-foreground">Here's your performance overview</p>
        </div> */}

        {/* Earnings Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Upcoming</div>
              <div className="text-3xl font-bold text-primary">{authVar?.freelancer?.escrowWallet}</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Wallet</div>
              <div className="text-3xl font-bold text-primary">{authVar.freelancer?.wallet}</div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{dashboardVar?.freelancerDashboardData?.earningsThisMonth || 0}</div>
                <div className="text-xs text-muted-foreground">This Month</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{dashboardVar?.freelancerDashboardData?.activeJobs || 0}</div>
                <div className="text-xs text-muted-foreground">Active Jobs</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-sm font-bold">{authVar?.freelancer?.averageRating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </Card>

          <Card className="p-3 text-center">
            <Users className="h-6 w-6 text-purple-500 mx-auto mb-1" />
            <div className="text-sm font-bold">{authVar?.freelancer?.totalReview}</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </Card>

          <Card className="p-3 text-center">
            <Award className="h-6 w-6 text-orange-500 mx-auto mb-1" />
            <div className="text-sm font-bold">{ dashboardVar?.freelancerDashboardData?.completedJobs || 0}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Link to={'/applied-jobs'} className="h-12 gap-1 text-xs bg-gradient-to-br to-primary from-secondary-foreground rounded-md text-white flex items-center justify-center flex-col font-medium">
            <FileText className="h-4 w-4" />
            Applied
          </Link>
          <Link to={'/account-settings'} className="h-12 gap-1 text-xs bg-gradient-to-br to-primary from-secondary-foreground rounded-md text-white flex items-center justify-center flex-col font-medium">
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link to={'/portfolio-gallery'} className="h-12 gap-1 text-xs bg-gradient-to-br to-primary from-secondary-foreground rounded-md text-white flex items-center justify-center flex-col font-medium">
            <Image className="h-4 w-4" />
            Portfolio
          </Link>


        </div>

        {/* Recent Withdrawal Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Payouts</h3>
            <Link to={'/wallet'}><Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button></Link>
          </div>

          {transactionVar.walletWithdrawl.map((withdrawal) => (
        <Card key={withdrawal.id} className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium text-lg">
                    {`₹${withdrawal.amount}`}
                  </h4>
                  <h4 className="font-medium text-xs">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {withdrawal.withdrawAccount}
                  </p>
                  <p className="text-xs">
                    {`Platform Fee ₹${withdrawal.commission} | Recieveable: ₹${withdrawal.freelancerAmount}`}
                  </p>
                </div>
              </div>
              {getStatusBadge(withdrawal.status)}
            </div>

          </div>
        </Card>
      ))}

          {transactionVar.walletWithdrawl?.length === 0 &&
            <Card className="">
              <CardContent className="p-8 text-center">
                <IndianRupee className="h-6 w-6 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No payouts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Weekly payouts will appear here
                </p>
              </CardContent>
            </Card>

          }
        </div>

        {/* Quick Actions */}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileFreelancerDashboard;
