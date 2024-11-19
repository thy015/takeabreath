import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice';
import inputDaySlice from './inputDaySlice'
import blinkingReducer from './blinkingSlice'
import hotelsReducer from './hotelsSclice'
import roomReducer from './roomsSlice'
import revenueReducer from './revenueSlice'
import cardReducer from './cardSlice'
import commentSlice from "./commentSlice"
import cancelRequest from "./cancelSlice"
import ownerReducer from "./ownerSlice"
import {thunk} from 'redux-thunk'
import applyReducer from './applySlice';
export const store = configureStore ({
  reducer:{
    searchResults:searchReducer,
    inputDay:inputDaySlice,
    blinking:blinkingReducer,
    hotel:hotelsReducer,
    room:roomReducer,
    invoice:revenueReducer,
    card:cardReducer,
    comment:commentSlice,
    invoiceRevenue:revenueReducer,
    cancel:cancelRequest,
    owner:ownerReducer,
    apply: applyReducer,
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk),
  devTools:window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})

