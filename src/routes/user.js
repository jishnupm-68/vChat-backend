const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const { connectionRequestModel } = require("../model/connectionRequest");
const User= require("../model/user");
const userRouter = express.Router()

//get all pending connection request for the loggedin user
userRouter.get("/user/requests/received",
    userAuth,
    async (req,res)=> {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName", "lastName"])
        res.json({
            message:"data fetched successfully",
            data:connectionRequest
        })

    } catch (error) {
        res.send("Error: "+error.message)
        
    }
})

userRouter.get("/user/connections",
    userAuth,
    async(req,res)=>{
        try {
            const loggedInUser = req.user;
            const connectionRequest = await connectionRequestModel.find({
                $or:[
                    {toUserId:loggedInUser._id, status:"accepted"},
                    {fromUserId:loggedInUser._id, status:"accpted"}
                ]
            })
            .populate("fromUserId",["firstName", "lastName"])
            .populate("toUserId",["firstName", "lastName"])
            let data = connectionRequest.map((row)=>{
                if(row.fromUserId._id.equals(loggedInUser._id)) return row.toUserId
                return row.fromUserId
            })
            if(!connectionRequest) throw new Error ("no connection request found")
            res.json({messge:"connection request fetched successfully", data:data})
            
        } catch (error) {
            res.send("Error: "+error.message);
        }
    }
)

userRouter.get("/feed",
    userAuth,
    async(req,res)=>{
        try {
            const page = (req.query.page)||1;
            let limit = (req.query.limit)||10;
            let skip = (page-1)*limit;
            limit = limit>50?50:limit
            const loggedInUser = req.user;
            const connectionRequest = await connectionRequestModel.find({
                $or:[
                    {fromUserId:loggedInUser._id},
                    {toUserId:loggedInUser._id}
                ]
            }).select("fromUserId toUserId")
            .populate("fromUserId","firstName")
            .populate("toUserId","firstName")

            const hideUsersFromFeed = new Set();
            connectionRequest.forEach((req)=>{
                hideUsersFromFeed.add(req.fromUserId._id.toString());
                hideUsersFromFeed.add(req.toUserId._id.toString())
            })

            const users = await User.find({
                $and:[
                {_id:{$nin:
                    Array.from(hideUsersFromFeed)
                }},
            {_id:{$ne:loggedInUser._id}}]
            })
            .select("firstName lastName gender age ")
            .skip(skip)
            .limit(limit)
            .lean()
            res.json({message:"Feed fetched successfully", data:users})
            
        } catch (error) {
            console.log(error)
            res.send("ERROR: "+error.message)
        }
    }
)

module.exports = userRouter
