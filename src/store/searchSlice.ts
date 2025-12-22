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
  serviceSearchData: [],
  status: STATUSES.IDLE,
};

const serviceSearchSlice = createSlice({
  name: "serviceSearch",
  initialState,
  reducers: {
    setServiceSearchData: (state, { payload }) => {
      state.serviceSearchData = payload;
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
  },
});


export const { setServiceSearchData, setStatus } = serviceSearchSlice.actions;
export default serviceSearchSlice.reducer;


// thunk
export function searchService(data){
    return async function searchServiceThunk(dispatch:any){
        // dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.searchService(data);
            if(response.data){
                dispatch(setServiceSearchData(response.data));
                dispatch(setStatus(STATUSES.IDLE));
            }
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            // dispatch(setLoading(false));
        }
    }
}