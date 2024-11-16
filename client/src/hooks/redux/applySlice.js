import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apply: false
};

const applySlice = createSlice({
  name: 'apply',
  initialState,
  reducers: {
    setApplyState: (state, action) => {
      state.apply = action.payload;
    }
  }
});

export const { setApplyState } = applySlice.actions;
export default applySlice.reducer;
