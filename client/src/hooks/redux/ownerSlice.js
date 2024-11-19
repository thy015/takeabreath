import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    owner: {},
    
}

const ownerSlice = createSlice({
    name: 'cancel',
    initialState,
    reducers: {
        setOwner: (state, action) => {
            state.owner = action.payload
        }
    }
})
export const { setOwner} = ownerSlice.actions
export default ownerSlice.reducer