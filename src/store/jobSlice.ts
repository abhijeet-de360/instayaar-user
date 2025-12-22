import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";
import { getAllFreelancerBookings } from "./bookingSlice";

const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading",
});


const initialState = {
    jobsData: [],
    allJobs: [],
    status: STATUSES.IDLE,
    active: 0,
    pending: 0,
    completed: 0,
    total: 0,
    JobDetails: '',
    recentJobs: [],
    jobModalOpen: false,
}



const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        closeJobsModal: (state, {payload}) => {
            state.jobModalOpen = payload
        },
        setJobsData(state, { payload }) {
            state.jobsData = payload.result;
            state.active = payload.active;
            state.pending = payload.pending;
            state.completed = payload.completed;
            state.total = payload.total;
        },
        setStatus(state, { payload }) {
            state.status = payload;
        },
        setJobDetails(state, { payload }) {
            state.JobDetails = payload;
        },
        setAllJobs(state, { payload }) {
            state.allJobs = payload.result;
        },
        setRecentJobs(state, {payload}){
            state.recentJobs = payload
        },
    },
});

export const { closeJobsModal, setJobsData, setStatus, setJobDetails, setAllJobs,setRecentJobs } = jobSlice.actions;

export default jobSlice.reducer;








// thunk

export function createJob(payload, navigate) {
    return async function createJobThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.createJob(payload).then((response) => {
                navigate('/my-posts');
                dispatch(getMyJobs(10, 0));
                dispatch(successHandler("Job created successfully"));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getMyJobs(limit, offset) {
    return async function getMyJobsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getMyJobs(limit, offset).then((response) => {
                dispatch(setJobsData(response.data));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getJobById(id) {
    return async function getJobByIdThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getJobById(id).then((response) => {
                dispatch(setJobDetails(response.data));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function updateJobStatus(status, id) {
    return async function updateJobStatusThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.updateJobStatus(status, id).then((response) => {
                dispatch(getMyJobs(20, 0));
                if(status === 'deleted'){
                    dispatch(successHandler("Job deleted successfully"));
                }else{
                    dispatch(successHandler("Job status updated successfully"));
                }
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function updateJob(id, data, navigate){
    return async function updateJobThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.updateJob(id, data).then((response) => {
                navigate('/my-posts');
                dispatch(getMyJobs(50, 0));
                dispatch(successHandler("Job updated successfully"));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getallJobs(limit, offset){
    return async function getallJobsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getAllJobs(limit, offset).then((response) => {
                dispatch(setAllJobs(response.data));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getRecentJobs(){
    return async function getallJobsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getRecentJobs().then((response) => {
                dispatch(setRecentJobs(response.data));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getallFreelancerJobs(limit, offset, categoryId, lat, lng){
    return async function getallJobsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getAllFreelancerJobs(limit, offset, categoryId, lat, lng).then((response) => {
                dispatch(setAllJobs(response.data));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function confirmJobApplication(id){
    return async function confirmJobApplicationThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.confirmJobApplication(id).then((response) => {
                // dispatch(successHandler("Job confirmed successfully"));
                dispatch(getAllFreelancerBookings(100, 0, 100, 0));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function rejectJobApplication(id){
    return async function rejectJobApplicationThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.rejectJobApplication(id).then((response) => {
                // dispatch(successHandler("Job rejected successfully"));
                dispatch(getAllFreelancerBookings(100, 0, 100, 0));
                return response.data;
            });
            dispatch(setStatus(STATUSES.IDLE));
        } catch (error) {
            dispatch(closeJobsModal(true));
            // dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function startJobApplication(id: string, otp: any) {
  return async function startJobThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.startJobApplication(id, otp);
    //   dispatch(successHandler("Job started successfully"));
      await dispatch(getAllFreelancerBookings(100, 0, 100, 0));
      dispatch(setStatus(STATUSES.IDLE));
      return response.data;
    } catch (error: any) {
      dispatch(errorHandler(error?.response));
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}


export function completJobApplication(id, otp) {
  return async function completeJobThunk(dispatch) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.completeJobApplication(id, otp);
    //   dispatch(successHandler("Job completed successfully"));
      await dispatch(getAllFreelancerBookings(100, 0, 100, 0));
      dispatch(setStatus(STATUSES.IDLE));
      return response.data;
    } catch (error) {
      dispatch(errorHandler(error.response));
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}
