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
    status: STATUSES.IDLE,
    freelancerTransactionList: [],
    totalfreelancerTransaction: 0,
    userTransactionList: [],
    totaluserTransaction: 0,
}

const serviceSilce = createSlice({
    name: "transactionSlice",
    initialState,
    reducers: {
        setStatus(state, { payload }) {
            state.status = payload;
        },
        setFreelanTransaction(state, { payload }) {
            state.freelancerTransactionList = payload.result;
            state.totalfreelancerTransaction = payload.total;
        },
        setUserTransaction(state, { payload }) {
            state.userTransactionList = payload.result;
            state.totaluserTransaction = payload.total;
        },

    },
})


export const { setStatus, setFreelanTransaction, setUserTransaction} = serviceSilce?.actions
export default serviceSilce.reducer;


export function getFreelancerTransactions() {
    return async function getFreelancerTransactionsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getFreelancerTransactions().then((response) => {
                if (response.data) {
                    dispatch(setFreelanTransaction(response.data));
                }
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        }
    }
}

export function getUserTransactions() {
    return async function getUserTransactionsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getUserTransactions().then((response) => {
                if (response.data) {
                    dispatch(setUserTransaction(response.data));
                }
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        }
    }
}
