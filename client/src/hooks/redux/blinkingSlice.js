import { createSlice } from "@reduxjs/toolkit";


const initialState={
    blink:false
}

const blinkingSlice=createSlice({
    name:'blinking',
    initialState,
    reducers:{
        setBlinking:(state,action)=>{
            state.blink=action.payload
        }
    }
})
export const {setBlinking}=blinkingSlice.actions
export default blinkingSlice.reducer