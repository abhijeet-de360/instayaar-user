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

import { AppUpdate, AppUpdateAvailability, AppUpdateResultCode, FlexibleUpdateInstallStatus, } from "@capawesome/capacitor-app-update";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import Agreement from "./pages/Agreement";
import ClientAgreement from "./pages/ClientAgreement";



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

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const checkForUpdate = async () => {
      try {
        const info = await AppUpdate.getAppUpdateInfo();
        if (info.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
          return;
        }
        const isCriticalUpdate = info.updatePriority !== undefined && info.updatePriority >= 2;

        if (Capacitor.getPlatform() === "android") {
          if (isCriticalUpdate && info.immediateUpdateAllowed) {
            const result = await AppUpdate.performImmediateUpdate();
          } else if (info.flexibleUpdateAllowed) {
            const result = await AppUpdate.startFlexibleUpdate();
            await AppUpdate.addListener(
              "onFlexibleUpdateStateChange",
              (state) => {
                if (state.installStatus === FlexibleUpdateInstallStatus.DOWNLOADED) {
                  AppUpdate.completeFlexibleUpdate();
                }

                if (state.installStatus === FlexibleUpdateInstallStatus.FAILED) {
                }

                if (state.installStatus === FlexibleUpdateInstallStatus.CANCELED) {
                }
              }
            );
          } else {
            console.warn("⚠️ No allowed update type");
          }
        }

        if (Capacitor.getPlatform() === "ios") {
          console.log("🍎 iOS update available — redirect to App Store");
          await AppUpdate.openAppStore({ appId: "6757517329" });
        }
      } catch (err) {
        console.error("❌ Update check failed:", err);
      }
    };

    checkForUpdate();
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
                  element={(() => {
                    const isAuth = authvar?.isAuthenticated;
                    const role = localService.get("role");
                    const agreementAccepted = localService.get("agreementAccepted") === "true";
                    console.log(agreementAccepted)
                    const path = window.location.pathname;
                    if (path !== "/") {
                      return null;
                    }
                    if (isAuth) {
                      if (role === "freelancer" && agreementAccepted === false) {
                        return <Navigate to="/freelancer-agreement" replace />;
                      }
                      if (role === "user" && agreementAccepted === false) {
                        return <Navigate to="/client-agreement" replace />;
                      }
                      if (role === "freelancer") {
                        return <Navigate to="/browse-jobs" replace />;
                      }
                      return <Navigate to="/discover" replace />;
                    }
                    return (
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    );
                  })()}
                />
                <Route path="/employer-dashboard" element={<PrivateRoute><EmployerDashboard /></PrivateRoute>} />
                <Route path="/freelancer-dashboard" element={<PrivateRoute><FreelancerDashboard /></PrivateRoute>} />
                <Route path="/post-job" element={<PrivateRoute><PostJob /></PrivateRoute>} />
                <Route path="/edit-job/:id" element={<PrivateRoute><EditJob /></PrivateRoute>} />
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
                <Route path="/freelancer-reviews" element={<PrivateRoute><FreelancerReviews /></PrivateRoute>} />
                <Route path="/freelancer-reviews/:id" element={<PrivateRoute><FreelancerReviews /></PrivateRoute>} />
                <Route path="/account-settings" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />
                <Route path="/user-account-settings" element={<PrivateRoute><UserAccountSetting /></PrivateRoute>} />
                <Route path="/help-support" element={<PrivateRoute><HelpSupport /></PrivateRoute>} />
                <Route path="/instant-booking" element={<PrivateRoute><InstantBooking /></PrivateRoute>} />
                <Route path="/browse-jobs" element={<PrivateRoute><BrowseJobs /></PrivateRoute>} />
                <Route path="/my-services" element={<PrivateRoute><MyServices /></PrivateRoute>} />
                <Route path="/earnings" element={<PrivateRoute><Earnings /></PrivateRoute>} />
                <Route path="/my-jobs" element={<PrivateRoute><MyJobs /></PrivateRoute>} />
                <Route path="/applied-jobs" element={<PrivateRoute><AppliedJobs /></PrivateRoute>} />
                <Route path="/create-service" element={<PrivateRoute><CreateService /></PrivateRoute>} />
                <Route path="/edit-service/:id" element={<PrivateRoute><EditService /></PrivateRoute>} />
                <Route path="/my-posts" element={<PrivateRoute><MyPosts /></PrivateRoute>} />
                <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
                <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
                <Route path="/offday" element={<PrivateRoute><MobileOFFday /></PrivateRoute>} />
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
                <Route path="/freelancer-agreement" element={<PrivateRoute><Agreement /></PrivateRoute>} />
                <Route path="/client-agreement" element={<PrivateRoute><ClientAgreement /></PrivateRoute>} />

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
