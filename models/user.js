const mongoose=require("mongoose");

//Creating Schema (basically an outline of table/model of sigma database) and specifying the protocols for each table/collection to follow...
const userScehma=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,    //means this field is mandatory to be filled to make changes in database
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,  ///means if same email is saved in the databse then it will throw error...i.e. only unique emails are eccepted
    },
    jobTitle:{
        type:String,
    },
    gender:{
        type:String,
    },
},
{timestamps:true}  // for adding the timestamps of row created or updated
);

//finally:
const User = mongoose.model("user",userScehma)   //mongoose.model() — This function creates a model, which is like a blueprint for working with a MongoDB collection in code....and then we passing the entire schema to Users variable class(can say) for interacting further


module.exports= User;

