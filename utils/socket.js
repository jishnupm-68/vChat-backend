const { Server } = require("socket.io");

const initializeSocket = (httpServer)=>{
   try {
     const io =new Server(httpServer, 
    {
        cors:{
            origin:process.env.CORS_ORIGIN_STRING,
        },
    }
)

io.on("connection", (socket)=>{
    //handle events
    socket.on("joinChat", ({firstName, fromUserId, toUser})=>{
        const roomId = [fromUserId, toUser].sort().join("_")
        socket.join(roomId);
    })
    socket.on("sendMessage", ({firstName, fromUserId, toUser, text})=>{
        const roomId = [fromUserId, toUser].sort().join("_")
        io.to(roomId).emit("messageReceived",{firstName, text})
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