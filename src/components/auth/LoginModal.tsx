import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { X } from "lucide-react";
import { localService } from "@/shared/_session/local";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { freelancerSendOtp, freelancerVerifyOtp, setRole, userSendOtp, userVerifyOtp, } from "@/store/authSlice";
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string) => void;
  isMobile?: boolean;
}
export const LoginModal = ({ isOpen, onClose, onLoginSuccess, isMobile = false }: LoginModalProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const authVar = useSelector((state: RootState) => state.auth)
  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('role');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFromData] = useState({
    phoneNumber: '',
    otp: '',
    lat: '',
    lon: '',
    fcm: ''
  })


  const handleSendOtp = async () => {
    if (formData?.phoneNumber.length !== 10) {
      return;
    } else {
      if (localService?.get('role') === 'user') {
        dispatch(userSendOtp({ phoneNumber: formData?.phoneNumber })).then((res) => {
          setStep('otp');
        })
      } else {
        dispatch(freelancerSendOtp({ phoneNumber: formData?.phoneNumber })).then((res) => {
          setStep('otp');
        })
      }
    }
  };



  const handleVerifyOtp = async () => {
    if (formData?.otp.length !== 6) {
      return;
    } else {
      if (authVar.role === 'user') {
        dispatch(userVerifyOtp({ phoneNumber: formData?.phoneNumber, otp: formData?.otp, lat: formData?.lat, lon: formData?.lon, fcm: formData?.fcm }, navigate, onClose))
        setFromData((prev) => ({ ...prev, otp: '' }))
      } else {
        dispatch(freelancerVerifyOtp({ phoneNumber: formData?.phoneNumber, otp: formData?.otp, lat: formData?.lat, lon: formData?.lon, fcm: window.fcmToken }, navigate, onClose))
        setFromData((prev) => ({ ...prev, otp: '' }))
      }
    }
  }


  const handleRoleSelection = (role: 'user' | 'freelancer') => {
    dispatch(setRole(role))
    setStep("phone")
  };


  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setOtpTimer(0);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleOtpChange = (value: string) => {
    setFromData((prev) => ({ ...prev, otp: value }));
  };
  const AuthContent = () => <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-foreground">
        {step === 'phone' && 'Welcome to KaamDham'}
        {step === 'otp' && 'Enter OTP'}
        {/* {step === 'role' && 'Select your Role'} */}
      </h2>

    </div>

    {step === 'phone' && <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Mobile Number</label>
        <div className="flex">
          <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
            +91
          </div>
          <Input type="tel" placeholder="Enter 10-digit mobile number" value={formData?.phoneNumber} onChange={e => setFromData((prev) => ({ ...prev, phoneNumber: e.target.value.slice(0, 10) }))} className="rounded-l-none" autoFocus />
        </div>
      </div>
      <Button onClick={handleSendOtp} disabled={formData?.phoneNumber.length !== 10 || isLoading} className="w-full">
        {isLoading ? 'Sending...' : 'Send OTP'}
      </Button>
    </div>}

    {step === 'otp' && <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        We've sent a 6-digit code to +91 {formData?.phoneNumber}
      </p>
      <div className="flex justify-center">
        <InputOTP value={formData?.otp} onChange={handleOtpChange} maxLength={6} autoFocus>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {otpTimer > 0 && <p className="text-center text-sm text-muted-foreground">
        Resend in {formatTimer(otpTimer)}
      </p>}
      {otpTimer === 0 && <Button variant="ghost" onClick={handleSendOtp} className="w-full">
        Resend OTP
      </Button>}
      <Button onClick={handleVerifyOtp} disabled={formData?.otp.length !== 6 || authVar?.status === 'loading'} className="w-full">
        {authVar?.status === 'loading' ? 'Verifying...' : 'Verify OTP'}
      </Button>
    </div>}

    {step === 'role' && <div className="space-y-4">
      <div className="grid gap-3">
        <Button variant="outline" onClick={() => handleRoleSelection('user')} className="h-auto p-4 flex flex-col items-start space-y-1 hover:bg-accent">
          <span className="font-medium">Client Login</span>
          <span className="text-sm text-gray-500">
            I will hire Freelancers for my tasks
          </span>
        </Button>
        <Button variant="outline" onClick={() => handleRoleSelection('freelancer')} className="h-auto p-4 flex flex-col items-start space-y-1 hover:bg-accent">
          <span className="font-medium">Freelancer Login</span>
          <span className="text-sm text-gray-500">
            I will work on tasks and earn money
          </span>
        </Button>
      </div>
    </div>}

    <p className="text-xs text-muted-foreground text-center">
      By continuing, you agree to our <Link to={'/terms&condition'} target="_blank" className="font-semibold underline text-primary" >Terms</Link> & <Link to={'/privacy-policy'} target="_blank" className="font-semibold underline text-primary">Privacy Policy</Link>.
    </p>
  </div>;
  if (isMobile) {
    return <Sheet open={isOpen} onOpenChange={() => {
      onClose();
      setStep('role')
    }}>
      <SheetContent side="bottom" className="rounded-t-lg">
        <AuthContent />
      </SheetContent>
    </Sheet>;
  }
  return <Dialog open={isOpen} onOpenChange={() => {
    onClose();
    setStep('role')
  }}>
    <DialogContent className="sm:max-w-md mx-4 rounded-lg">
      <AuthContent />
    </DialogContent>
  </Dialog>;
};