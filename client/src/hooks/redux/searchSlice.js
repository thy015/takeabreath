import { createSlice } from "@reduxjs/toolkit";

const initialState={
    hotelData:[],
    roomData:[],
    countRoom:[]
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
        clearSearchResult:(state,action)=>{
            state.hotelData=[]
            state.roomData=[]
            state.countRoom=[]
        }
    }
})
export const {setSearchResult,clearSearchResult,countRoom}=searchSlice.actions
export default searchSlice.reducer
