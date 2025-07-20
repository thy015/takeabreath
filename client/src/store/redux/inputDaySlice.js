import { createSlice } from "@reduxjs/toolkit"
import dayjs from "dayjs"


const initialState={
    dayStart:'',
    dayEnd:'',
    totalCheckInDay:0,
    city:'',
    latitude:'',
    longitude:'',
    totalPrice:0,
    convertPrice:0,
    completedPayment:false,
    countRoom:0,
    selectedHotel:{},
    selectedRoom:{},
    invoiceID:''
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
            state.dayStart=''
            state.dayEnd=''
            state.totalCheckInDay=0
            state.city=''
        },
        setOrdinate:(state,action)=>{
            state.latitude=action.payload.latitude
                state.longitude=action.payload.longitude
        },
        setVoucherApplied: (state, action) => {
            const { voucher } = action.payload;
            let discountedPrice = state.firstPrice; 
            if (voucher && voucher.discount) {
                discountedPrice = state.firstPrice - (state.firstPrice * voucher.discount / 100);
            }
            state.totalPrice = discountedPrice;
            state.convertPrice = (discountedPrice / 25000).toFixed(2);
        },
        
        // for paypal, need convert based on dollar rates
        setPaymentState:(state,action)=>{
            state.selectedHotel=action.payload.selectedHotel
            state.selectedRoom=action.payload.selectedRoom
            state.countRoom=action.payload.countRoom
            state.totalPrice=action.payload.totalPrice
            state.firstPrice=action.payload.totalPrice
            state.convertPrice = (action.payload.totalPrice / 25000).toFixed(2);
        },
        setPaymentCompleted:(state,action)=>{
            state.completedPayment=true
        },

        clearPaymentState:(state,action)=>{
            state.totalPrice=0,
            state.completedPayment=false
            state.countRoom=0
            state.selectedHotel={}
            state.selectedRoom={}
            state.completedPayment=false
        },
        setInvoiceID:(state,action)=>{
            state.invoiceID=action.payload.invoiceID
        },
        clearInvoiceID:(state,action)=>{
            state.invoiceID=''
        }
    }
})
export const {setVoucherApplied,setInputDay,clearInputDay,setPaymentState,clearPaymentState,setPaymentCompleted,setInvoiceID,clearInvoiceID,setOrdinate}=inputDaySlice.actions
export default inputDaySlice.reducer
