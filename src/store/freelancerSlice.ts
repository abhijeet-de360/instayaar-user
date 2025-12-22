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
    freelancerData: [],
    totalFreelancer: 0,
    status: STATUSES.IDLE,
    freelancerDetails: null
}

const serviceSilce = createSlice({
    name: "freelancer",
    initialState,
    reducers: {
        setFreelancerData(state, action) {
            state.freelancerData = action.payload.result;
            state.totalFreelancer = action.payload.total;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setFreelancerDetails(state, { payload }) {
            state.freelancerDetails = payload
        }
        
    },
})


export const { setFreelancerData, setStatus, setFreelancerDetails } = serviceSilce.actions
export default serviceSilce.reducer;


export function getAllFreelancer(limit, offset, keyword) {
    return async function getAllFreelancerThunk(dispatch: any) {
        dispatch(setLoading(true));
        try {
            await service.getAllFreelancer(limit, offset, keyword).then((response) => {
                if (response.data) {
                    dispatch(setFreelancerData(response.data));
                }
            })
        } catch (error) {
            errorHandler(error.response);
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function freelancerById(id){
    return async function freelancerByIdThunk(dispatch:any){
        dispatch(setLoading(true));
        try {
            await service.getFreelancerById(id).then((response) => {
                if (response.data) {
                    dispatch(setFreelancerDetails(response.data));
                }
            })
        } catch (error) {
            errorHandler(error.response);
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function uploadPanCard(image){
    return async function uploadPanCardThunk(dispatch:any){
        dispatch(setLoading(true));
        try {
            await service.uploadPanCard(image).then((response) => {
                if (response.data) {
                    successHandler("Pan Card Uploaded.");
                }
            })
        } catch (error) {
            errorHandler(error.response);
        } finally {
            dispatch(setLoading(false));
        }
    };

}

export function uploadAadharFrontImage(image){
    return async function uploadAadharFrontImageThunk(dispatch:any){
        dispatch(setLoading(true));
        try {
            await service.uploadAadharFrontImage(image).then((response) => {
                if (response.data) {
                    successHandler("Aadhar Front Image Uploaded.");
                }
            })
        } catch (error) {
            errorHandler(error.response);
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function uploadAadharBackImage(image){
    return async function uploadAadharBackImageThunk(dispatch:any){
        dispatch(setLoading(true));
        try {
            await service.uploadAadharBackImage(image).then((response) => {
                if (response.data) {
                    successHandler("Aadhar Back Image Uploaded.");
                }
            })
        } catch (error) {
            errorHandler(error.response);
        } finally {
            dispatch(setLoading(false));
        }
    };
}