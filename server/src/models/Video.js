//Test Up file ảnh
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        imgUrl:{type:String, required:true},
        videoUrl:{type:String,required:true}
    },
    {
        timestamps:true
    }
)

const Video = mongoose.model("Video",videoSchema)
module.exports = {Video}