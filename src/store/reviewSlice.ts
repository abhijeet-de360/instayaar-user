import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";
import { getAllBooking } from "./bookingSlice";

const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const initialState = {
  reviewData: [],
  status: STATUSES.IDLE,
};


const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviewData: (state, { payload }) => {
      state.reviewData = payload.result;
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
  },
});

export const { setReviewData, setStatus } = reviewSlice.actions;
export default reviewSlice.reducer;


// thunk

// export function getAllReview() {
//   return async function getAllReviewThunk(dispatch: any) {
//     dispatch(setLoading(true));
//     dispatch(setStatus(STATUSES.LOADING));
//     try {
//       const response = await service.getAllReview();
//       if (response.data) {
//         dispatch(setReviewData(response.data));
//         dispatch(setStatus(STATUSES.IDLE));
//       }
//     } catch (error) {
//       errorHandler(error.response);
//       dispatch(setStatus(STATUSES.ERROR));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// }

export function createReview(data) {
  return async function createReviewThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.createReview(data);
      if (response.data) {
        dispatch(setStatus(STATUSES.IDLE));
        dispatch(getAllBooking())
        successHandler("Reviewed successfully.");
        return true;
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

export function createJobReview(data) {
  return async function createJobReviewThunk(dispatch: any) {
    dispatch(setLoading(true));
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await service.createJobReview(data);
      if (response.data) {
        dispatch(setStatus(STATUSES.IDLE));
        dispatch(getAllBooking())
        successHandler("Reviewed successfully.");
        return true;
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