import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";

const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading",
});

const initialState = {
    serviceData: [],
    totalService: 0,
    status: STATUSES.IDLE,
    serviceDetails: null,
    serviceByCategory: [],
    servicesByFreelancer: [],
}

const serviceSilce = createSlice({
    name: "serviceSlice",
    initialState,
    reducers: {
        setService(state, { payload }) {
            state.serviceData = payload.result;
            state.totalService = payload.total;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setServicrDetails(state, { payload }) {
            state.serviceDetails = payload
        },
        setServiceByCategory(state, { payload }) {
            state.serviceByCategory = payload.result
        },
        setServicesByFreelancer(state, { payload }) {
            state.servicesByFreelancer = payload.result
        },
        sliceServices(state, { payload }) {
            const index = state.serviceData.findIndex((item) => item._id === payload);
            if (index !== -1) {
                state.serviceData.splice(index, 1);
            }
        }
    },
})


export const { setService, setStatus, setServicrDetails, setServiceByCategory, setServicesByFreelancer, sliceServices } = serviceSilce?.actions
export default serviceSilce.reducer;


// thunk
export function ceateService(formData: any, images, navigate) {
    return async function createServiceThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.createService(formData);
            if (response.data) {
                dispatch(setService(response.data));
                if (images.length > 0) {
                    try {
                        for (const img of images) {
                            await service.uploadImages(img, response.data?._id);
                        }
                    } catch (uploadError) {
                        errorHandler(uploadError?.response || uploadError);
                    }
                }
                successHandler("Successfully Service Created.");
                dispatch(getAllServices());
                navigate(-1);
            }
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getAllServices() {
    return async function getAllServicesThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getAllServices().then((response) => {
                if (response.data) {
                    dispatch(setService(response.data));
                    dispatch(setStatus(STATUSES.IDLE));
                }
            })
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function updateService(formData: any, id: string, images: File[], navigate: any) {
    return async function updateServiceThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.updateService(formData, id,);
            if (response.data) {
                dispatch(setService(response.data));
                if (images && images.length > 0) {
                    try {
                        for (const img of images) {
                            await service.uploadImages(img, id);
                        }
                    } catch (uploadError) {
                        errorHandler(uploadError?.response || uploadError);
                    }
                }
                successHandler("Successfully Service Updated.");
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(getAllServices());
                navigate(-1);
            }
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error: any) {
            errorHandler(error?.response || error);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    };
}

export function getServiceById(id: string) {
    return async function getServiceByIdThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getServiceById(id).then((response) => {
                if (response.data) {
                    dispatch(setServicrDetails(response.data))
                    dispatch(setStatus(STATUSES.IDLE));
                }
            })
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    };
}

export function deletedService(id: string) {
    return async function deletedServiceThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.deletedService(id).then((response) => {
                if (response.data) {
                    dispatch(sliceServices(id));
                    successHandler("Successfully Service Deleted.");
                }
            })
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    }
}


export function getServiceByCategoryId(id: string, lat, lng) {
    return async function getServiceByCategoryIdThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getServiceByCategoryId(id, lat, lng).then((response) => {
                if (response.data) {
                    dispatch(setServiceByCategory(response.data));
                }
                dispatch(setStatus(STATUSES.IDLE));
            })
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getServicesByFreelancer(id: string) {
    return async function getServicesByFreelancerThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getServicesByFreelancer(id).then((response) => {
                if (response.data) {
                    dispatch(setServicesByFreelancer(response.data));
                }
                dispatch(setStatus(STATUSES.IDLE));
            })
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

