import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    comments: []
}

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        getComment: (state, action) => {
            state.comments = action.payload
        },
        addComment: (state,action)=>{
            state.comments.push(action.payload)
        }
    }
})
export const { getComment,addComment } = commentSlice.actions
export default commentSlice.reducer