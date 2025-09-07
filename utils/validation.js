const validateSignUpData = (req)=>{
    const {firstName, lastName , emailId, password}= req.body;
    
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(firstName.length<4 || firstName.length>50){
        throw new Error("length of name should be in between 4 and 50");
    }
}