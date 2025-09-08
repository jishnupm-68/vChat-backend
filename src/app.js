const express = require("express");
const app = express();
const {connectDb}=require('../config/db')
const User = require("../src/model/user")
app.use(express.json())
const bcrypt = require("bcrypt");
const saltRound=10;
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const dotenv = require("dotenv")
dotenv.config()
const {userAuth} = require("../middlewares/userAuth")
const jwtSecretKey  = process.env.JWT_SECRET_KEY 

app.post("/signup",async(req,res)=>{
    try {
        console.log(req.body)
        // //creating new instance of User modal
        const {firstName, lastName, emailId, password} = req?.body;
        let passwordHash =await bcrypt.hash(password, saltRound)
        console.log(passwordHash)
    const user = new User({
                firstName,
                lastName,
                emailId,
                password:passwordHash
            });
    const data = await user.save()
    console.log("data saved successfully", data)
    res.send("data saved successfully")
        
    } catch (error) {
        console.log("Error: "+error.message+error.code);
        res.status(400).send("Error: "+error.code) 
    }
})
 
app.post("/login", async(req,res)=>{
    const {emailId, password} = req.body;
    try {
        const user = await User.findOne({emailId:emailId});
        if(!user) throw new Error("Invalid credential");
        const isPasswordSame = user.verifyPassword(password);
        if(!isPasswordSame) throw new Error("Invalid credential")
        const token = await user.getJWT()
        res.cookie("token", token)
        res.send("User login successful")
        
    } catch (error) {
        console.log("error"+error.message);
        res.send("eerror"+error.message)
    }
})
app.get("/user",async(req,res)=>{
   try {
     const emailId = req?.body?.emailId;
    const data = await User.find({emailId:emailId});
    console.log(data);
    res.send("data fetched successfully"+data)
   } catch (error) {
    console.log(error.message, error.code)
    res.status(500).send("something went wrong")
   }
})

app.delete("/user", async (req,res)=>{
    const userId  = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId);
        console.log(user)
        res.send("user deleted successfully")
        
    } catch (error) {
        console.error(error.message+error.code)
        res.status(500).send("user deletion failed")
    }
})


app.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    console.log("connection request send")
    res.send("connection request send")
})
app.get("/profile",userAuth,async(req,res)=>{
  
    const user= req?.user
    console.log("token validation success", user)
    res.send("Token validation success", user)
})
app.patch('/user',userAuth,async(req,res)=>{
    const userId = req.body.userId;
    
    try {
        const allowedUpdates = ["userId","photoUrl","about", "gender","age","skills"]
    const data = req.body
    const isUpdateAllowed = Object.keys(data).every((k)=>allowedUpdates.includes(k));
    if(!isUpdateAllowed) res.status(400).send("Update not allowed")
        let user = await User.findByIdAndUpdate({_id:userId},data)
        console.log(user)
        res.send("updated successfully")
        
    } catch (error) {
        console.error(error.message+error.code );
        res.send("user data updation failed"+error.message+error.code)
    }
})
app.patch("/userEmail",async(req, res)=>{
    console.log(req.body);
    
    try {
        const emailId = req.body.emailId;
        const firstName = req.body.firstName
        console.log(emailId,firstName)
        await User.findOneAndUpdate({emailId:emailId},{$set:{firstName:firstName}})
        console.log("updated successfully");
        res.send("name updated successfully")
        
    } catch (error) {
        console.error(error.message+error.code);
        res.send("updation failed"+error.message+error.code)
    }
})
app.get('/feed',async(req,res)=>{
    const data  = await User.find()
    console.log(data);
    res.send("data successfully fetched"+ typeof(data)) 
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
