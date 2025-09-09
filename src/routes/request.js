const express = require("express");
const requestRouter = express.Router();
const User = require("../model/user")
const {userAuth} = require("../../middlewares/userAuth")
const {connectionRequestModel} = require("../model/connectionRequest")
const {validatedStatus} = require("../../utils/validation")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
   try {
     const fromUserId = req.user._id;
     const toUserId = req.params.toUserId ;
     const status = req.params.status;
     const existingConnection = await connectionRequestModel.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId:toUserId, toUserId:fromUserId}
        ]
     })
     if(fromUserId.equals(toUserId)) throw new Error("Unable to sent request to user self")
     const toUser = await User.findById(toUserId)
     if(!toUser) throw new Error("User not found")
     if(existingConnection){
        return res.json({status:true, message:" connection request already exist"})
     }
     validatedStatus(req);
     const connectionRequest = new connectionRequestModel({
        fromUserId, 
        toUserId,
        status
     })
     const data = await connectionRequest.save()
     res.json({status:true, message:"Connection request sent successfully", data})
   } catch (error) {
    res.status(400).json({error: error.message});
   }
})

module.exports = requestRouter;
