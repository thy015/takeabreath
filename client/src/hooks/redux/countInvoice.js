import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    count:0,
    listInvoiceID:[]
}

const countInvoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setInvoiceCount: (state,action)=>{
            state.count +=1
            state.listInvoiceID.push(action.payload)
        },
        cleanInvoice:(state,action)=>{
            state.count =0
            state.listInvoiceID =[]
        },
    }
})
export const { setInvoiceCount,cleanInvoice} = countInvoiceSlice.actions
export default countInvoiceSlice.reducer