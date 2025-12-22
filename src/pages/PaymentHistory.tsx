import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, CreditCard, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUserTransactions } from "@/store/transactionSlice";
import { useEffect } from "react";

const PaymentHistory = () => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const transactionVar = useSelector((state: RootState) => state.transaction)
  useEffect(() => {
    dispatch(getUserTransactions())
  }, [dispatch])



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={null} />

      <div className={`${isMobile ? 'p-4 pb-20' : 'container mx-auto px-6 py-8'}`}>
        <div className={`${isMobile ? '' : 'max-w-4xl mx-auto'}`}>
          {/* Summary Cards - Mobile optimized */}
          {/* {isMobile && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">₹0</div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">0</div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </Card>
            </div>
          )} */}


          {/* Payment Cards */}
          <div className="space-y-3 md:space-y-4">
            {transactionVar.totaluserTransaction === 0 ? (
              <div className="text-center py-10 border rounded-md shadow-sm">
                <CreditCard className="h-8 w-8 mx-auto mb-4 opacity-30" />
                <p className="text-lg text-muted-foreground mb-2 font-semibold">No payments found</p>
                <p className="text-sm text-muted-foreground">
                  Your payment history will appear here
                </p>
              </div>
            ) : (
              transactionVar.userTransactionList.map((payment) => (
                <Card key={payment._id} className={`${isMobile ? "overflow-hidden" : ""}`}>
                  <CardContent className={`${isMobile ? "p-4" : "p-6"}`}>
                    {isMobile ? (
                      /* Mobile Layout */
                      <div className="">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm capitalize line-clamp-1">
                              {payment?.jobApplicationId?.jobId?.title || payment?.bookingId?.serviceId?.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {`${payment?.freelancerId?.firstName} ${payment?.freelancerId?.lastName}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">₹{payment.amount}</p>
                          </div>
                        </div>

                        <div className="flex mt-2 items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {payment?.jobApplicationId?.applicationId && payment?.jobApplicationId?.applicationId} {payment?.bookingId?.bookingId && payment?.bookingId?.bookingId} |
                            &nbsp;{new Date(payment.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}

                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                          {payment.status === 'refunded' && <span className="text-xs text-red-700 capitalize">
                            {payment.status}
                          </span>}
                        </div>
                      </div>
                    ) : (
                      /* Desktop Layout */
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{payment?.jobApplicationId?.jobId?.title}</h3>
                            <Badge variant={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-2">
                            Freelancer: {`${payment?.freelancerId?.firstName} ${payment?.freelancerId?.lastName}`}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {payment.createdAt}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              {payment.method}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-2">
                            Transaction ID: {payment.transactionId}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{payment.amount}</p>
                          {/* <Button variant="ghost" size="sm" className="mt-2">
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button> */}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default PaymentHistory;