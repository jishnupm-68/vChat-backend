const express = require("express");
const profileRouter = express.Router();
const User = require("../model/user")
const {userAuth} = require("../../middlewares/userAuth");
const { validateEditProfileData } = require("../../utils/validation");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  
    const user= req?.user
    console.log("token validation success", user)
    res.send("Token validation success", user)
})

profileRouter.patch("/profile/edit", userAuth,async (req,res)=>{
    try {
        if(!validateEditProfileData(req)) return res.status(400).send("Validation failed on edit request")
        const loggedinUser = req.user
    res.send("dataa received successfully")
    console.log(loggedinUser)
    Object.keys(req.body).forEach((key)=>loggedinUser[key]= req.body[key])
    await loggedinUser.save()
    console.log(loggedinUser)
    } catch (error) {
        console.log("Error: "+error.message)
        res.status(400).send("Error: "+error.message);

    }

})

module.exports = profileRouter