import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Shield, CreditCard, X, ArrowLeft, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {  aadharVerify,  emailSendOtp,  emailVerifyOtp,  getFreelancerProfile,  updateFreelancer,  updateFreelancerImage,  updateUser,  updateUserProfile,} from "@/store/authSlice";
import { localService } from "@/shared/_session/local";
import Dropzone from "react-dropzone";
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select";
import { toast } from "sonner";
import {  Dialog,  DialogClose,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "@/components/ui/dialog";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

const AccountSettings = () => {
  const authVar = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();
  const isMobile = useIsMobile();
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPan, setIsPan] = useState(false);
  const [isAadhaar, setIsAadhaar] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [emailModal, setEmailModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEditEmail, setIsEditEmail] = useState(true)
  const [count, setCount] = useState(10);
  // const model = use();

  const modal = searchParams.get('modal');


  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    image: {},
    panNo: "",
    aadhaarNo: "",
    city: "",
    state: "",
    skills: [],
    experience: "",
    gst: "",
    panImage: {},
    pincode: ''
  });



  const isFileOrUrl = (val) =>
    val instanceof File || (typeof val === "string" && val.trim() !== "");

  const isDisabled =
    !formData.firstName?.trim() ||
    !formData.lastName?.trim() ||
    !formData.email?.trim() ||
    !formData.phoneNumber?.trim() ||
    !formData.bio?.trim() ||
    !formData.city?.trim() ||
    !formData.state?.trim() ||
    !formData.experience?.trim() ||
    !formData.panNo?.trim() ||
    !formData.aadhaarNo?.trim() ||
    formData.skills.length === 0 ||
    // !isFileOrUrl(formData.panImage) ||
    !isFileOrUrl(formData.image);


  useEffect(() => {
    if (authVar?.freelancer?.phoneNumber) {
      setFormData((prev) => ({
        ...prev,
        firstName: authVar?.freelancer?.firstName || "",
        lastName: authVar?.freelancer?.lastName || "",
        email: authVar?.freelancer?.email || "",
        phoneNumber: authVar?.freelancer?.phoneNumber || "",
        bio: authVar?.freelancer?.bio || "",
        image: authVar?.freelancer?.profile || "",
        panNo: authVar?.freelancer?.panNo || "",
        aadhaarNo: authVar?.freelancer?.aadhaarNo || "",
        skills: authVar?.freelancer?.skills || [],
        city: authVar?.freelancer?.city || "",
        state: authVar?.freelancer?.state || "",
        experience:
          authVar?.freelancer?.experience || "",
        panImage:
          authVar?.freelancer?.aadharImage || "",
        gst: authVar?.freelancer?.gstNo,
        pincode: authVar?.freelancer?.aadhaarData?.address?.pincode
      }));
    }
  }, [authVar?.freelancer?.phoneNumber, authVar?.freelancer?.aadhaarNo, authVar?.freelancer?.aadhaarData]);

  useEffect(() => {
    if (modal) {
      const interval = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        dispatch(getFreelancerProfile());
        navigate("/account-settings", { replace: true });
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [modal, dispatch, navigate]);

  const [panPreview, setPanPreview] = useState<string | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [step, setStep] = useState(1)

  const [inputValue, setInputValue] = useState("");

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

  const handleAddSkill = () => {
    if (inputValue.trim() !== "") {
      if (!formData.skills.includes(inputValue.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, inputValue.trim()],
        }));
      }
      setInputValue("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
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
    } else {
      if (!isFormValid) {
        toast.warning("All fields are required");
        return;
      }
      // dispatch(updateFreelancerProfile(formData?.image));
      dispatch(updateFreelancer(
        {
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          email: formData?.email,
          phoneNumber: formData?.phoneNumber,
          bio: formData?.bio,
          image: formData?.image,
          panNo: formData?.panNo,
          aadhaarNo: formData?.aadhaarNo,
          skills: formData?.skills,
          city: formData?.city,
          state: formData?.state,
          experience: formData?.experience,
          gstNo: formData?.gst
        },
        formData?.image,
        // formData?.panImage,
      ));
    }
  };

  const handleAadharVerify = () => {
    dispatch(aadharVerify({
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      aadhaarNo: formData?.aadhaarNo,
      panNo: formData?.panNo
    },navigate));
  };

  const allFieldsFilled = Object.values(formData).every(
    (value: any) => String(value).trim() !== ""
  );

  const isFormValid = Object.entries(formData).every(([key, value]) => {
    if (["phoneNumber", "price", "panImage", "aadharImage", "gst"].includes(key)) return true;
    if (Array.isArray(value)) return value.length > 0;
    return String(value).trim() !== "";
  });


  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (
      authVar?.freelancer?.status === 'inActive'
    ) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [authVar]);

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

  const compressFile = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 768,
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      // Convert Blob back to File
      return new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("Compression error:", error);
      return file; // fallback
    }
  };

  const handleSendOtp = () => {
    // setOtpSent(true);
    dispatch(emailSendOtp(formData?.email, setOtpSent));
  }

  const handleEmailOtpverfy = () => {
    dispatch(emailVerifyOtp(otp, setEmailModal));
    // setEmailModal(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />

      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link to="/freelancer-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Profile</span>
          </Link>
        </div>
      </div>

      <div
        className={`${isMobile ? "p-4 pb-20 pt-0" : "container mx-auto px-6 py-8"
          } space-y-4 md:space-y-6`}
      >
        <div className="mb-4 md:mb-6">
          {authVar?.freelancer?.isAadharVerified && authVar?.freelancer?.status === 'inActive' && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <p className="text-xs font-semibold text-primary text-center mt-2">
                Your profile is almost ready — complete it to activate your account!
              </p>
            </div>
          )}
          {authVar?.freelancer?.isAadharVerified && authVar?.freelancer?.status === 'pending' && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <p className="text-xs font-semibold text-primary text-center mt-2">
                Your profile is under review.<br />We'll notify you when your account is activated.
              </p>
            </div>
          )}
          {authVar?.freelancer?.status === 'suspended' && (
            <p className="text-sm font-semibold text-primary text-center mt-2">
              Your profile is currently under review.<br />We&apos;ll notify you once it&apos;s verified.
            </p>
          )}
        </div>

        {!authVar?.freelancer?.isAadharVerified && (
          <Card className="max-w-md mx-auto border border-muted rounded-xl shadow-sm p-4 sm:p-6">
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
                  placeholder="Enter your 10-character PAN number"
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


        {/* Profile Information */}
        {
          authVar?.freelancer?.isAadharVerified && (
            isEditMode ? (
              <Card className="pt-2">
                <CardContent
                  className={`${isMobile ? "p-4 pt-0" : "p-4"} space-y-4`}
                >
                  <div className="flex items-center gap-4">
                    <Dropzone
                      accept={{ "image/*": [] }}
                      multiple={false}
                      onDrop={async (acceptedFiles) => {
                        if (acceptedFiles.length > 0) {
                          let file: any = acceptedFiles[0];
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
                        type="text"
                        onInput={(e: any) => e.target.value = e.target.value.replace(/[0-9.]/g, "").replace(" ", "").slice(0, 30)}
                        value={formData?.firstName}
                        disabled
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
                        type="text"
                        onInput={(e: any) => e.target.value = e.target.value.replace(/[0-9.]/g, "").replace(" ", "").slice(0, 30)}
                        value={formData?.lastName}
                        disabled
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
                    <Input
                      id="email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">
                      Phone Number*
                    </Label>
                    <Input id="phone" value={formData?.phoneNumber} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm">
                      Bio*
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      rows={3}
                      value={formData?.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                    />
                  </div>

                  <div
                    className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"
                      } gap-4`}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="aadhaarNo" className="text-sm">
                        Aadhaar No*
                      </Label>
                      <div className="flex gap-2 flex-col">
                        <Input id="aadhaarNo"
                          value={formData?.aadhaarNo}
                          type="text"
                          disabled
                        // onInput={(e: any) => e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(" ", "").slice(0, 12)}
                        // onChange={(e) => setFormData((prev) => ({
                        //   ...prev,
                        //   aadhaarNo: e.target.value,
                        // }))
                        // }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panNo" className="text-sm">
                        PAN No*
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="panNo"
                          value={formData?.panNo}
                          disabled
                          type="text"
                          onInput={(e: any) => e.target.value = e.target.value.replace(" ", "").slice(0, 10).toUpperCase()}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              panNo: e.target.value,
                            }))
                          }
                        />
                        {/* <Button
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => setIsPan(true)}
                    >
                      <Camera />
                    </Button> */}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gst" className="text-sm">
                      GST No
                    </Label>
                    <Input
                      id="gst"
                      placeholder=""
                      value={formData?.gst || ""}
                      onInput={(e: any) => e.target.value = e.target.value.replace(" ", "").slice(0, 30)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gst: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Title*</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData?.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-3 py-0.5 border text-xs rounded-full"
                        >
                          {skill}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeSkill(skill)}
                          />
                        </span>
                      ))}
                    </div>
                    <div className="tab flex items-center gap-2">
                      <Input
                        placeholder="Add a nick name or popular name"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button variant="secondary" onClick={handleAddSkill}>
                        Add
                      </Button>
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
                        type="text"
                        disabled
                        onInput={(e: any) => e.target.value = e.target.value.replace(" ", " ").slice(0, 30)}
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
                        value={formData?.state}
                        disabled
                        type="text"
                        onInput={(e: any) => e.target.value = e.target.value.replace(" ", " ").slice(0, 30)}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm">
                        Pin Code*
                      </Label>
                      <Input
                        id="state"
                        value={formData?.pincode}
                        disabled
                        type="text"
                        onInput={(e: any) => e.target.value = e.target.value.replace(" ", " ").slice(0, 30)}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience*</Label>
                    <Select
                      value={formData?.experience}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, experience: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than 1 year">
                          Less than 1 year
                        </SelectItem>
                        <SelectItem value="1+ years">1+ years</SelectItem>
                        <SelectItem value="3+ years">3+ years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
                        <SelectItem value="7+ years">7+ years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className={`w-full `} onClick={handleChange} disabled={isDisabled}>
                    {authVar?.status === "loading" ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className={`${isMobile ? "pb-3" : "pb-4"}`}>
                  {/* <div className="flex items-center justify-between">
                    <CardTitle
                      className={`flex items-center gap-2 ${isMobile ? "text-lg" : "text-lg"
                        }`}
                    >
                      <Camera className="h-4 w-4" />
                      Profile Information
                    </CardTitle>
                    {isMobile && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div> */}
                </CardHeader>

                <CardContent
                  className={`${isMobile ? "p-4 pt-0" : "p-4"} space-y-4`}
                >
                  {/* <div className="flex items-center gap-4">
                    <div
                      className={`${isMobile ? "w-12 h-12" : "w-16 h-16"
                        } rounded-full bg-muted flex items-center justify-center overflow-hidden`}
                    >
                      {formData?.image ? (
                        <img
                          src={authVar?.freelancer?.profile}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera
                          className={`${isMobile ? "h-5 w-5" : "h-6 w-6"
                            } text-muted-foreground`}
                        />
                      )}
                    </div>
                  </div> */}

                  <div className="flex items-center gap-4">
                    <Dropzone
                      accept={{ "image/*": [] }}
                      multiple={false}
                      onDrop={async (acceptedFiles) => {
                        if (acceptedFiles.length > 0) {
                          let file = acceptedFiles[0];

                          // Compress the image (if you have a compressImage function)
                          file = await compressImage(file);

                          // Create a local preview URL
                          const localPreview = URL.createObjectURL(file);
                          setPreview(localPreview);

                          // Update local form state
                          setFormData((prev: any) => ({
                            ...prev,
                            image: file,
                          }));

                          // Dispatch the action to update profile
                          dispatch(updateFreelancerImage(file));
                        }
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          className={`${isMobile ? "w-12 h-12" : "w-16 h-16"} rounded-full bg-muted flex items-center justify-center cursor-pointer overflow-hidden`}
                        >
                          <input
                            {...getInputProps({ refKey: "ref" })}
                            ref={(el) => (inputRef.current = el)}
                          />
                          {preview || (typeof formData?.image === "string" && formData?.image) ? (
                            <img
                              src={preview || (formData?.image as string)}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-muted-foreground`} />
                          )}
                        </div>
                      )}
                    </Dropzone>

                    <Button
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
                    <div className="space-y-1">
                      <Label className="text-sm">First Name</Label>
                      <p className="text-base capitalize!">{formData?.firstName}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Last Name</Label>
                      <p className="text-base">{formData?.lastName}</p>
                    </div>
                  </div>

                  <div className="space-y-1 flex items-center justify-between">
                    <div className="">
                      <Label className="text-sm">Email</Label>
                      <p className="text-base">{formData?.email}</p>
                    </div>
                    {authVar?.freelancer?.isEmailVerified === false && <Button className="h-8 w-12" onClick={() => setEmailModal(true)}>Verify</Button>}
                    <Dialog open={emailModal} onOpenChange={setEmailModal}>
                      <DialogContent className="max-w-md">


                        <div className="space-y-4 mt-2">
                          {/* Email Input */}
                          <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                              value={formData?.email}
                              disabled={isEditEmail}
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

                  <div className="space-y-1">
                    <Label className="text-sm">Phone Number</Label>
                    <p className="text-base">{formData?.phoneNumber}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Bio</Label>
                    <p className="text-base whitespace-pre-line">{formData?.bio}</p>
                  </div>

                  <div
                    className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"
                      } gap-4`}
                  >
                    <div className="space-y-1">
                      <Label className="text-sm">Aadhaar No</Label>
                      <p className="text-base">{formData?.aadhaarNo}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">PAN No</Label>
                      <p className="text-base">{formData?.panNo}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">GST No</Label>
                    <p className="text-base whitespace-pre-line">{formData?.gst || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Dispaly Title*</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData?.skills?.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 px-3 py-0.5 border text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-base text-muted-foreground">
                          No skills added
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"
                      } gap-4`}
                  >
                    <div className="space-y-1">
                      <Label className="text-sm">City</Label>
                      <p className="text-base">{formData?.city}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">State</Label>
                      <p className="text-base">{formData?.state}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Pincode</Label>
                      <p className="text-base">{formData?.pincode}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Years of Experience</Label>
                    <p className="text-base">{formData?.experience}</p>
                  </div>
                </CardContent>
              </Card>
            )
          )
        }




        {/* Notification Preferences */}
        {/* <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates via SMS
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive browser notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  Receive promotional content
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card> */}

        {/* Conditional Section - Payment Methods for Employers, Verification for Freelancers */}
        {localService.get("role") === "user" ? (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-4 w-4" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          // <Card>
          //   <CardHeader className="pb-4">
          //     <CardTitle className="flex items-center gap-2 text-lg">
          //       <FileCheck className="h-4 w-4" />
          //       Identity Verification
          //     </CardTitle>
          //   </CardHeader>
          //   <CardContent className="p-4 space-y-4">
          //     {/* Default state: Not verified */}
          //     <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          //       <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
          //         <AlertCircle className="h-4 w-4 text-amber-600" />
          //       </div>
          //       <div className="flex-1">
          //         <p className="font-medium text-amber-800">Aadhaar Not Verified</p>
          //         <p className="text-sm text-amber-600">Please verify your identity to continue using our services</p>
          //       </div>
          //     </div>

          //     <div className="space-y-2">
          //       <Label htmlFor="aadhaar">Aadhaar Number</Label>
          //       <Input id="aadhaar" placeholder="Enter your Aadhaar number" />
          //     </div>

          //     <Button className="w-full">
          //       Verify with OTP
          //     </Button>
          //   </CardContent>
          // </Card>
          <span></span>
        )}

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
                  <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
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
                  <Link to="/terms&condition" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* <Button variant="destructive" className="w-full">
          Delete Account
        </Button> */}
      </div>

      <MobileBottomNav />
      {/* ============ pan image ===================== */}
      <Dialog open={isPan} onOpenChange={() => setIsPan(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload PAN Card</DialogTitle>
              <DialogDescription>
                Please upload a clear image of your PAN card. This will be
                stored securely.
              </DialogDescription>
            </DialogHeader>

            <Dropzone
              accept={{ "image/*": [] }}
              multiple={false}
              onDrop={async (acceptedFiles) => {
                if (acceptedFiles.length > 0) {
                  const file = acceptedFiles[0];
                  const compressedFile = await compressFile(file); // compress here
                  const localPreview = URL.createObjectURL(compressedFile);

                  setPanPreview(localPreview);
                  setFormData((prev: any) => ({
                    ...prev,
                    panImage: compressedFile, // now it's a compressed File, not Blob
                  }));
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="w-full h-36 object-cover border-2 border-dashed border-muted-foreground rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition"
                >
                  <input {...getInputProps()} />

                  {panPreview ||
                    (typeof formData?.panImage === "string" && formData?.panImage) ? (
                    <img
                      src={panPreview || (formData?.panImage as string)}
                      alt="PAN Card"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center text-muted-foreground">
                      <Camera className="h-8 w-8 mb-2" />
                      <p className="text-sm">
                        Click or drag & drop to upload PAN card
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>


            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={() => {
                  setIsPan(false);
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {modal && <div className="modal bg-white w-full h-screen fixed top-0 right-0 z-50 flex items-center justify-center">
        <div>
          <p className="font-medium">Verifying...({count}s)</p>
        </div>
      </div>}

      {/* <Dialog open={isAadhaar} onOpenChange={() => setIsAadhaar(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Aadhaar Card</DialogTitle>
              <DialogDescription>
                Please upload a clear image of your Aadhaar card. This will be
                stored securely.
              </DialogDescription>
            </DialogHeader>

            <Dropzone
              accept={{ "image/*": [] }}
              multiple={false}
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length > 0) {
                  const file = acceptedFiles[0];
                  const localPreview = URL.createObjectURL(file);

                  setAadhaarPreview(localPreview);
                  setFormData((prev: any) => ({
                    ...prev,
                    aadhaarImage: file,
                  }));
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="w-full h-36 object-cover border-2 border-dashed border-muted-foreground rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition"
                >
                  <input {...getInputProps()} />

                  {aadhaarPreview ||
                    (typeof formData?.aadhaarImage === "string" &&
                      formData?.aadhaarImage) ? (
                    <img
                      src={aadhaarPreview || (formData?.aadhaarImage as string)}
                      alt="Aadhaar Card"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center text-muted-foreground">
                      <Camera className="h-8 w-8 mb-2" />
                      <p className="text-sm">
                        Click or drag & drop to upload Aadhaar card
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={() => {
                  setIsAadhaar(false);
                  dispatch(uploadAadharCard(formData?.aadhaarImage));
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog> */}
    </div>
  );
};

export default AccountSettings;
