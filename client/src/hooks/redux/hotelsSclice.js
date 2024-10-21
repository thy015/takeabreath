import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    hotels:[],
}

const hotelsSlice = createSlice({
    name:"hotel",
    initialState,
    reducers:{
        setHotels:(state,action)=>{
            state.hotels = action.payload
        },
        addHotel:(state,action)=>{
            state.hotels = [...state.hotels,action.payload]
        },
        deleteHotel:(state,action)=>{
            state.hotels = state.hotels.filter(item => item._id !== action.payload)
        }
    }
})

export const {setHotels,addHotel,deleteHotel} = hotelsSlice.actions
export default hotelsSlice.reducer