const jwt = require('jsonwebtoken')
const { Admin, Owner } = require('../models/signUp.model')
const verifyAdmin = async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
        return res.status(401).json({ message: "Unauthorized" })
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)

    const emailAdmin = decode.payload.email
    const adminExsisted = await Admin.findOne({
        email: emailAdmin
    })

    if (!adminExsisted)
        return res.status(401).json({ message: "You aren't an administrator !" })
    const userPayload = decode.payload
    req.user = userPayload
    next()
}

const verifyOwner = async (req, res, next) => {
    const token = req.cookies.token
    console.log("[TOKEN]", token)
    if (!token)
        return res.status(401).json({ message: "Unauthorized" })
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)
    console.log("[DECODE]", decode)
    if (decode.idSSO) {
        req.ownerID = decode.payload.id
        next()
        return
    }
    const emailOwner = decode.payload.email
    const ownerExsisted = await Owner.findOne({
        email: emailOwner
    })

    if (!ownerExsisted)
        return res.status(401).json({ message: "You aren't an owner !" })
    const userPayload = decode.payload
    req.ownerID = userPayload.id
    next()
}


const verifyLogin = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)
        const userPayload = decode.payload
        req.user = userPayload
        next()
    } catch (err) {
        return res.status(401).json({
            message: err
        })
    }


}


module.exports = {
    verifyAdmin,
    verifyLogin,
    verifyOwner,

}