import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    owner: {},
    
}

const ownerSlice = createSlice({
    name: 'owner',
    initialState,
    reducers: {
        setOwner: (state, action) => {
            state.owner = action.payload
        },
        setCards:(state,action)=>{
            state.cards=action.payload
        },
        addCards:(state,action)=>{
            state.cards = state.cards.push(action.payload)
        }
    }
})
export const { setOwner, setCards,addCards } = ownerSlice.actions
export default ownerSlice.reducer