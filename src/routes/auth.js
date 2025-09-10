const express = require("express");
const authRouter = express.Router();
const saltRound=10;
const bcrypt = require("bcrypt")
const User = require("../model/user");
const { userAuth } = require("../../middlewares/userAuth");

authRouter.post("/signup",async(req,res)=>{
    try {
        console.log(req.body)
        // //creating new instance of User modal
        const {firstName, lastName, emailId, password} = req?.body;
        let passwordHash =await bcrypt.hash(password, saltRound)
    const user = new User({
                firstName,
                lastName,
                emailId,
                password:passwordHash
            });
    const data = await user.save()
    console.log("data saved successfully", data)
    res.send("data saved successfully")
        
    } catch (error) {
        console.log("Error: "+error.message+error.code);
        res.status(400).send("Error: "+error.code) 
    }
})

authRouter.post("/login", async(req,res)=>{
    const {emailId, password} = req.body;
    try {
        const user = await User.findOne({emailId:emailId});
        if(!user) throw new Error("Invalid credential ");
        const isPasswordSame = user.verifyPassword(password);
        if(!isPasswordSame) throw new Error("Invalid credential ")
        const token = await user.getJWT()
        res.cookie("token", token)
        res.send("User login successful")
        
    } catch (error) {
        console.log("error"+error.message);
        res.send("eerror"+error.message)
    }
})

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token", null,{
        expires:new Date(Date.now())
    })
    res.send("Logout successful")

})
 
module.exports = authRouter;