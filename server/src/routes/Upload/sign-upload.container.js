//test up anh
import {v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
})

export const generateSignature = async (req,res,next)=>{
    const{folder} = req.body

    if(!folder){
        res.status(400)
        return next(new Error("folder fields are required"))
    }

    try{
        const timestamps = Math.round((new Date).getTime() / 1000)

        const signature = cloudinary.utils.api_sign_request({
            timestamps,
            folder
        }, process.env.CLOUDINARY_API_SECRET); 
        res.status(200).joson({timestamps,signature})
    }catch(error){
        console.log(error)
        res.status(500);
        next(error);
    }
}