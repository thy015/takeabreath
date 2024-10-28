import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
const initialState = {
    invoices: [],
    selectedInvoice: {},
    invoicesSearch: []
}

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        setInvoices: (state, action) => {
            state.invoices = action.payload
            state.invoicesSearch = action.payload
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
        }

    }
})

export const { setInvoices, getInvoicesDay } = invoiceSlice.actions
export default invoiceSlice.reducer