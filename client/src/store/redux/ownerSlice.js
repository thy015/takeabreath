import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    owner: {},
    cards: [],
    wowoCardDetail: null,
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
        setWoWoDetail:(state,action)=>{
            state.wowoCardDetail=action.payload
        },
    }
})
export const { setOwner, setCards,setWoWoDetail} = ownerSlice.actions
export default ownerSlice.reducer