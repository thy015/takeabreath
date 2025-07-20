import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice';
import inputDaySlice from './inputDaySlice'
import hotelsReducer from './hotelsSclice'
import roomReducer from './roomsSlice'
import revenueReducer from './revenueSlice'
import cancelRequest from "./cancelSlice"
import ownerReducer from "./ownerSlice"
import {thunk} from 'redux-thunk'
export const store = configureStore ({
  reducer:{
    searchResults:searchReducer,
    inputDay:inputDaySlice,
    hotel:hotelsReducer,
    room:roomReducer,
    invoice:revenueReducer,
    invoiceRevenue:revenueReducer,
    cancel:cancelRequest,
    owner:ownerReducer,
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk),
  devTools:window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})

