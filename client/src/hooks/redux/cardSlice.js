import { createSlice } from "@reduxjs/toolkit";


const initialState={
    cards:[]
}

const cardSlice=createSlice({
    name:'card',
    initialState,
    reducers:{
        setCards:(state,action)=>{
            state.cards=action.payload
        },
        addCards:(state,action)=>{
            state.cards = state.cards.push(action.payload)
        }
    }
})
export const {setCards,addCards}=cardSlice.actions
export default cardSlice.reducer