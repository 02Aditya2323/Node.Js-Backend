const User=require("../models/user")



const handleGetAllUsers=async(req,res)=>{
    const allDbUsers = await User.find({});
    res.setHeader("X-MyName","Aditya");  //here we set a custom header for the response sent to client...and we add X to indicate it's custom header..(this header response is sent to client with the response message)
    console.log(req.headers);     // for printing the headers of the client response  
    return res.json(allDbUsers);  
}

const handleGetUserById=async(req,res)=>{
    const user = await User.findById(req.params.id) // here we directly used .findById means we find the user based on the mongodb id created.....so requests comes /api/users/(_id) then req.params get it and findbyobject finds it in db.
                // so request url will be like localhost:8080/api/users/68449b78d1c748808455da68
    
                if(!user) return res.status(404).json({error:"User not found"});  //implemented status code for unfound user also "!user" means if(user==null) i.e. user not found in the users data.
       return res.json(user);
}

const handleUpdateUserById =async(req,res)=>{
    //Edit user with id....
    await User.findByIdAndUpdate(req.params.id,{lastName:"changed"})  //here we find userbydata and update the changes....but here we hardcoded to change lastname to changes..instead it should be recieved form the frontedn request to edit the field i.e.(it should be req.body )
    res.status(200).json({method:"Success"});   
}

const handleDeleteUserById=async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({method:"Success"});  
}

const handleCreateNewUser=async(req,res)=>{
    const body=req.body; ///anything we post from frontend is available or comes in this body i.e. req.body; but we dont unserstand the typeof data that comes ; hence we use middleware
   
    if(!body||!body.first_name||!body.last_name||!body.email||!body.gender||!body.job_title){return res.status(400).json({msg:"All fields are to be filled"})};  // sending status code for bad request when either of required fields arent field or left

   const result=await User.create({
    firstName:body.first_name,
    lastName: body.lastlast_name,
    email: body.email,
    gender: body.gender,
    jobTitle:body.job_title
   })
   console.log("result: ",result);
   return(res.status(201).json({msg:"success:", id:result._id}));
}






module.exports={
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser,

}