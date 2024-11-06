import { createSlice } from "@reduxjs/toolkit";
const initialState = {

    amenity: {}

}

const amenitySlice = createSlice({
    name: 'amenity',
    initialState,
    reducers: {
        addAmenity: (state, action) => {
            state.amenity = action.payload
        }
    }
})
export const { addAmenity } = amenitySlice.actions
export default amenitySlice.reducer