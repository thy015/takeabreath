import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; // Use sessionStorage
import inputDaySlice from './inputDaySlice';
import searchReducer from './searchSlice';
import hotelsReducer from './hotelsSclice';
import roomReducer from './roomsSlice';
import revenueReducer from './revenueSlice';
import cancelRequest from './cancelSlice';
import ownerReducer from './ownerSlice';
import auth from '@/store/redux/auth';

// Combine all reducers
const rootReducer = combineReducers({
  auth,
  searchResults: searchReducer,
  inputDay: inputDaySlice,
  hotel: hotelsReducer,
  room: roomReducer,
  invoice: revenueReducer,
  invoiceRevenue: revenueReducer,
  cancel: cancelRequest,
  owner: ownerReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: storageSession,
  // whitelist:[]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
});

export const persistor = persistStore(store);