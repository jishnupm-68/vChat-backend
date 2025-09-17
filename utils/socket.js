const { Server } = require("socket.io");
const { Chat } = require("../src/model/chat");
const UserModel = require("../src/model/user");
const crypto = require("crypto")

const secretRoomId = (users)=>{
    
    users.sort()
    return crypto
    .createHash("sha256")
    .update(users.join("$"))
    .digest("hex")
}
const initializeSocket =  (httpServer)=>{
   try {
     const io =new Server(httpServer, 
    {
        cors:{
            origin:process.env.CORS_ORIGIN_STRING,
        },
    })

io.on("connection",  (socket)=>{
    //handle events
    socket.on("joinChat", async({firstName, fromUserId, toUser})=>{
        const usersArray = [fromUserId, toUser].sort()
        const roomId = secretRoomId([fromUserId, toUser])
        socket.join(roomId);
    })
    socket.on("sendMessage", async({firstName, fromUserId, toUser, text})=>{
        const roomId = secretRoomId([fromUserId, toUser])
        const time = new Date().toLocaleString("in")
        const {photoUrl} = await UserModel.findOne({_id:fromUserId},{photoUrl:1 ,_id:0})
        io.to(roomId).emit("messageReceived",{firstName, text, time, photoUrl:photoUrl})
        try {
            let chat = await Chat.findOne({
                participants:{
                    $all:[fromUserId, toUser]
                }
            })
            if(!chat){
                chat =  new Chat({
                    participants:[fromUserId, toUser],
                    messages:[]
                })
            }
            chat.messages.push({
                senderId:fromUserId,
                text
            })
            await chat.save()
            
        } catch (error) {
            console.log("Error", error)
        }
    })
    socket.on("disconnect", ()=>{
        
    })

})
    
   } catch (error) {
    console.log("Error: ",error.message)
   }
}


module.exports = {
    initializeSocket
}