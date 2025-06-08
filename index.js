 
const express=require("express");
const fs= require("fs");
const app = express();

const userRouter = require("./routes/user.js")      //router require
const {connectMongodb}=require("./connections");   //database require
const{logReqRes} = require("./middlewares");       //middleware require



//Middlewares-plugin (app.use for middlewares only)

app.use(express.urlencoded({extended:false}));  
app.use(express.json({extended:false})); 
app.use(logReqRes("log.txt")); 
//middleware runs first chronologically and then the ports...


//connection with databse:
connectMongodb("mongodb://127.0.0.1:27017/sigma").then(()=>console.log("MONGODB CONNECTED, YAY"));   // we pass console.log("") inside .then as a function cz. if we simpley print it...then the main connection of db doesnt happens and instead this gets printed
// MongoDB
//  └── Database (e.g., sigma)   .....project name
//       └── Collection (e.g., users)     .....table name inside project
//            └── Document (e.g., one user’s info)   .....each entry in the collection(table) is known as a document which is basically a json object..... 

//              there isnt anything name for a particular column here in mongo


// Routes:
app.use("/api/users",userRouter);  // means user pe if any request comes then use userRouter ......i.e it will be (/) => /user or (/:id) => /user/:id for request urls


app.listen(8080,()=>console.log(`server started on port 8080`)); //hosting 











    // login code: // Express.js example
// app.post('/login', (req, res) => {
//     const username = req.body.username; // you're just grabbing what frontend sent
//     const password = req.body.password;
    
//     // You can now use these values
//     if (username === "admin") {
//       res.send("Welcome back!");
//     } else {
//       res.status(401).send("Unauthorized");
//     }
//  });

   

