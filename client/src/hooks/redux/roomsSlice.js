import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rooms: [],
    selectRoom:{},
    roomSearch:[]
}

const roomSclice = createSlice({
    name:"room",
    initialState,
    reducers: {
        setRooms:(state,action)=>{
            state.rooms = action.payload
            state.roomSearch = action.payload
        },
        addRoom:(state,action)=>{
            state.roomSearch = [...state.rooms,action.payload]
        },
        deleteRoom:(state,action)=>{
            state.rooms = state.rooms.filter(item=>item._id!==action.payload)
            state.roomSearch = state.rooms.filter(item=>item._id!==action.payload)
        },
        selectedRoom:(state,action)=>{
            state.selectRoom = action.payload
        },
        updateRooms:(state,action)=>{
            state.roomSearch = state.rooms.map((item) => {
                if (item._id === action.payload._id) {
                    return {
                        ...item, 
                        ...action.payload
                    };
                }
                return item
            });
        },
        searchRoom:(state,action)=>{
            if(action.payload ===""){
                state.roomSearch = state.rooms
            }else{
                state.roomSearch = state.rooms.filter(room=>room.roomName.includes(action.payload) )
            }
        }
    }
})


export const  {setRooms,addRoom,deleteRoom,selectedRoom,updateRooms,searchRoom} = roomSclice.actions
export default roomSclice.reducer
