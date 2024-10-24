import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rooms: [],
    selectRoom:{}
}

const roomSclice = createSlice({
    name:"room",
    initialState,
    reducers: {
        setRooms:(state,action)=>{
            state.rooms = action.payload
        },
        addRoom:(state,action)=>{
            state.rooms = [...state.rooms,action.payload]
        },
        deleteRoom:(state,action)=>{
            state.rooms = state.rooms.filter(item=>item._id!==action.payload)
        },
        selectedRoom:(state,action)=>{
            state.selectRoom = action.payload
        },
        updateRooms:(state,action)=>{
            state.rooms = state.rooms.map((item) => {
                if (item._id === action.payload._id) {
                    return {
                        ...item, 
                        ...action.payload
                    };
                }
                return item
            });
        }
    }
})


export const  {setRooms,addRoom,deleteRoom,selectedRoom,updateRooms} = roomSclice.actions
export default roomSclice.reducer
