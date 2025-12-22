import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";
import { getFreelancerProfile } from "./authSlice";

const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading",
});


const initialState = {
    widthrawal: [],
    walletWithdrawl: [],
    status: STATUSES.IDLE,
}


const widthrawalSlice = createSlice({
    name: "widthrawal",
    initialState,
    reducers: {
        setWidthrawal(state, {payload}) {
            state.widthrawal = payload;
        },
        setStatus(state, {payload}) {
            state.status = payload;
        },
        setWalletWidthrawal(state, {payload}) {
            state.walletWithdrawl = payload.result;
        }
    },
})



export const { setWidthrawal, setStatus,setWalletWidthrawal } = widthrawalSlice?.actions;
export default widthrawalSlice.reducer;



export function getAllWidthrawal() {
    return async function getWidthrawalThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getAllWidthrawal().then((response) => {
                if (response.data) {
                    dispatch(setWidthrawal(response.data));
                    dispatch(setLoading(false));
                    dispatch(setStatus(STATUSES.IDLE));
                }
            })
        } catch (error) {
            errorHandler(error);
            dispatch(setLoading(false));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    };
}


export function createWidthrawal(data: any) {
    return async function createWidthrawalThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING))
        try {
            await service.widthrawalRequest(data).then((response) => {
                if (response.data) {
                    dispatch(getAllWalletWidthrawal())
                    dispatch(setLoading(false));
                    dispatch(setStatus(STATUSES.IDLE));
                    dispatch(getFreelancerProfile());
                    successHandler(response.data);
                }
            })
        } catch (error) {
            errorHandler(error);
            dispatch(setLoading(false));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    };
}

export function addPaymentMethod(data: any) {
    return async function addPaymentMethodThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING))
        try {
            await service.addPaymentMethod(data).then((response) => {
                if (response.data) {
                    dispatch(setLoading(false));
                    dispatch(setStatus(STATUSES.IDLE));
                    dispatch(getFreelancerProfile());
                    successHandler("Payment Method Added.");
                }
            })
        } catch (error) {
            errorHandler(error);
            dispatch(setLoading(false));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    };
}

export function getAllWalletWidthrawal() {
    return async function getAllWalletWidthrawalThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getAllWalletWidthrawal().then((response) => {
                if (response.data) {
                    dispatch(setWalletWidthrawal(response.data));
                    dispatch(setLoading(false));
                    dispatch(setStatus(STATUSES.IDLE));
                }
            })
        } catch (error) {
            errorHandler(error);
            dispatch(setLoading(false));
        } finally {
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        }
    };
}