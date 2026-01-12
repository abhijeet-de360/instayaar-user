import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { CentralizedLoginModal } from "@/components/auth/CentralizedLoginModal";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import EmployerDashboard from "./pages/EmployerDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import PostJob from "./pages/PostJob";
import MyBookings from "./pages/MyBookings";
import PaymentHistory from "./pages/PaymentHistory";
import FreelancerReviews from "./pages/FreelancerReviews";
import AccountSettings from "./pages/AccountSettings";
import HelpSupport from "./pages/HelpSupport";
import BrowseJobs from "./pages/BrowseJobs";
import MyServices from "./pages/MyServices";
import MyJobs from "./pages/MyJobs";
import AppliedJobs from "./pages/AppliedJobs";
import CreateService from "./pages/CreateService";
import MyPosts from "./pages/MyPosts";
import Messages from "./pages/Messages";
import Wallet from "./pages/Wallet";
import ShortlistFreelancersPage from "./pages/ShortlistFreelancers";
import ShortlistJobs from "./pages/ShortlistJobs";
import Discover from "./pages/Discover";
import JobApplications from "./pages/JobApplications";
import Chat from "./pages/Chat";
import FreelancerProfile from "./pages/FreelancerProfile";
import BookService from "./pages/BookService";
import FreelancerServices from "./pages/FreelancerServices";
import { PlatformBooking } from "./pages/PlatformBooking";
import MultiServiceBooking from "./pages/MultiServiceBooking";
import PortfolioGallery from "./pages/PortfolioGallery";
import Earnings from "./pages/Earnings";
import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import EditService from "./pages/EditService";
import { App as CapApp } from "@capacitor/app";
import { Toast } from "@capacitor/toast";
import EditJob from "./pages/EditJob";
import UserAccountSetting from "./pages/UserAccountSetting";
import Footer from "./components/Footer/Footer";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import TermsAndConditions from "./components/Footer/TermsAndConditions";
import DataDeletion from "./components/Footer/DataDeletion";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { localService } from "./shared/_session/local";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { chatSocket } from "./lib/socket";
import WebLanding from "./pages/WebLanding";
import Dispute from "./pages/Dispute";
import MobileOFFday from "./components/mobile/MobileOFFday";
import InstantBooking from "./pages/InstantBooking";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { getBookingsForFreelancer, getInstantBookingData } from "./store/instantBookingSlice";
import { requestAppPermissions } from "./shared/_services/permissions/useAppPermissions";
import { setCoords, setLocationName, setPermissionDenied, } from "@/store/locationSlice";
import { Geolocation } from "@capacitor/geolocation";



declare global {
  interface Window {
    fcmToken?: string;
  }
}
const queryClient = new QueryClient();



const App = () => {
  const lastBackPress = useRef<number>(0);
  const navigate = useNavigate();
  const authvar = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();
  const loaderVar = useSelector((state: RootState) => state?.loader)

  useEffect(() => {
    if (authvar?.isAuthenticated) {
      chatSocket.connect();
      if (localService?.get("role") === "user") {
        chatSocket.emit("userConnect", { token: localService?.get("token") });
      } else {
        chatSocket.emit("freelancerConnect", {
          token: localService?.get("token"),
        });
      }
    }
  }, [authvar?.isAuthenticated]);


  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const reg = PushNotifications.addListener("registration", (token) => {
      console.log("✅ FCM TOKEN:", token.value);
      window.fcmToken = token.value;
    });

    const err = PushNotifications.addListener("registrationError", (e) => {
      console.error("❌ FCM ERROR:", e);
    });

    const action = PushNotifications.addListener("pushNotificationActionPerformed", (event) => {
      const data = event.notification.data || {};
      if (data.navigateTo) navigate(data.navigateTo);
    });

    return () => {
      reg.remove();
      err.remove();
      action.remove();
    };
  }, []);


  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.show();
      StatusBar.setBackgroundColor({ color: "#ffffff" });
      StatusBar.setStyle({ style: Style.Light });
      EdgeToEdge.enable();
      const listener = CapApp.addListener("backButton", async ({ canGoBack }) => {
        const now = Date.now();
        if (canGoBack) window.history.back();
        else if (now - lastBackPress.current < 2000) CapApp.exitApp();
        else {
          lastBackPress.current = now;
          await Toast.show({ text: "Press back again to exit", duration: "short", });
        }
      })
      return () => {
        listener.remove();
      };
    }
  }, []);

  useEffect(() => {
    requestAppPermissions()
  }, []);


  const handleLogout = () => {
    localService.clearAll();
    navigate("/");
    window.location.reload();
  };


  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const path = window.location.pathname;

      const allowedPaths = [
        "/home",
        "/privacy-policy",
        "/data-deletion",
        "/terms&condition",
      ];

      if (width > 768 && !allowedPaths.includes(path)) {
        window.location.href = "/home";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [window.location.pathname]);

  useEffect(() => {
    const handleNewInstantJob = async (data: any) => {
      dispatch(getBookingsForFreelancer(20, 0, authvar?.freelancer?.lat, authvar?.freelancer?.lng));

      toast("New Instant Booking", {
        description: data?.title || "You received a new job request",
        duration: 5000,
      });

      const audio = new Audio("/notification.mp3");
      audio.play().catch((e) => console.warn("🔇 Sound error:", e));

      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now(),
              title: "New Instant Booking",
              body: data?.title || "You received a job request",
              schedule: { at: new Date(Date.now() + 100) },
            },
          ],
        });
      } else if (Notification.permission === "granted") {
        new Notification("New Instant Booking", { body: data?.title || "You received a new job request" });
      }
    };

    chatSocket.on("newInstantJob", handleNewInstantJob);
    chatSocket.on("instantCancelled", () => dispatch(getBookingsForFreelancer(20, 0, authvar?.freelancer?.lat, authvar?.freelancer?.lng)));
    chatSocket.on("instantCancelledUser", () => dispatch(getInstantBookingData()));
    chatSocket.on("newBid", () => dispatch(getInstantBookingData()));
    chatSocket.on("instantStarted", () => dispatch(getInstantBookingData()));
    chatSocket.on("instantEnded", () => dispatch(getInstantBookingData()));
    chatSocket.on("instantAccepted", () => {
      if (localService.get("role") === "user") dispatch(getInstantBookingData());
      else dispatch(getBookingsForFreelancer(20, 0, authvar?.freelancer?.lat, authvar?.freelancer?.lng));
    });

    return () => {
      chatSocket.off("newInstantJob", handleNewInstantJob);
      chatSocket.off("instantCancelled");
      chatSocket.off("instantCancelledUser");
      chatSocket.off("newBid");
      chatSocket.off("instantStarted");
      chatSocket.off("instantEnded");
      chatSocket.off("instantAccepted");
    };
  }, []);


  useEffect(() => {
    const log = (msg: string, data?: any) => console.log(`📍 CapLocation: ${msg}`, data ?? "");

    const getAndSetLocation = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          let perm = await Geolocation.checkPermissions();
          log("Permission check", perm);

          if (perm.location !== "granted") {
            perm = await Geolocation.requestPermissions();
            log("Permission request result", perm);
            if (perm.location !== "granted") {
              log("Permission denied by user");
              dispatch(setPermissionDenied(true));
              return;
            }
          }

          const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
          log("Location success", pos.coords);

          dispatch(setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }));

          // Reverse geocode
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.county;
          const state = data?.address?.state;
          dispatch(setLocationName(`${city || "Unknown"}, ${state || ""}`));
        } else {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              log("Web location success", pos.coords);
              dispatch(setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
            },
            (err) => {
              log("Web location error", err);
              dispatch(setPermissionDenied(true));
            },
            { enableHighAccuracy: true, timeout: 15000 }
          );
        }
      } catch (err) {
        log("Failed to get location", err);
        dispatch(setPermissionDenied(true));
      }
    };

    // Initial fetch
    getAndSetLocation();

    // Retry on resume
    const resumeListener = CapApp.addListener("resume", getAndSetLocation);
    return () => resumeListener.remove();
  }, []);




  if (authvar?.freelancer?.status === 'suspended' && localService.get('role') === 'freelancer')
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/10">
        <Card className="max-w-sm w-full p-6 text-center shadow-md">
          <CardContent>
            <h2 className="text-lg font-semibold text-destructive">
              Your account has been suspended
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Please contact support for further assistance.
            </p>
            <Button
              className="mt-4 w-full"
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );

    if (authvar?.user?.status === 'suspended' && localService.get('role') === 'user')
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/10">
        <Card className="max-w-sm w-full py-6 px-4 text-center shadow-md">
          <CardContent>
            <h2 className="text-lg font-semibold text-destructive">
              Your account has been suspended
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Please contact support for further assistance.
            </p>
            <Button
              className="mt-4 w-32"
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserRoleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div
              className="min-h-screen"
              style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
                paddingBottom: "env(safe-area-inset-bottom, 64px)",
                paddingLeft: "env(safe-area-inset-left, 0px)",
                paddingRight: "env(safe-area-inset-right, 0px)",
              }}
            >
              <ScrollToTop />
              <CentralizedLoginModal />

              <Routes>
                <Route
                  path="/"
                  element={
                    authvar?.isAuthenticated ? (
                      localService.get("role") === "user" ? (
                        <Navigate to="/discover" replace />
                      ) : localService.get("role") === "freelancer" ? (
                        <Navigate to="/browse-jobs" replace />
                      ) : (
                        <Navigate to="/discover" replace />
                      )
                    ) : (
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    )
                  }
                />

                <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/edit-job/:id" element={<EditJob />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/payment-history" element={<PaymentHistory />} />
                <Route path="/freelancer-reviews" element={<FreelancerReviews />} />
                <Route path="/freelancer-reviews/:id" element={<FreelancerReviews />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/user-account-settings" element={<UserAccountSetting />} />
                <Route path="/help-support" element={<HelpSupport />} />
                <Route path="/instant-booking" element={<InstantBooking />} />
                <Route path="/browse-jobs" element={<BrowseJobs />} />
                <Route path="/my-services" element={<MyServices />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/my-jobs" element={<MyJobs />} />
                <Route path="/applied-jobs" element={<AppliedJobs />} />
                <Route path="/create-service" element={<CreateService />} />
                <Route path="/edit-service/:id" element={<EditService />} />
                <Route path="/my-posts" element={<MyPosts />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/offday" element={<MobileOFFday />} />
                <Route path="/shortlist" element={<Navigate to="/shortlist-freelancers" replace />} />
                <Route path="/shortlist-freelancers" element={<ShortlistFreelancersPage />} />
                <Route path="/shortlist-jobs" element={<ShortlistJobs />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/job-applications/:jobId" element={<JobApplications />} />
                <Route path="/chat/:conversationId" element={<Chat />} />
                <Route path="/freelancer-profile/:freelancerId" element={<FreelancerProfile />} />
                <Route path="/platform-booking" element={<PlatformBooking />} />
                <Route path="/platform-booking/:serviceId" element={<PlatformBooking />} />
                <Route path="/book-service/:serviceId" element={<BookService />} />
                <Route path="/freelancer-services/:freelancerId" element={<FreelancerServices />} />
                <Route path="/multi-service-booking/:id" element={<MultiServiceBooking />} />
                <Route path="/portfolio-gallery" element={<PortfolioGallery />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms&condition" element={<TermsAndConditions />} />
                <Route path="/data-deletion" element={<DataDeletion />} />
                <Route path="/home" element={<WebLanding />} />
                <Route path="/dispute" element={<Dispute />} />
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </TooltipProvider>
        </UserRoleProvider>
      </QueryClientProvider>

      {loaderVar?.loading && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-white pointer-events-none h-screen">
          <div className="loader pointer-events-auto">
          </div>
        </div>
      )}

    </>
  );
};
export default App;
