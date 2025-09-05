const mongoose = require("mongoose");

const connectDb = async ()=>{
    await mongoose.connect("mongodb+srv://jishnupm:jishnupm@cluster0.zewci1l.mongodb.net/vChat")
}
 
module.exports = {
    connectDb
}