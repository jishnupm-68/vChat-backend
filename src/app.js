const express = require("express");
const app = express();
const nocache = require("nocache")
const dotenv = require("dotenv")
dotenv.config()
const {connectDb}=require('../config/db')

const cors  = require("cors")
app.use(nocache())
app.use(cors({
    origin:process.env.CORS_ORIGIN_STRING,
    credentials:true
}))
app.use(express.json())


const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
app.use(cookieParser())

const authRouter = require('../src/routes/auth');
const requestRouter = require('../src/routes/request');
const profileRouter = require('../src/routes/profile');
const userRouter = require("./routes/user");


app.use('/', authRouter);
app.use('/', profileRouter);
app.use("/", requestRouter)
app.use("/",userRouter)

connectDb()
.then(()=>{
    console.log("Successfully connected to the database")
    app.listen(process.env.PORT, ()=>{
    console.log("server running");
})  
})
.catch((error)=>{
    console.log("There is a error while connecting to the database", error?.message, error?.code)
})
