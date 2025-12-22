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
    categoryData: [],
    homeCategoryData: [],
    status: STATUSES.IDLE,
}


const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategory(state, action) {
            state.categoryData = action.payload.result;
        },
        setHomePageService(state, action) {
            state.homeCategoryData = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
    },
})

export const { setCategory, setHomePageService, setStatus } = categorySlice?.actions

export default categorySlice.reducer;



// thunk
export function getCategories() {
    return async function getCategoriesThunk(dispatch: any) {
        dispatch(setLoading(true));
        try {
            await service.getCategories().then((response) => {
                if (response.data) {
                    dispatch(setCategory(response.data));
                    dispatch(setLoading(false));
                }
            })
        } catch (error) {
            errorHandler(error);
            dispatch(setLoading(false));
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getHomePageCategoryServices() {
    return async function getHomePageCategoryServicesThunk(dispatch: any) {
        dispatch(setLoading(true));
        try {
            await service.getHomePageCategoryServices().then((response) => {
                if (response.data) {
                    dispatch(setHomePageService(response.data));
                }
            })
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}