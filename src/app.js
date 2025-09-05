const express = require("express");
const app = express();
const {connectDb}=require('../config/db')
const User = require("../src/model/user")


app.post("/signup",async(req,res)=>{
    const obj = {
        firstName:"sreeharsh",
        lastName:"nandan",
        emailId:"snknit@gmail.com",
        password:"Snknit12345"
    }
    //creating new instance of User modal
    const user = new User(obj);
    const data = await user.save()
    console.log("data saved successfully", data)
    res.send("data saved successfully")

})
connectDb()
.then(()=>{
    console.log("Successfully connected to the database")
    app.listen(3000, ()=>{
        console.log("server running");
 
})  
})
.catch((error)=>{
    console.log("There is a error while connecting to the database", error?.message, error?.code)
})
