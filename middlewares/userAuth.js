const jwt = require("jsonwebtoken");
const User = require("../src/model/user");
const jwtSecretKey = process.env.JWT_SECRET_KEY

const userAuth = async(req, res, next)=>{
    try {
        const {token} = req.cookies;
        if(!token) return res.status(401).json({status:false, message:"Please login"})
        const decodedMessage = await jwt.verify(token, jwtSecretKey)
        const {_id} = decodedMessage;
        const user = await User.findById(_id).select('-password')
        if(!user) throw new Error("User not found, please login  again")
        req.user =  user;
        next();
        
    } catch (error) {
        console.log("Error: ", error )
        res.status(400).json({status:false, message:error?.message})
        
    }
}

module.exports={
    userAuth
}