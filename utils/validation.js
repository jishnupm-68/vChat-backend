

const validateSignUpData = (req)=>{
    const {firstName, lastName , emailId, password}= req.body;
    
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(firstName.length<4 || firstName.length>50){
        throw new Error("length of name should be in between 4 and 50");
    }
} 

const validateEditProfileData=(req)=>{
    const allowedEditFields = [
        "firstName",
        "lastName",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ]
    const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field))
    return isEditAllowed
}

const validatedStatus = (req,res)=>{
    let status = req.params.status;
    const allowedStatus  = [
        "ignored",
        "interested"
    ]
    
    if(!allowedStatus.includes(status))  throw new Error(`invalid status type: ${status}`)
    return true
}


module.exports = {
    validateEditProfileData,
    validateSignUpData,
    validatedStatus
}