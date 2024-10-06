import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice';
import inputDaySlice from './inputDaySlice'
import {thunk} from 'redux-thunk'

export const store = configureStore ({
  reducer:{
    searchResults:searchReducer,
    inputDay:inputDaySlice
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk),
  devTools:window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})

