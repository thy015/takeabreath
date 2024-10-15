import { createSlice } from "@reduxjs/toolkit";

const initialState={
    hotelData:[],
    roomData:[]
}
export const searchSlice=createSlice({
    name:'searchResult',
    initialState,
    reducers:{
        setSearchResult:(state,action)=>{
            state.hotelData=action.payload.hotelData
            state.roomData=action.payload.roomData
        },
        clearSearchResult:(state,action)=>{
            state.hotelData=[]
            state.roomData=[]
        }
    }
})
export const {setSearchResult,clearSearchResult}=searchSlice.actions
export default searchSlice.reducer
