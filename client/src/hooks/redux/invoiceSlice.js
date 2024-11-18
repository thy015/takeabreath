import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
const initialState = {
    invoices: [],
    invoiceTemps: []
}

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setInvoice: (state, action) => {
            state.invoices = action.payload
            state.invoiceTemps = action.payload
        },
        sortInvoice: (state, action) => {
            const invoices = action.payload.invoices
            const now = dayjs()
            switch (action.payload.value) {
                case "default": {
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
        }
    }
})
export const { setInvoice, sortInvoice, refreshInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer