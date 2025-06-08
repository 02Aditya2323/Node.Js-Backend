const mongoose=require("mongoose");  

const connectMongodb=async(url)=>{
    return mongoose.connect(url)
};



module.exports = { connectMongodb };

// async function connectMongodb() {
//     return mongoose.connect("mongodb://127.0.0.1:27017/sigma");
//   }