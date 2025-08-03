import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  email: '',
  name: '',
  id: '',
  role: '',
  token: Cookies.get('token') || '', // Retrieve token from cookies
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { email, name, id, role, token } = action.payload;
      state.email = email;
      state.name = name;
      state.id = id;
      state.role = role;
      state.token = token;
      Cookies.set('token', token); // Save token to cookies
    },
    clearAuthData: (state) => {
      state.email = '';
      state.name = '';
      state.id = '';
      state.role = '';
      state.token = '';
      Cookies.remove('token'); // Remove token from cookies
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;