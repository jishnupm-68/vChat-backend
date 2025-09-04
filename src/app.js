const express = require("express");
const app = express();

app.get("/",(req,res)=>{
    res.send("hello world")
    console.log("home loaded")
})
app.listen(3000, ()=>{
console.log("running");

}) 