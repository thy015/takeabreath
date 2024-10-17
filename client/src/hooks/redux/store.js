import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice';
import inputDaySlice from './inputDaySlice'
import blinkingReducer from './blinkingSlice'
import {thunk} from 'redux-thunk'

export const store = configureStore ({
  reducer:{
    searchResults:searchReducer,
    inputDay:inputDaySlice,
    blinking:blinkingReducer
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk),
  devTools:window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})

