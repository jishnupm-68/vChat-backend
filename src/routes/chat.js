const express = require("express");
const { Chat } = require("../model/chat");
const { userAuth } = require("../../middlewares/userAuth");

const chatRouter= express.Router();

chatRouter.get("/getChat/:toUser",userAuth,  async(req, res)=>{
    const fromUserId = req?.user?._id
    const {toUser} = req.params
    try {

       let chat = await Chat.findOne(
  { participants: { $all: [fromUserId, toUser] } },
  { messages: { $slice: -50 } } // last 10 messages only
).populate("messages.senderId", "firstName lastName photoUrl");


        if(!chat){
            chat = new Chat ({
                participants:[fromUserId, toUser],
                messages:[]
            })
            await chat.save();
        }
        res.json({status:true, message:"Previous chat fetched successfully", data:chat })
    } catch (error) {
        console.log("error", error)
        
    }
})
module.exports = chatRouter 