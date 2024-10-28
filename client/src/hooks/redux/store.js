import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice';
import inputDaySlice from './inputDaySlice'
import blinkingReducer from './blinkingSlice'
import hotelsReducer from './hotelsSclice'
import roomReducer from './roomsSlice'
import revenueReducer from './revenueSlice'
import cardReducer from './cardSlice'
import {thunk} from 'redux-thunk'

export const store = configureStore ({
  reducer:{
    searchResults:searchReducer,
    inputDay:inputDaySlice,
    blinking:blinkingReducer,
    hotel:hotelsReducer,
    room:roomReducer,
    invoice:revenueReducer,
    card:cardReducer
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk),
  devTools:window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})

