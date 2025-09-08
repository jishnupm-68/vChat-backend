const jwt = require("jsonwebtoken");
const User = require("../src/model/user");
const jwtSecretKey = process.env.JWT_SECRET_KEY

const userAuth = async(req, res, next)=>{
    try {
        const {token} = req.cookies;
        if(!token) throw new Error("Token invalid")
        const decodedMessage = await jwt.verify(token, jwtSecretKey)
        const {_id} = decodedMessage;
        const user = await User.findById(_id)
        if(!user) throw new Error("User not found, please login  again")
        req.user =  user;
        next();
        
    } catch (error) {
        res.status(400).send("Error"+error.message)
        
    }
}

module.exports={
    userAuth
}