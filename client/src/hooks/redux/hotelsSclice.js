import { createSlice } from "@reduxjs/toolkit";
const initialState ={
    hotels:[],
    selectedHotel:{},
    hotelSearch: []
}

const hotelsSlice = createSlice({
    name:"hotel",
    initialState,
    reducers:{
        setHotels:(state,action)=>{
            state.hotels = action.payload
            state.hotelSearch = action.payload
        },
        addHotel:(state,action)=>{
            state.hotels = [...state.hotels,action.payload]
            state.hotelSearch =  state.hotels
        },
        deleteHotel:(state,action)=>{
            state.hotels = state.hotels.filter(item => item._id !== action.payload)
            state.hotelSearch =  state.hotels
        },
        seletedHotel:(state,action)=>{
            state.selectedHotel = action.payload
        },
        updateHotels:(state,action)=>{
            state.hotelSearch = state.hotels.map((item) => {
                if (item._id === action.payload._id) {
                    
                    return {
                        ...item, 
                        ...action.payload
                    };
                }
                return item
            });
        },
        searchHotels:(state,action)=>{
            if(action.payload ===""){
                state.hotelSearch = state.hotels
            }else{
                state.hotelSearch = state.hotels.filter(hotel=>hotel.hotelName.includes(action.payload) )
            }
            
        }
    }
})

export const {setHotels,addHotel,deleteHotel,seletedHotel,updateHotels,searchHotels} = hotelsSlice.actions
export default hotelsSlice.reducer