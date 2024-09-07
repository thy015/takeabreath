const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()

const generalAccessTokens=async(payload)=>{
    console.log(payload)
    const access_token=jwt.sign({
        payload
    },process.env.ACCESS_TOKEN,{expiresIn:'24h'})
    
    return access_token
}

const refreshAccessTokens=async(payload)=>{
    const refresh_token=jwt.sign({
        payload
    },process.env.REFRESH_TOKEN,{expiresIn:'365d'})
    
    return refresh_token
}

const authenToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'missing token' });

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, owner) => {
        if (error) {
            console.error("Token verification failed:", error);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log("Token owner:", owner);
        req.ownerID = owner.payload.id; 
        next();
    });
}

const authenCusToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (!token) return res.status(401).json({ message: 'missing token' });

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
        if (error) {
            console.error("Token verification failed:", error);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log("Decoded token:", decoded);
        req.cusID = decoded.payload.id;
        next();
    });
};

const authenAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (!token) return res.status(401).json({ message: 'missing token' });

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
        if (error) {
            console.error("Token verification failed:", error);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log("Decoded token:", decoded);
        req.adminID = decoded.payload.id;
        next();
    });
};


module.exports={
    generalAccessTokens,
    refreshAccessTokens,
    authenToken,
    authenCusToken,
    authenAdminToken
}