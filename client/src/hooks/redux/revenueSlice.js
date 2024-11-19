import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
const initialState = {
    invoices: [],
    selectedInvoice: {},
    invoicesSearch: [],
    invoiceTemps: [],
    count:0,
    listInvoiceID:[]
}

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        setInvoices: (state, action) => {
            state.invoices = action.payload
            state.invoicesSearch = action.payload
            state.invoiceTemps = action.payload
        },
        getInvoicesDay: (state, action) => {
            const rangeDay = action.payload
            console.log(rangeDay)
            const startDay =rangeDay[0]
            const endDay = rangeDay[1]
            const resultQuery = state.invoices.filter(booking => {

                const checkInDay = dayjs(booking.guestInfo.checkInDay)
                const checkOutDay = dayjs(booking.guestInfo.checkOutDay)
                return (
                    checkInDay.isBefore(endDay) &&
                    checkOutDay.isAfter(startDay) ||
                    checkInDay.isSame(startDay, 'day') ||
                    checkOutDay.isSame(endDay, 'day')
                )
            })
            console.log(resultQuery)
            state.invoicesSearch = resultQuery
        },
        sortInvoice: (state, action) => {
            const invoices = action.payload.invoices
            const now = dayjs()
            switch (action.payload.value) {
                case "defauld": {
                    state.invoiceTemps = invoices
                    break;
                }
                case "current": {
                    state.invoiceTemps = invoices.filter(item => {
                        const checkInDay = dayjs(item.invoiceInfo.guestInfo.checkInDay)
                        const checkOutDay = dayjs(item.invoiceInfo.guestInfo.checkOutDay)
                        return now.isBetween(checkInDay, checkOutDay, null, "[]")
                    })

                    break;
                }
                case "future": {
                    state.invoiceTemps = invoices.filter(item => {
                        const checkInDay = dayjs(item.invoiceInfo.guestInfo.checkInDay)
                        return now.isBefore(checkInDay)
                    })
                    break;
                }
                case "expired": {
                    state.invoiceTemps = invoices.filter(item => {

                        console.log(item)
                        const checkOutDay = dayjs(item.invoiceInfo.guestInfo.checkOutDay)
                        return now.isAfter(checkOutDay)
                    })
                    break;
                }
            }
        },
        refreshInvoice: (state, action) => {
            state.invoiceTemps = state.invoices
        },
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

export const { setInvoices, getInvoicesDay,sortInvoice,refreshInvoice,setInvoiceCount,cleanInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer