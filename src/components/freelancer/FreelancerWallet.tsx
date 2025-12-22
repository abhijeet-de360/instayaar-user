import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  CreditCard,
  Banknote,
  Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addPaymentMethod, createWidthrawal } from "@/store/widthrawalSlice";

export const FreelancerWallet = ({
  balance,
  transactions,
  withdrawalRequests,
  onWithdrawalRequest,
  setShowWithdrawalForm,
  showWithdrawalForm,
}: any) => {
  const authVar = useSelector((state: RootState) => state?.auth);
  const transactionVar = useSelector((state: RootState) => state.widthrawal);
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    withdrawMethod: "bank",
    upiId: "",
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    cnfAccountNumber: "",
  });

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [showAddMethodDialog, setShowAddMethodDialog] = useState(false);

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);

    dispatch(createWidthrawal(withdrawalAmount));
    onWithdrawalRequest(amount);
    setWithdrawalAmount("");
    setShowWithdrawalForm(false);
    setShowAddMethodDialog(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: "default" as const, icon: CheckCircle },
      pending: { variant: "secondary" as const, icon: Clock },
      rejected: { variant: "destructive" as const, icon: AlertCircle },
      approved: { variant: "default" as const, icon: CheckCircle },
    };
    const config =
      variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleAddMethod = () => {
    dispatch(addPaymentMethod(formData));
    setShowAddMethodDialog(false);
  };

  const upiRegex = /^[\w.\-_]{2,}@[\w]{2,}$/;
  const [upiError, setUpiError] = useState("");

  const handleUpiInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setFormData((prev) => ({ ...prev, upiId: value }));

    const upiRegex = /^[\w.\-_]{2,}@[\w]{2,}$/;
    if (value && !upiRegex.test(value)) {
      setUpiError("Invalid UPI ID format. Example: user@paytm");
    } else {
      setUpiError("");
    }
  };

  const isDisabled =
  (formData.withdrawMethod === "bank" &&
    (
      !formData.accountName.trim() ||
      !formData.bankName.trim() ||
      !formData.accountNumber.trim() ||
      !formData.ifscCode.trim() ||
      formData.cnfAccountNumber.trim() !== formData.accountNumber.trim()
    )) ||
  (formData.withdrawMethod === "upi" &&
    (!formData.upiId.trim() || upiError)); 

  return (
    <div className="space-y-4">
      {/* Balance Overview */}
      {/* <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">₹{balance.available.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-yellow-600">₹{balance.pending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Processing payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">₹{balance.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div> */}

      <div>
        <div className="space-y-3">
          {/* <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">State Bank of India</p>
                  <p className="text-sm text-muted-foreground">
                    Account ending in 4567
                  </p>
                </div>
              </div>
              <Badge variant="default">Primary</Badge>
            </div> */}
          {!showWithdrawalForm &&
            (authVar?.freelancer?.withdrawMethod == "bank" ||
              authVar?.freelancer?.withdrawMethod === "upi") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg mt-4">
                  <div className="flex items-center gap-3">
                    <div>
                      {authVar?.freelancer?.withdrawMethod == "bank" && (
                        <>
                          <p className="font-medium">
                            {authVar?.freelancer?.bankName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {authVar?.freelancer?.ifscCode}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {"**** **** **** " +
                              authVar?.freelancer?.accountNumber?.slice(-4)}
                          </p>
                        </>
                      )}
                      {authVar?.freelancer?.withdrawMethod == "upi" && (
                        <>
                          <p className="font-medium">UPI</p>
                          <p className="text-sm text-muted-foreground">
                            {authVar?.freelancer?.upiId}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          <Dialog
            open={showAddMethodDialog}
            onOpenChange={setShowAddMethodDialog}
          >
            <DialogTrigger asChild>
              {(authVar?.freelancer?.withdrawMethod == "" ||
                !authVar?.freelancer?.withdrawMethod) && (
                <Button variant="outline" className="w-full gap-2 mt-3">
                  <Plus className="w-4 h-4" />
                  Add Payout Method
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Payout Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* <div>
                  <Label htmlFor="method-type">Method Type</Label>
                  <Select
                    value={formData?.withdrawMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        withdrawMethod: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {formData?.withdrawMethod === "bank" && (
                  <>
                    <div>
                      <Label htmlFor="holder-name">Account Holder Name</Label>
                      <Input
                        id="holder-name"
                        value={formData?.accountName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accountName: e.target.value,
                          }))
                        }
                        placeholder="Enter account holder name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={formData?.bankName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bankName: e.target.value,
                          }))
                        }
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        type="password"
                        value={formData?.accountNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accountNumber: e.target.value,
                          }))
                        }
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        placeholder="Enter account number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirm-account-number">
                        Confirm Account Number
                      </Label>
                      <Input
                        id="confirm-account-number"
                        value={formData?.cnfAccountNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cnfAccountNumber: e.target.value,
                          }))
                        }
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        placeholder="Re-enter account number"
                      />
                      {formData?.cnfAccountNumber &&
                        formData?.accountNumber !==
                          formData?.cnfAccountNumber && (
                          <p className="text-sm text-red-500 mt-1">
                            Account numbers do not match
                          </p>
                        )}
                    </div>

                    <div>
                      <Label htmlFor="ifsc-code">IFSC Code</Label>
                      <Input
                        id="ifsc-code"
                        value={formData?.ifscCode}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ifscCode: e.target.value,
                          }))
                        }
                        placeholder="Enter IFSC code"
                      />
                    </div>
                  </>
                )}

                {formData?.withdrawMethod === "upi" && (
                  <div>
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input
                      id="upi-id"
                      value={formData.upiId}
                      onInput={handleUpiInput}
                      placeholder="Enter UPI ID (e.g., user@paytm)"
                    />
                    {upiError && (
                      <p className="text-red-500 text-xs mt-1">{upiError}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleAddMethod}
                    className="flex-1"
                    disabled={isDisabled}
                  >
                    Add Method
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddMethodDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="flex gap-4"> */}
      {/* <Button
          onClick={() => setShowWithdrawalForm(true)}
          className="gap-2 w-full md:w-auto"
          disabled={balance.available < 100}
        >
          <Download className="w-4 h-4" />
          Withdraw Funds
        </Button> */}
      {/* </div> */}

      {/* Withdrawal Form */}
      {showWithdrawalForm && (
        <Card className="border-none shadow-none p-0">
          <CardContent className="space-y-4 p-0 border-none">
            <div>
              <label className="text-sm font-medium">Amount (₹)</label>
              <Input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum withdrawal: ₹100 | Available: ₹
                {authVar?.freelancer?.wallet.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleWithdrawal}
                disabled={
                  parseInt(withdrawalAmount) < 100 ||
                  withdrawalAmount == "" ||
                  withdrawalAmount > authVar?.freelancer?.wallet
                }
              >
                Request{" "}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWithdrawalForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
      {transactionVar.walletWithdrawl?.length === 0 && (
        <Card className="">
          <CardContent className="p-8 text-center">
            <IndianRupee className="h-6 w-6 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Payouts</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Weekly Payouts will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
