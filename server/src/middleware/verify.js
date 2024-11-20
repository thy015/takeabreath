const jwt = require('jsonwebtoken')
const { Admin, Owner } = require('../models/signUp.model')
const verifyAdmin = async (req, res, next) => {
    const token = req.cookies.token
    const user = res.locals.user

    if (!token)
        return res.status(401).json({ message: "Unauthorized" })
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)

    const emailAdmin = decode.payload.email
    const adminExsisted = await Admin.findOne({
        email: emailAdmin
    })

    if (!adminExsisted)
        return res.status(401).json({ message: "You aren't an administrator !" })
    req.user = decode.payload
    next()
}

const verifyOwner = async (req, res, next) => {
    const user = res.locals.user
    if (user) {
        
        req.ownerID = user.partnerId
        next()
    } else {
        const token = req.cookies.token
        
        if (!token)
            return res.status(401).json({ message: "Unauthorized" })
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)
        console.log(decode.payload.ssoID)
        if (decode.payload.ssoID) {
            req.ownerID = decode.payload.id
            next()
            return
        }
        const emailOwner = decode.payload.email
        const ownerExsisted = await Owner.findOne({
            email: emailOwner
        })

        if (!ownerExsisted)
            return res.status(404).json({ message: "You aren't an owner !" })
        const userPayload = decode.payload
        req.ownerID = userPayload.id

        next()
        return
    }
    return res.status(404).json({ message: "Problem in verify owner !" })

}


const verifyLogin = async (req, res, next) => {
    const token = req.cookies.token
    const user = res.locals.user
    if (user) {
        req.user= {
            id: user.id,
            email: user.email
        }
        next()
        return
    } else {

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        try {
            const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)
            req.user = decode.payload
            next()
            return
        } catch (err) {
            return res.status(401).json({
                message: err
            })
        }
    }

    return res.status(404).json({
        message: "Problem in verify login !"
    })

}


module.exports = {
    verifyAdmin,
    verifyLogin,
    verifyOwner,

}