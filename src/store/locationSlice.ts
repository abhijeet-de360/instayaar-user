import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    locationName: string;
    permissionDenied: boolean;
}

const initialState: LocationState = {
    latitude: null,
    longitude: null,
    locationName: "Fetching location...",
    permissionDenied: false,
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setCoords(
            state,
            action: PayloadAction<{ latitude: number; longitude: number }>
        ) {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.permissionDenied = false;
        },
        setLocationName(state, action: PayloadAction<string>) {
            state.locationName = action.payload;
        },
        setPermissionDenied(state, action: PayloadAction<boolean>) {
            state.permissionDenied = action.payload;
        },
        resetLocation() {
            return initialState;
        },
    },
});

export const {
    setCoords,
    setLocationName,
    setPermissionDenied,
    resetLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
