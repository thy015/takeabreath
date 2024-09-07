const mongoose =require('mongoose')

const roomTSchema=new mongoose.Schema({
    numberOfBeds:{ type: Number, required: true },
    typeOfRoom:{type: String, required: true},
    money:{ type: Number, required: true },
    isAvailable:{type:Boolean,required:true, default:true},
    revenue:{type:Number,required:true},

})

const RoomT=mongoose.model('RoomT',roomTSchema)

module.exports=RoomT