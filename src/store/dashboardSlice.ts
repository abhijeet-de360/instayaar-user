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
  freelancerDashboardData: null,
  status: STATUSES.IDLE,
  userDashboardData: null,

};


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setFreelancerDashboardData: (state, { payload }) => {
      state.freelancerDashboardData = payload;
    },
    setUserDashboardData: (state, { payload }) => {
      state.userDashboardData = payload;
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
  },
});



export const { setFreelancerDashboardData, setUserDashboardData, setStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;


// thunk

export function getUserDashboardData(){
    return async function getUserdashboardDataThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.getUserDashboardData();
            if (response.data) {
                dispatch(setUserDashboardData(response.data));
                dispatch(setStatus(STATUSES.IDLE));
            }
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    }
}



export function getFreelancerDashboardData(){
    return async function getFreelancerDashboardDataThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.getFreelancerDashboardData();
            if (response.data) {
                dispatch(setFreelancerDashboardData(response.data));
                dispatch(setStatus(STATUSES.IDLE));
            }
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    }
}
