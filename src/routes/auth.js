const express = require("express");
const authRouter = express.Router();
const saltRound=10;
const bcrypt = require("bcrypt")
const User = require("../model/user");
const { userAuth } = require("../../middlewares/userAuth");

authRouter.post("/signup",async(req,res)=>{
    try {
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
    res.json({status:true, message:"data saved successfully"})
        
    } catch (error) {
        console.log("Error: "+error.message+error.code);
        res.status(400).json({sttaus:false, messge:error.message}) 
    }
})

authRouter.post("/login", async(req,res)=>{
    const {emailId, password} = req.body;
    try {
        const user = await User.findOne({emailId:emailId});
        if(!user) throw new Error("Invalid credential ");
        const isPasswordSame = await user.verifyPassword(password);
        console.log("password status", isPasswordSame)
        if(!isPasswordSame) throw new Error("Invalid credential ")
        const token = await user.getJWT()
        res.cookie("token", token)
        console.log("login success")
        res.json({status:true, message:"User login successful", data:user})
        
    } catch (error) {
        console.log("error"+error.message);
        res.json({status:false, message: error.message})
    }
}) 

authRouter.post("/logout", async(req,res)=>{
    try {
        res.cookie("token", null,{
        expires:new Date(Date.now())
        })
    res.json({status:true, message:"Logout successful"})

    } catch (error) {
        console.log("error: ", error.message)
        res.json({status:false, message:"Logout failed"})
    }
}) 
 
module.exports = authRouter;