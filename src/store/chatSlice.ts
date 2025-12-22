import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { service } from "@/shared/_services/api_service";
import { setFreelancer } from "./authSlice";
import { localService } from "@/shared/_session/local";
import { set } from "date-fns";

const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading",
});


const initialState = {
    status: STATUSES.IDLE,
    messages: [],
    profile: {},
    conversationId: '',
    conversationList: []
}


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setMessages: (state, { payload }) => {
            state.messages = payload?.messages;
            state.profile = payload.freelancer || payload.user
        },
        setConversationId: (state, { payload }) => {
            state.conversationId = payload;
        },
        setStatus: (state, { payload }) => {
            state.status = payload;
        },
        setCoversationList: (state, { payload }) => {
            state.conversationList = payload;
        }
    },
});

export const { setMessages, setConversationId, setStatus, setCoversationList } = chatSlice.actions;
export default chatSlice.reducer;


// thunk


export function getConversationId(id, navigate) {
    return async function getConversationIdThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            if (localService?.get('role') === 'user') {
                await service.getUserConversationId(id).then((response) => {
                    if (response.data) {
                        dispatch(setConversationId(response.data));
                        dispatch(setStatus(STATUSES.IDLE));
                        navigate(`/chat/${response.data?.conversation}`)
                    }
                })
            } else {
                await service.getFreelancerConversationId(id).then((response) => {
                    if (response.data) {
                        dispatch(setConversationId(response.data));
                        dispatch(setStatus(STATUSES.IDLE));
                        navigate(`/chat/${response.data?.conversation}`)
                    }
                })
            }
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}



export function getCoversationDetails(conversationId) {
    return async function getCoversationDetailsThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            if (localService.get('role') === 'user') {
                await service.getCoversationDetailsForUser(conversationId).then((response) => {
                    if (response.data) {
                        dispatch(setMessages(response.data));
                        dispatch(setStatus(STATUSES.IDLE));
                    }
                })
            } else {
                await service.getCoversationDetailsForFreelancer(conversationId).then((response) => {
                    if (response.data) {
                        dispatch(setMessages(response.data));
                        dispatch(setStatus(STATUSES.IDLE));
                    }
                })
            }
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}


export function getConversationList() {
    return async function getConversationListThunk(dispatch: any) {
        dispatch(setLoading(true));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            if (localService.get('role') === 'user') {
                await service.getCoversationListForUser().then((response) => {
                    if (response.data) {
                        dispatch(setCoversationList(response.data));
                        dispatch(setStatus(STATUSES.IDLE));
                    }
                })
            } else {
                await service.getCoversationListForFreelancer().then((response) => {
                    if (response.data) {
                        dispatch(setCoversationList(response.data));
                        dispatch(setStatus(STATUSES.IDLE));
                    }
                })
            }
        } catch (error) {
            errorHandler(error.response);
            dispatch(setStatus(STATUSES.ERROR));
        } finally {
            dispatch(setLoading(false));
        }
    };
}