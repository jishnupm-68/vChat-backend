const express = require("express");
const app = express();
const {connectDb}=require('../config/db')

app.use(express.json())


const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const dotenv = require("dotenv")
dotenv.config()
const authRouter = require('../src/routes/auth');
const requestRouter = require('../src/routes/request');
const profileRouter = require('../src/routes/profile');


app.use('/', authRouter);
app.use('/', profileRouter);
app.use("/", requestRouter)
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
