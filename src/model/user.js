const validator = require("validator")

const mongoose  = require("mongoose");

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowerCase:true,
        trim:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("Invalid email address: "+value);
        }
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)) throw new Error ("Gender is not valid")
        }
    },
    photoUrl:{
        type:String,
    },
    about:{
        type:String,
        default:"This is a default about ",
    },
    skills:{
        type:[String]
    }
},{timeStamps:true})
const UserModel = mongoose.model("User", userSchema);
module.exports =  UserModel;