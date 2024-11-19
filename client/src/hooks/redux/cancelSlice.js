import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    cancel: [],
    cancelTemps: []
}

const cancelSlice = createSlice({
    name: 'cancel',
    initialState,
    reducers: {
        setCancel: (state, action) => {
            state.cancel = action.payload
            state.cancelTemps = action.payload
        },
        filterSort: (state, action) => {
            const cancel = action.payload.cancel
            if (action.payload.value === "default") {
                state.cancelTemps = state.cancel
            } else {
                state.cancelTemps = cancel.filter(item => item.cancelRequest.isAccept === action.payload.value)

            }
        }
    }
})
export const { setCancel, filterSort } = cancelSlice.actions
export default cancelSlice.reducer