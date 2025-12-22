import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";
import { localService } from "@/shared/_session/local";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";


const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading",
});



const initialState = {
    user: null,
    freelancer: null,
    status: STATUSES.IDLE,
    isAuthenticated: localService.get('token') ? true : false,
    role: '',
    chatModal: false,
    gpsPromptShown: false,
};



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload.result;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setAuth(state, { payload }) {
            state.isAuthenticated = payload
        },
        setFreelancer(state, { payload }) {
            state.freelancer = payload.result
        },
        setRole(state, { payload }) {
            state.role = payload
        },
        logout(state, { payload }) {

        },
        setChatModal(state, { payload }) {
            state.chatModal = payload
        },
        setGpsPromptShown(state, { payload }) {
            state.gpsPromptShown = payload;
        },
        setInstantBooking(state, {payload}){
            state.freelancer.instantBooking = payload
        }
    },
});


export const { setUser, setStatus, setAuth, setFreelancer, setRole, logout, setChatModal,setGpsPromptShown, setInstantBooking } = authSlice.actions;
export default authSlice.reducer;








//   thunk

export function setLogout(navigate) {
    return async function logoutThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            localService.clearAll();
            dispatch(setAuth(false));
            successHandler("Logout Successfully.")
            navigate('/')
        } catch (error) {
            errorHandler(error);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function userSendOtp(phoneNumber) {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        try {
            const response = await service.userSentOtp(phoneNumber);
            if (response.data) {
                successHandler("OTP sent successfully");
            }
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            errorHandler(error);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}



export function userVerifyOtp({ phoneNumber, otp, lat, lon, fcm }, navigate, onClose) {
    return async function userVerifyThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.userVerifyOtp({ phoneNumber, otp, lat, lon, fcm });
            if (response?.data) {
                successHandler("OTP verified successfully");
                localService.set("token", response.data?.token);
                localService.set("role", 'user');

                dispatch(setAuth(true));
                dispatch(getUserProfile());
                if (!response.data.latest) {
                    navigate("/profile");
                }
                navigate("/discover");
                onClose();
            }

        } catch (error: any) {
            errorHandler(error?.response || error.message || "Something went wrong");
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getUserProfile() {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const response = await service.getUserProfile();

            if (response?.data) {
                dispatch(setUser(response.data));
                dispatch(setStatus(STATUSES.IDLE));
            } else {
                throw new Error("Invalid response");
            }
        } catch (error: any) {
            errorHandler(error?.response || error.message || "Something went wrong");
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function updateUser(payload) {
    return async function updateUserThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.updateUser(payload);
            if (response.data) {
                successHandler("Profile updated successfully");
                dispatch(getUserProfile());
            }
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function updateUserProfile(image) {
    return async function updateUserThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.updateUserProfile(image).then((response) => {
                if (response.data) {
                    successHandler("Profile image update successfully");
                    dispatch(getUserProfile());
                }
            })
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}





export function freelancerSendOtp(phoneNumber) {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        try {
            const response = await service.freelancerSendOtp(phoneNumber);
            if (response.data) {
                successHandler("OTP sent successfully");
            }
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function freelancerVerifyOtp({ phoneNumber, otp, lat, lon, fcm }, navigate, onClose) {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.freelancerVerifyOtp({ phoneNumber, otp, lat, lon, fcm });
            if (response.data) {
                successHandler("OTP verified successfully");
                dispatch(setAuth(true));
                onClose();
                localService.set("token", response.data?.token);
                localService.set("role", 'freelancer');
                if (response.data.latest === true) {
                    navigate('/account-settings')
                }
                else {
                    navigate('/browse-jobs')
                }

            }
        } catch (error) {
            errorHandler(error?.response || error.message || "Something went wrong");
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getFreelancerProfile() {
    return async function getFreelancerProfileThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.getFreelancerProfile();
            if (response.data) {
                dispatch(setFreelancer(response.data));
                dispatch(setStatus(STATUSES.IDLE));
            }
        } catch (error) {
            errorHandler(error?.response || error.message || "Something went wrong");
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export function updateFreelancer(data, image, panImage, aadharFrontImage, aadharBackImage) {
    return async function updateUserThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const response = await service.updateFreelancerdata(data);

            if (image) {
                await service.updateFreelancerProfile(image);
            }
            if (panImage) {
                await service.uploadPanCard(panImage);
            }
            if (aadharFrontImage) {
                await service.uploadAadharFrontImage(aadharFrontImage);
            }
            if (aadharBackImage) {
                await service.uploadAadharBackImage(aadharBackImage);
            }

            if (response.data) {
                successHandler("Profile updated successfully");
            }
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(getFreelancerProfile());
            dispatch(setLoading(false));
        }
    };
}

export function updateFreelancerImage(image) {
    return async function updateFreelancerImageThunk(dispatch) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.updateFreelancerProfile(image).then((response) => {
                if (response.data) {
                    successHandler("Profile image update successfully");
                    dispatch(getFreelancerProfile());
                }
            })
        }
        catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    }
}


export function updateFreelancerProfile(image) {
    return async function updateUserThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.updateFreelancerProfile(image).then((response) => {
                if (response.data) {
                    successHandler("Profile image update successfully");
                    dispatch(getFreelancerProfile());
                }
            })
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}



export function aadharVerify(data, navigate) {
    return async function aadharVerifyThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const response = await service.aadharVerify(data);
            const redirectUrl = response?.data?.result?.source_output?.redirect_url;

            if (!redirectUrl) {
                console.warn("⚠️ No redirect URL found in Aadhaar verification response");
                dispatch(setStatus(STATUSES.ERROR));
                return;
            }
            navigate("/freelancer-dashboard");
            if (Capacitor.isNativePlatform()) {
                console.log("📱 Running inside Capacitor app — opening in-app browser...");
                const pageLoadedListener = (Browser as any).addListener(
                    "browserPageLoaded",
                    async (event: any) => {
                        const currentUrl = event?.url || "";
                        console.log("🌐 In-app browser navigated to:", currentUrl);
                        if (currentUrl.startsWith("https://kaamdham.com/account-settings?modal=true")) {
                            console.log("✅ Return URL detected — closing browser...");
                            await Browser.close();
                            pageLoadedListener.remove();
                        }
                    }
                );
                const finishedListener = (Browser as any).addListener(
                    "browserFinished",
                    () => {
                        console.log("🧭 Aadhaar verification browser closed manually");
                        finishedListener.remove();
                    }
                );
                await Browser.open({
                    url: redirectUrl,
                    presentationStyle: "fullscreen",
                    toolbarColor: "#ffffff",
                });
            } else {
                console.log("💻 Running on web — redirecting via window.location");
                window.location.href = redirectUrl;
            }
        } catch (error) {
            console.error("❌ Aadhaar verification failed:", error);
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}





export function emailSendOtp(email, setOtpSent) {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.emailSendOtp(email);
            if (response.data) {
                setOtpSent(true);
                successHandler("OTP sent successfully");
                dispatch(setStatus(STATUSES.IDLE));
            }
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    };
}

export function emailVerifyOtp(otp, setEmailModal) {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.emailVerifyOtp(otp);
            if (response.data) {
                successHandler("OTP verified successfully");
                setEmailModal(false)
                dispatch(getFreelancerProfile());
            }
        } catch (error) {
            errorHandler(error?.response || error.message || "Something went wrong");
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function setFreelancerOffDays(dates) {
    return async function setOffDaysThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.setOffDays(dates);
            if (response.data) {
                successHandler("Blocked Dates set successfully");
                // dispatch(getFreelancerProfile());
            }
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function userEmailSent(email, setOtpSent) {
    return async function userEmailSentThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING))
        try {
            await service.userEmailSendOtp(email).then(() => {
                setOtpSent(true);
                successHandler('Otp Sent Successfully.')
                dispatch(setStatus(STATUSES.IDLE))
            })
        } catch (error) {
            errorHandler(error?.response);
            dispatch(setStatus(STATUSES?.IDLE))

        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    }
}


export function userEmailVerifyOtp(data, setEmailModal) {
    return async function useremailVerifyOtpThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.userEmailOtpVerify(data).then((response) => {
                successHandler("Email verified successfully.")
                dispatch(getUserProfile());
                setEmailModal(false)
            })
        } catch (error) {
            errorHandler(error?.response || error.message || "Something went wrong");
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE))
        }
    }
}


export function setInstantBookingFreelancer(data) {
    return async function setInstantBookingThunk(dispatch) {
        try {
            await service.setInstantBooking(data).then((response) => {
                dispatch(setInstantBooking(response.data))
            })
        } catch (error) {
            errorHandler(error);
            dispatch(setLoading(false));
        } finally {
            dispatch(setLoading(false));
        }
    }
}