import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";
import { localService } from "@/shared/_session/local";
import { getallFreelancerJobs } from "./jobSlice";

const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const initialState = {
  status: STATUSES.IDLE,
  appliedJobs: [],
};

const jobApplicationSlice = createSlice({
  name: "jobApplication",
  initialState,
  reducers: {
    setStatus(state, { payload }) {
      state.status = payload;
    },
    setAppliedJobs(state, { payload }) {
      state.appliedJobs = payload;
    },
    setJobApplicationStatus(state, { payload }) {
      const objIndex = state.appliedJobs.findIndex(
        (obj) => obj.freelancerId?._id === payload
      );

      if (objIndex !== -1) {
        state.appliedJobs[objIndex].status = "hired";
      }
    },
  },
});

export const { setStatus, setAppliedJobs, setJobApplicationStatus } =
  jobApplicationSlice?.actions;
export default jobApplicationSlice.reducer;

// thunk

export function createJobApplication(id, data, lat, lng) {
  return async function createJobApplicationThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await service.createJobApplicatiion(id, data).then((response) => {
        if (response?.data) {
          successHandler("Successfully Applied.");
          dispatch(getallFreelancerJobs(100, 0, "", lat, lng));
        }
      });
      dispatch(setStatus(STATUSES.IDLE));
    } catch (error) {
      errorHandler(error);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getJobApplicationById(id) {
  return async function getJobApplicationByIDThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.getJobApplicationByID(id);
      if (response?.data) {
        dispatch(setAppliedJobs(response.data));
        dispatch(setStatus(STATUSES.IDLE));
      }
    } catch (error) {
      errorHandler(error);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAllAppliedJob() {
  return async function getAllAppliedJobThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await service.getAllAppliedJob().then((response) => {
        if (response?.data) {
          dispatch(setAppliedJobs(response.data));
          dispatch(setStatus(STATUSES.IDLE));
        }
      });
    } catch (error) {
      errorHandler(error);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function cancelJobApplication(id) {
  return async function cancelJobApplicationThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await service.cancelJobApplication(id).then((response) => {
        if (response?.data) {
          successHandler("Successfully Cancelled.");
          dispatch(getAllAppliedJob());
        }
      });
      dispatch(setStatus(STATUSES.IDLE));
    } catch (error) {
      errorHandler(error);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}
