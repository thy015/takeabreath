const jwt = require('jsonwebtoken')
const {Admin} = require('../models/signUp.model')
const verifyAdmin = async (req,res,next)=>{
    const token = req.cookies.token
    if(!token)
        return res.status(401).json({message:"Unauthorized"})
    const decode = await jwt.verify(token,process.env.ACCESS_TOKEN)
    
    const emailAdmin = decode.payload.email
    const adminExsisted = await Admin.findOne({
        email:emailAdmin
    })

    if(!adminExsisted)
        return res.status(401).json({message:"You aren't an administrator !"})
    const userPayload = decode.payload
    req.user=userPayload
    next()
}

const verifyOwner = async (req,res,next)=>{
    const token = req.cookies.token
    if(!token)
        return res.status(401).json({message:"Unauthorized"})
    const decode = await jwt.verify(token,process.env.ACCESS_TOKEN)
  
    const emailOwner = decode.payload.email
    const adminExsisted = await Owner.findOne({
        email:emailOwner
    })

    if(!adminExsisted)
        return res.status(401).json({message:"You aren't an owner !"})
    const userPayload = decode.payload
    req.ownerID=userPayload.id
    next()
}


const verifyLogin = async (req,res,next)=>{
   const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

   const decode = await jwt.verify(token,process.env.ACCESS_TOKEN)
   
    const userPayload = decode.payload
    req.user=userPayload
    next()
}

module.exports = {
    verifyAdmin, 
    verifyLogin,
    verifyOwner
}