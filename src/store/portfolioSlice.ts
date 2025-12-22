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
    portfolioData: [],
    status: STATUSES.IDLE,
}


const portfolioSlice = createSlice({
    name: "portfolio",
    initialState,
    reducers: {
        setPortfolioData: (state, { payload }) => {
            state.portfolioData = payload;
        },
        setStatus: (state, { payload }) => {
            state.status = payload;
        },
        setPortfolio: (state, { payload }) => {
            state.portfolioData.push(payload);
        }
    },
});

export const { setPortfolioData, setStatus, setPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;





// THUNKS
export function createPortfolio(data, image) {
    return async function createPortfolioThunk(dispatch) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await service.createPortfolio(data);
            if (image) {
                await service.uploadPortfolioImage(response.data._id, image);
                successHandler("Portfolio created successfully with image.");
                // dispatch(setPortfolio(response.data));
                dispatch(getAllPortfolio());
                dispatch(setStatus(STATUSES.LOADING));
            }
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        }
    }
}


export function getAllPortfolio() {
    return async function getAllPortfolioThunk(dispatch) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.getAllPortfolio().then((res) => {
                dispatch(setPortfolioData(res.data));
                dispatch(setStatus(STATUSES.IDLE));
            });
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    }
}


export function deletePortfolio(id) {
    return async function deletePortfolioThunk(dispatch) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            await service.deletePortfolio(id).then((res) => {
                dispatch(getAllPortfolio());
                dispatch(setStatus(STATUSES.IDLE));
                successHandler("Portfolio deleted successfully.");
            });
        } catch (error) {
            dispatch(errorHandler(error.response));
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    }
}   