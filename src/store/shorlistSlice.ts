import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";
import { localService } from "@/shared/_session/local";

const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading",
});

const initialState = {
    status: STATUSES?.IDLE,
    shortListData: {}
}


const shortSlice = createSlice({
    name: "short",
    initialState,
    reducers: {
        setStatus(state, { payload }) {
            state.status = payload;
        },
        setShortlistData(state, { payload }) {
            state.shortListData = payload;
        },
    },
})


export const { setStatus, setShortlistData } = shortSlice?.actions;
export default shortSlice.reducer;


// thunk
export function shortListFreelancer(data){
    return async function shortListThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.shortListFreelancer(data).then((response) => {
                if (response?.data) {
                    dispatch(setShortlistData(response?.data))
                }
            });
            dispatch(setStatus(STATUSES.IDLE));
            dispatch(setLoading(false));
        } catch (error) {
            errorHandler(error);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };

}