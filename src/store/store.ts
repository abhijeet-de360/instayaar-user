import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import categoryReducer from './categorySlice';
import serviceReducer from './ServiceSlice';
import freelancerReducer from './freelancerSlice';
import jobsReducer from './jobSlice';
import portfolioReducer from './portfolioSlice';
import bookingReducer from './bookingSlice';
import jobApplicationReducer from './jobApplicationSlice';
import chatReducer from './chatSlice';
import shortListReducer from './shorlistSlice';
import transactionReducer from './transactionSlice';
import widthrawalReducer from './widthrawalSlice';
import loaderReducer from './loader';
import dashboardReducer from './dashboardSlice';
import searchReducer from './searchSlice';
import instantReducer from './instantBookingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    jobs: jobsReducer,
    service: serviceReducer,
    freelancer: freelancerReducer,
    portfolio: portfolioReducer,
    booking: bookingReducer,
    jobApplication: jobApplicationReducer,
    chat: chatReducer,
    shortList: shortListReducer,
    transaction : transactionReducer,
    widthrawal: widthrawalReducer,
    loader: loaderReducer,
    dashboard: dashboardReducer,
    search:searchReducer, 
    instant: instantReducer,
    
  },
  devTools: true,
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;