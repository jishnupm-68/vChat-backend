const express = require("express");
const profileRouter = express.Router();
const User = require("../model/user")
const {userAuth} = require("../../middlewares/userAuth");
const { validateEditProfileData } = require("../../utils/validation");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  
    try {
        const user= req?.user
    console.log("token validation success", user)
    res.json({status:true, message:"Token validation success",data: user})
        
    } catch (error) {
        console.log("error" , error.message)
        res.json({status:false , message: error.message})
    }
})

profileRouter.patch("/profile/edit", userAuth,async (req,res)=>{
    try {
        if(!validateEditProfileData(req)) return res.status(400).send("Validation failed on edit request")
        const loggedinUser = req.user
    Object.keys(req.body).forEach((key)=>loggedinUser[key]= req.body[key])
    await loggedinUser.save()
    res.json({status:true, message:"profile updated successfully", data:loggedinUser})
    } catch (error) {
        console.log("Error: "+error.message)
        res.status(400).json({status:false , message:error.message});

    }

})

module.exports = profileRouter