import { createSlice } from "@reduxjs/toolkit"
import dayjs from "dayjs"


const initialState={
    dayStart:'',
    dayEnd:'',
    totalCheckInDay:0,
    city:''
}
const inputDaySlice =createSlice({
    name:'inputDay',
    initialState,
    reducers:{
        setInputDay:(state,action)=>{
            state.dayStart=action.payload.dayStart
            state.dayEnd=action.payload.dayEnd
            state.totalCheckInDay=dayjs(state.dayEnd).diff(dayjs(state.dayStart),'day')
            state.city=action.payload.city
        },
        clearInputDay:(state)=>{
            state.dayStart='',
            state.dayEnd='',
            state.totalCheckInDay=0
            state.city=''
        },
    }
})
export const {setInputDay,clearInputDay}=inputDaySlice.actions
export default inputDaySlice.reducer
