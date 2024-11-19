import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rooms: [],
    selectRoom:{},
    roomSearch:[],
    comments: []
}

const roomSclice = createSlice({
    name:"room",
    initialState,
    reducers: {
        setRooms:(state,action)=>{
            state.rooms = action.payload
            state.roomSearch = action.payload
        },
        setRoomSearch:(state,action)=>{
            state.roomSearch = action.payload
        },
        addRoom:(state,action)=>{
            state.roomSearch = [...state.rooms,action.payload]
            state.rooms=[...state.rooms,action.payload]
        },
        deleteRoom:(state,action)=>{
            state.rooms = state.rooms.filter(item=>item._id!==action.payload)
            state.roomSearch = state.rooms.filter(item=>item._id!==action.payload)
        },
        selectedRoom:(state,action)=>{
            state.selectRoom = action.payload
        },
        updateRooms:(state,action)=>{
            const {rooms,update} = action.payload
            console.log({rooms,update})
            state.roomSearch = rooms.map((item) => {
                if (item._id === update._id) {
                    return {
                        ...item, 
                        ...update
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
        },
        filterRoomsByHotel:(state,action)=>{
            const {idHotel,rooms} = action.payload
            
            state.roomSearch = rooms.filter(item=>{
                if(idHotel === "defauld"){
                    return true
                }
                return item.hotelID._id == idHotel
            })
        },
        //comment
        getComment: (state, action) => {
            state.comments = action.payload
        },
        addComment: (state,action)=>{
            state.comments.push(action.payload)
        }
    }
})


export const  {setRooms,addRoom,deleteRoom,selectedRoom,updateRooms,searchRoom,setRoomSearch,filterRoomsByHotel,getComment,addComment} = roomSclice.actions
export default roomSclice.reducer
