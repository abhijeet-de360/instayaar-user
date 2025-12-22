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
    instantBookingJobData: null,
    status: STATUSES.IDLE,
    bookingsListForFreelancer: [],
    bookingsListForFreelancerTotal: 0,
    instantShortListData: {}
}


const instantBookingSlice = createSlice({
    name: 'instantBooking',
    initialState,
    reducers: {
        setStatus(state, { payload }) {
            state.status = payload;
        },
        setInstantBookingJobData(state, { payload }) {
            state.instantBookingJobData = payload;
        },
        setBooking(state, { payload }) {
            state.instantBookingJobData = (payload);
        },
        setBookingsListForFreelancer(state, { payload }) {
            state.bookingsListForFreelancer = payload.result;
            state.bookingsListForFreelancerTotal = payload.total
        },
        jobBookingStatusChange(state, { payload }) {
            const objIndex = state.bookingsListForFreelancer.findIndex((obj) => obj._id === payload.jobId);
            if (objIndex !== -1) {
                state.bookingsListForFreelancer[objIndex].applicationStatus = 'applied';
            }
        },
        jobStartAndCompleteStatus(state, action) {
            const { payload, status } = action.payload;

            const objIndex = state.bookingsListForFreelancer
                .findIndex((obj) => obj.appliedJobId === payload._id);

            if (objIndex !== -1) {
                state.bookingsListForFreelancer[objIndex].applicationStatus = status;
            }
        },
        setInstantShortListData(state, { payload }) {
            state.instantShortListData = payload
        }

    }
})


export const { setStatus, setInstantBookingJobData, setBooking, setBookingsListForFreelancer, jobBookingStatusChange, setInstantShortListData, jobStartAndCompleteStatus } = instantBookingSlice.actions;
export default instantBookingSlice.reducer;

export function getInstantBookingData() {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.getInstantBookingData().then((response) => {
                dispatch(setInstantBookingJobData(response.data));
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function postInstantBooking(data) {
    return async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.postInstantBooking(data).then((response) => {
                dispatch(setBooking(response.data));
                dispatch(setLoading(false));
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function cancelInstantBooking(status, id) {
    return async function cancelInstantBookingThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.updateJobStatus(status, id).then((response) => {
                dispatch(setBooking({ result: null }));
                dispatch(setLoading(false));
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getBookingsForFreelancer(limit, offset, lat, lng) {
    return async function getFreelancerBookingsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.getBookingsForFreelancerInstant(limit, offset, lat, lng).then((response) => {
                dispatch(setBookingsListForFreelancer(response.data));
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function bidInstantBooking(id, data, setBidAmount, setOpen) {
    return async function bidInstantBookingThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.createJobApplicatiion(id, data).then((response) => {
                console.log(response)
                dispatch(jobBookingStatusChange(response.data));
                dispatch(setLoading(false));
                setBidAmount('');
                setOpen(false);
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setLoading(false));
            dispatch(setStatus(STATUSES.IDLE));
        } finally {
            dispatch(setStatus(STATUSES.IDLE));
            dispatch(setLoading(false));
        }
    };
}

export function acceptInstateJobBooking(data) {
    return async function acceptInstateJobBookingThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.shortListFreelancer(data).then((response) => {
                if (response.data) {
                    dispatch(setInstantShortListData(response.data));
                }
                dispatch(setLoading(false));
                dispatch(setStatus(STATUSES.IDLE));
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function startInstantBooking(id, otp, setOtp, setOtpModal, setJobId) {
    return async function startInstantBookingThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.startJobApplication(id, otp).then((response) => {
                dispatch(jobStartAndCompleteStatus({ payload: response.data, status: 'inProgress' }));
                dispatch(setLoading(false));
                setOtp('');
                setOtpModal(false);
                setJobId('');
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function completeInstantBooking(id, otp, setOtp, setOtpModal, setJobId) {
    return async function completeInstantBookingThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));

        try {
            await service.completeJobApplication(id, otp).then((response) => {
                dispatch(jobStartAndCompleteStatus({ payload: response.data, status: 'completed' }));
                dispatch(setLoading(false));
                setOtp('');
                setOtpModal(false);
                setJobId('');
                dispatch(getBookingsForFreelancer(20, 0, '', ''))
            });
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}