const dotenv= require("dotenv")
dotenv.config()
const validator = require("validator")
const jwtSecretKey = process.env.JWT_SECRET_KEY 
const bcrypt =  require("bcrypt")
const jwt = require("jsonwebtoken")
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
        default:"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    about:{
        type:String,
        default:"This is a default about ",
    },
    skills:{
        type:[String]
    }
},{timeStamps:true})

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id   }, jwtSecretKey, { expiresIn: '24h' });
    
    return token;
}

userSchema.methods.verifyPassword = async function(inputPassword){
    let user =  this;
    let hashedPasswordStatus = await  bcrypt.compare(inputPassword, user.password);
    return hashedPasswordStatus
}

const UserModel = mongoose.model("User", userSchema);

module.exports =  UserModel;