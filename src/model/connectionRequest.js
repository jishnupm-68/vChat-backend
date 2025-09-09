const mongoose =require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:["ignored", "interested", "accepted","rejected" ],
            message:`{VALUE} is not valid status type`
        },
        required:true,
    }
},{
    timestamps:true,
})

const connectionRequestModel = new mongoose.model(
    "ConnectionRequest", 
    connectionRequestSchema
)

connectionRequestSchema.index({fromUserId:1, toUserId:1})
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this; 
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) throw new Error("cannot sent connection request to yourself")
    next();
})

module.exports = {
    connectionRequestModel
}