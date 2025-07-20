import { createSlice } from "@reduxjs/toolkit";

const initialState={
    hotelData:[],
    roomData:[],
    countRoom:[],
    clickedHotel:{},
    attachedRooms:[]
}
export const searchSlice=createSlice({
    name:'searchResult',
    initialState,
    reducers:{
        setSearchResult:(state,action)=>{
            state.hotelData=action.payload.hotelData
            state.roomData=action.payload.roomData
            state.countRoom=action.payload.countRoom
        },
        setClickedHotel:(state,action)=>{
          state.clickedHotel=action.payload.clickedHotel
              state.attachedRooms=action.payload.attachedRooms
        },
        clearClickedHotel:(state,action)=>{
            state.clickedHotel= {}
        },
        clearSearchResult:(state,action)=>{
            state.hotelData=[]
            state.roomData=[]
            state.countRoom=[]
        }
    }
})
export const {setSearchResult,clearSearchResult,countRoom,setClickedHotel,clearClickedHotel}=searchSlice.actions
export default searchSlice.reducer
