import { createSlice } from "@reduxjs/toolkit";
const initialState ={
    hotels:[],
    selectedHotel:{}
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
        },
        seletedHotel:(state,action)=>{
            state.selectedHotel = action.payload
        },
        updateHotels:(state,action)=>{
            state.hotels = state.hotels.map((item) => {
                if (item._id === action.payload._id) {
                    
                    return {
                        ...item, 
                        ...action.payload
                    };
                }
                return item
            });
        }
    }
})

export const {setHotels,addHotel,deleteHotel,seletedHotel,updateHotels} = hotelsSlice.actions
export default hotelsSlice.reducer