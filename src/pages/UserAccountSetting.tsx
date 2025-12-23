import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Camera, Shield, CreditCard, ArrowLeft, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { aadharVerify, getUserProfile, updateUser, updateUserProfile, userAadharVerify, userEmailSent, userEmailVerifyOtp } from "@/store/authSlice";
import { localService } from "@/shared/_session/local";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { Dialog, DialogContent } from "@/components/ui/dialog";


const UserAccountSetting = () => {
    const authVar = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();
    const isMobile = useIsMobile();
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [emailModal, setEmailModal] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [isEditEmail, setIsEditEmail] = useState(true)
    const navigate = useNavigate();
    const [count, setCount] = useState(10);

    const modal = searchParams.get('modal');

    const handleLogin = (role: string) => {
        authVar?.isAuthenticated
    };

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gstNo: "",
        image: {},
        city: "",
        state: "",
        aadhaarNo: "",
        panNo: ""
    });


    const compressImage = async (file: File): Promise<File> => {
        const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 768,
            useWebWorker: true,
        };
        try {
            const compressedBlob = await imageCompression(file, options);

            // Convert Blob back to File
            const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            });

            return compressedFile;
        } catch (error) {
            console.error("Image compression error:", error);
            return file;
        }
    };

    const isDisabled =
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim() ||
        !formData.city.trim() ||
        !formData.state.trim() ||
        !(formData.image && (formData.image instanceof File || typeof formData.image === "string"));


    useEffect(() => {
        if (authVar?.user?.phoneNumber) {
            setFormData((prev) => ({
                ...prev,
                firstName:
                    authVar?.user?.firstName || "",
                lastName:
                    authVar?.user?.lastName || "",
                email: authVar?.user?.email || "",
                phoneNumber:
                    authVar?.user?.phoneNumber || "",
                image: authVar?.user?.profile || "",
                city: authVar?.user?.city || "",
                state: authVar?.user?.state || "",
                gstNo: authVar?.user?.gstNo || "",
                aadhaarNo: authVar?.user?.aadhaarNo || "",
                panNo: authVar?.user?.panNo || "",
            }));
        }
    }, [authVar?.user?.phoneNumber]);


    useEffect(() => {
        if (modal) {
            const interval = setInterval(() => {
                setCount((prev) => prev - 1);
            }, 1000);

            const timeout = setTimeout(() => {
                if (localService.get('role') === 'user') {
                    dispatch(getUserProfile());
                }
                navigate("/user-account-settings", { replace: true });
            }, 10000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [modal, dispatch, navigate]);



    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if (!formData.skills.includes(inputValue.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, inputValue.trim()],
                }));
            }
            setInputValue("");
        }
    };

    const handleChange = () => {
        if (!localService.get("role")) return;
        if (localService.get("role") === "user") {
            if (!isFormValid) {
                toast.warning("All fields are required");
                return;
            }
            dispatch(updateUser(formData));
            dispatch(updateUserProfile(formData?.image));
        }
    };

    const isFormValid = Object.entries(formData).every(([key, value]) => {
        if (["phoneNumber", "price", "panImage", "aadharImage", "gstNo"].includes(key)) return true;
        if (Array.isArray(value)) return value.length > 0;
        return String(value).trim() !== "";
    });


    const handleSendOtp = () => {
        dispatch(userEmailSent(formData?.email, setOtpSent))
    }

    const handleEmailOtpverfy = () => {
        dispatch(userEmailVerifyOtp({ email: formData?.email, otp: otp }, setEmailModal))
    }


    const handleAadharVerify = () => {
        dispatch(userAadharVerify({
            firstName: formData?.firstName,
            lastName: formData?.lastName,
            aadhaarNo: formData?.aadhaarNo,
            panNo: formData?.panNo
        }, navigate));
    };


    return (
        <div className="min-h-screen bg-background">
            {<Header onLogin={handleLogin} />}

            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="flex items-center justify-between p-4">
                    <Link to={`${localService?.get('role') === 'freelancer' ? "/freelancer-dashboard" : "/employer-dashboard"}`} className="flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Account Setting</span>
                    </Link>
                </div>
            </div>

            <div
                className={`${isMobile ? "p-4 pb-20 pt-4" : "container mx-auto px-6 py-8"
                    } space-y-4 md:space-y-6`}
            >

                {/* Profile Information */}
                {!authVar?.user?.isAadharVerified && (
                    <Card className="max-w-md mx-auto border border-secondary-foreground rounded-xl shadow-sm p-4 sm:p-6">
                        <CardHeader className="p-0 mb-4 text-center">
                            <h2 className="text-lg font-semibold text-foreground">
                                Aadhaar & PAN Verification
                            </h2>
                        </CardHeader>

                        <CardContent className="space-y-4 p-0">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm font-medium">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    placeholder="Enter your first name"
                                    // inputMode="numeric"
                                    onInput={(e: any) => e.target.value = e.target.value.replace(/[0-9.]/g, "").replace(" ", "").slice(0, 30)}
                                    value={formData?.firstName}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-medium">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    placeholder="Enter your last name"
                                    // inputMode="numeric"
                                    onInput={(e: any) => e.target.value = e.target.value.replace(/[0-9.]/g, "").replace(" ", "").slice(0, 30)}
                                    value={formData?.lastName}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="panNo" className="text-sm font-medium">
                                    PAN Number
                                </Label>
                                <Input
                                    id="panNo"
                                    placeholder="Enter your 10-character PAN number uppercase"
                                    value={formData?.panNo}
                                    onInput={(e: any) => {
                                        let value = e.target.value.toUpperCase().replace(/\s/g, "");
                                        let filtered = "";

                                        for (let i = 0; i < value.length && i < 10; i++) {
                                            const ch = value[i];
                                            if (i < 5 && /[A-Z]/.test(ch)) filtered += ch; // first 5 letters
                                            else if (i >= 5 && i < 9 && /[0-9]/.test(ch)) filtered += ch; // next 4 digits
                                            else if (i === 9 && /[A-Z]/.test(ch)) filtered += ch; // last letter
                                            else break; // stop on invalid input
                                        }

                                        e.target.value = filtered;
                                    }}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, panNo: e.target.value }))
                                    }
                                />


                            </div>

                            <Button
                                className="w-full mt-2 bg-primary hover:bg-primary/90 transition-all"
                                onClick={handleAadharVerify}
                                disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.panNo.trim()}
                            >
                                Verify with Aadhaar OTP
                            </Button>

                            <p className="text-[11px] text-center text-muted-foreground mt-2">
                                We value your privacy — your information is securely encrypted.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {authVar?.user?.isAadharVerified && <Card className="pt-2">
                    <CardContent
                        className={`${isMobile ? "p-4 pt-0" : "p-4"} space-y-4`}
                    >
                        <div className="flex items-center gap-4">
                            <Dropzone
                                accept={{ "image/*": [] }}
                                multiple={false}
                                onDrop={async (acceptedFiles) => {
                                    if (acceptedFiles.length > 0) {
                                        let file = acceptedFiles[0];
                                        file = await compressImage(file);

                                        const localPreview = URL.createObjectURL(file);
                                        setPreview(localPreview);

                                        setFormData((prev: any) => ({
                                            ...prev,
                                            image: file,
                                        }));
                                    }
                                }}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div
                                        {...getRootProps()}
                                        className={`${isMobile ? "w-12 h-12" : "w-16 h-16"} rounded-full bg-muted flex items-center justify-center cursor-pointer overflow-hidden`}
                                    >
                                        <input {...getInputProps({ refKey: "ref" })} ref={(el) => (inputRef.current = el)} />
                                        {preview || (typeof formData?.image === "string" && formData?.image) ? (
                                            <img src={preview || (formData?.image as string)} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-muted-foreground`} />
                                        )}
                                    </div>
                                )}
                            </Dropzone>

                            <Button
                                // variant="outline"
                                size={isMobile ? "sm" : "default"}
                                onClick={() => inputRef.current?.click()}
                            >
                                {isMobile ? "Upload" : "Upload"}
                            </Button>
                        </div>

                        <div
                            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"
                                } gap-4`}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm">
                                    First Name*
                                </Label>
                                <Input
                                    id="firstName"
                                    disabled
                                    value={formData?.firstName}
                                    type="text"
                                    onInput={(e: any) => e.target.value = e.target.value.replace(/[0-9.]/g, "").replace(" ", "").slice(0, 30)}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            firstName: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm">
                                    Last Name*
                                </Label>
                                <Input
                                    id="lastName"
                                    value={formData?.lastName}
                                    disabled
                                    type="text"
                                    onInput={(e: any) => e.target.value = e.target.value.replace(/[0-9.]/g, "").replace(" ", "").slice(0, 30)}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            lastName: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">
                                Email*
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="email"
                                    type="email"
                                    disabled={authVar?.user?.isEmailVerified}
                                    value={formData?.email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                />
                                {!authVar?.user?.isEmailVerified && <Button className="h-10" onClick={() => setEmailModal(true)}>Verify</Button>}
                                <Dialog open={emailModal} onOpenChange={setEmailModal}>
                                    <DialogContent className="max-w-md">
                                        <div className="space-y-4 mt-2">
                                            {/* Email Input */}
                                            <div className="space-y-1">
                                                <Label>Email</Label>
                                                <Input
                                                    value={formData?.email}
                                                    // disabled={isEditEmail}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                                />
                                                <p className="text-sm font-medium text-right" onClick={() => {
                                                    setIsEditEmail(false);
                                                    setOtpSent(false);
                                                }}>Change</p>
                                            </div>

                                            {otpSent && (
                                                <div className="space-y-1">
                                                    <Label>Enter OTP</Label>
                                                    <Input
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        maxLength={6}
                                                    />
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex justify-end gap-2">
                                                {!otpSent ? (
                                                    <Button onClick={handleSendOtp} disabled={authVar?.status === "loading"}>{authVar?.status === "loading" ? "Sending..." : "Send OTP"}</Button>
                                                ) : (
                                                    <Button onClick={handleEmailOtpverfy} disabled={authVar?.status === "loading"}>{authVar?.status === "loading" ? "Verifying..." : "Verify OTP"}</Button>
                                                )}
                                                <Button variant="outline" onClick={() => setEmailModal(false)}>Cancel</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm">
                                Phone Number*
                            </Label>
                            <Input id="phone" value={formData?.phoneNumber} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm">
                                Aadhar Number*
                            </Label>
                            <Input id="phone" value={formData?.aadhaarNo} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm">
                                PAN Number*
                            </Label>
                            <Input id="phone" value={formData?.panNo} disabled />
                        </div>

                        <div
                            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"
                                } gap-4`}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="aadhaarNo" className="text-sm">
                                    GST No (Optional)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="gstNo"
                                        value={formData?.gstNo}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                gstNo: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"
                                } gap-4`}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm">
                                    City*
                                </Label>
                                <Input
                                    id="city"
                                    value={formData?.city}
                                    onInput={(e: any) => e.target.value = e.target.value.replace(" ", " ").slice(0, 30)}
                                    type="text"
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, city: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-sm">
                                    State*
                                </Label>
                                <Input
                                    id="state"
                                    type="text"
                                    value={formData?.state}
                                    onInput={(e: any) => e.target.value = e.target.value.replace(/[0-9.]/g, "").replace(" ", " ").slice(0, 30)}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <Button className={`w-full `} onClick={handleChange} disabled={isDisabled}>
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>}
                {/* Danger Zone */}
                <div className="space-y-3">
                    <div className="space-y-3">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">Privacy Policy</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Learn how we handle your data
                                        </p>
                                    </div>
                                    <Link to={'/privacy-policy'} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            Read
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">Terms & Conditions</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Understand the rules of using our services
                                        </p>
                                    </div>
                                    <Link to={'/terms&condition'} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {modal && <div className="modal bg-white w-full h-screen fixed top-0 right-0 z-50 flex items-center justify-center">
                <div>
                    <p className="font-medium">Verifying...({count}s)</p>
                </div>
            </div>}

            <MobileBottomNav />
        </div>
    );
};

export default UserAccountSetting;
