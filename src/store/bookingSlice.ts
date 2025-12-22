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
  bookingData: [],
  activeBookingData: [],
  status: STATUSES.IDLE,
  bookingDetails: {},
  freelancerBookings: {
    all: { result: [], total: 0 },
    completed: { result: [], total: 0 },
    currentMonth: 0,
    cancelledBooking: 0
  },
  modalOpen: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    closeModal: (state, {payload}) => {
      state.modalOpen = payload
    },
    setBookingData: (state, { payload }) => {
      state.bookingData = payload.result;
    },
    setActiveBookingData: (state, { payload }) => {
      state.activeBookingData = payload.result;
    },
    setBookingDetails: (state, { payload }) => {
      state.bookingDetails = payload;
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setFreelancerBookings: (state, { payload }) => {
      state.freelancerBookings = payload;
    },

    setStatusUpdate: (state, { payload }) => {
      const index = state.freelancerBookings?.all?.result?.findIndex(
        (item) => item?.data?._id === payload?.id
      );

      if (index !== -1) {
        state.freelancerBookings.all.result[index].data.status = payload?.status;
      }
    },
    setBookingCompleted: (state, { payload }) => {
      const index = state.freelancerBookings.all.result.findIndex(
        (item) => item.data._id === payload._id
      );

      if (index !== -1) {
        const completedBooking = state.freelancerBookings.all.result[index];
        completedBooking.data.status = "completed";

        state.freelancerBookings.all.result.splice(index, 1);

        if (!state.freelancerBookings.completed) {
          state.freelancerBookings.completed = { result: [], total: 0 };
        }

        state.freelancerBookings.completed.result.push(completedBooking);
        state.freelancerBookings.completed.total += 1;
      }
    },
    removeBookingById: (state, { payload }) => {
      state.freelancerBookings.all.result = state.freelancerBookings.all.result.filter(
        (item) => item.data._id !== payload
      );

      state.freelancerBookings.all.total -= 1;
    }

  },
});

export const { closeModal, setBookingData, setActiveBookingData,setBookingDetails, setStatus, setFreelancerBookings, setStatusUpdate, setBookingCompleted, removeBookingById } = bookingSlice.actions;

export default bookingSlice.reducer;




export function createBooking(data: any) {
  return async function createBookingThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.createBooking(data);
      dispatch(setBookingDetails(response.data));
      dispatch(setStatus(STATUSES.IDLE));
    } catch (error: any) {
      errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAllBooking() {
  return async function getAllBookingThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.getAllBooking();
      if (response.data) {
        dispatch(setBookingData(response.data));
        dispatch(setStatus(STATUSES.IDLE));
      }
    } catch (error) {
      errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAllActiveBooking() {
  return async function getAllActiveBookingThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.getAllActiveBooking();
      if (response.data) {
        dispatch(setActiveBookingData(response.data));
        dispatch(setStatus(STATUSES.IDLE));
      }
    } catch (error) {
      errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAllFreelancerBookings(limit, offset, allLimit, allOffset) {
  return async function getAllFreelancerBookingsThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.getAllFreelancerBookings(limit, offset, allLimit, allOffset);
      if (response.data) {
        dispatch(setFreelancerBookings(response.data));
        dispatch(setStatus(STATUSES.IDLE));
      }
    } catch (error) {
      errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
      dispatch(setStatus(STATUSES.IDLE));
    }
  };
}

export function confirmBooking(id: string) {
  return async function confirmBookingThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.confirmBooking(id);
      if (response.data) {
        dispatch(setStatusUpdate({ id, status: "confirmed" }));
        dispatch(setStatus(STATUSES.IDLE));
      }
    } catch (error: any) {
      errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function startBooking(id: string, otp) {
  return async function startBookingThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await service.startBooking(id, otp);
      if (response.data) {
        dispatch(setStatusUpdate({ id, status: "onGoing" }));
        dispatch(setStatus(STATUSES.IDLE));
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function completeBooking(id: string, otp) {
  return async function completeBookingThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await service.completeBooking(id, otp);
      if (response.data) {
        dispatch(setBookingCompleted({ _id: id }));
        dispatch(setStatus(STATUSES.IDLE));
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function cancelBooking(id: string) {
  return async function cancelBookingThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.cancelBooking(id);
      if (response.data) {
        dispatch(removeBookingById(id));
        dispatch(setStatus(STATUSES.IDLE));
        successHandler("Booking successfully canceled.");
      }
    } catch (error: any) {
      dispatch(closeModal(true))
      // errorHandler(error.response);
      dispatch(setStatus(STATUSES.ERROR));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

