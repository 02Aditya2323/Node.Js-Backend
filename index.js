// now it's appending to the local mongodb schema and not the mock data....means the requests etc. are generated, edited and sent from mongodb schema and we are also not using the mockdata
// https://chatgpt.com/share/68432984-e1c4-8005-87b3-7976796ab0dd   .....see the last converstions...
//req.params is for dynamic url(subdomain) like for user etc. (:id) and req.body is when the post data comes form client; it gets store in body in json format


// why use async(req,res)=>{ ........await().....}    cz. async is a function which doesn't require cpu threads/cores so it takes time....now inside async we use await so that any task inside await gets executed first and then the further tasks gets executed further........usually operation with db requires time so we use await for that so that further taks doesn't gets executed..
//nodemon
// mock.json file is an array cz. we r storing multiple objects.... 


const express=require("express");
const fs= require("fs");
const mongoose=require("mongoose");  // mongoose package to connect node and mongodb
// const { error } = require("console");  unwanted lol
const app = express();

app.use(express.urlencoded({extended:false}));  // middleware - plug in  .....ye form(urlencoded) request ko js object bana deta hai and stores it in bod(req.body) ....basically parsing of post request based on the file type header(form urlencoded here) and usko body mein daalke de deta hai in json form

app.use(express.json({extended:false})); ///now means even if client sends a json data too; it will parse it and store it in body in json format...

//middleware runs first chronologically and then the ports...

app.use((req,res,next)=>{
    fs.appendFile("log.txt",`\n ${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`,(err,data)=>{
        console.log("request recieved,log appended and now the response has been sent to the client ") // message to indicate completion of middleware task....
        next();      ///very imp. here we put next() inside appenfile cz. this is async functiona nd if next is outside;it getsdone first instead of actually writing down the data in log....so rem. whenever we use async. function the further requests try to do it in async. only...so the appendfile doesnt gets terminated
    });
});


////////////////////////////////**************   MONGODB CONNECTION AND SCEHMA(table) CREATION   ******************//////////
//connection to mongodb and db creation whose name is sigma
mongoose.connect("mongodb://127.0.0.1:27017/sigma")
.then(()=>console.log("mongoDB is connected"))     //.then runs used only when the above function/task gets executed /completed correctly.....then only this line runs........and suppose ther's error at any point; the .catch below cathes it and shows as an  error..
.catch((err)=>console.log("mongo error is there",err))


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
)
//finally:
const User = mongoose.model("user",userScehma)   //mongoose.model() — This function creates a model, which is like a blueprint for working with a MongoDB collection in code....and then we passing the entire schema to Users variable class(can say) for interacting further


//////////////////////////////////*******************************////////////////////////////////////////////////////////

// MongoDB
//  └── Database (e.g., sigma)   .....project name
//       └── Collection (e.g., users)     .....table name inside project
//            └── Document (e.g., one user’s info)   .....each entry in the collection(table) is known as a document which is basically a json object..... 

//              there isnt anything name for a particular column here in mongo



// REST API and crud operations


app.get("/users",async(req,res)=>{     // generally for all that will use normal path i.e. /users for accessing the page and will gibve them html directly
    const allDbUsers = await User.find({})  //this line used for retreiving all document from user collection
    
// here we r returning a html statement which means to "map" i.e. traverse every elemnt of array in the json file ....and for each user in array; list out .firstname..(her 'user is like 'i' when we loop..) 
    const html = `
    <ul> 
        ${allDbUsers.map((user)=>`<li>${user.firstName} - ${user.email}</li>`).join("")} ;  
    </ul>
    `;    // now here "user" is actually an iterator like i ...which iterates through the whole data provided by db..
        res.send(html);
});

//Rest Api from here i.e. sending json data to the client.....the above one was for rendering a html document straight to client i.e. server side rendering


app.get("/api/users",async(req,res)=>{   // for mobiles etc. that will use /api/users path for accesing the page and will give json for the frontend to render it on webpage
    const allDbUsers = await User.find({});
    res.setHeader("X-MyName","Aditya");  //here we set a custom header for the response sent to client...and we add X to indicate it's custom header..(this header response is sent to client with the response message)
    console.log(req.headers);     // for printing the headers of the client response  
    return res.json(allDbUsers);  
});

app.get("/api/users/:id",async(req,res)=>{  //remember a thing when using dynamic query ":id" ...that req.params exists here only cz. there's a dynamic query present............req.params isn`t like req.query (it sees the different parts of query) and this req.params exist for dynamic query or subdomains 
    const user = await User.findById(req.params.id) // here we directly used .findById means we find the user based on the mongodb id created.....so requests comes /api/users/(_id) then req.params get it and findbyobject finds it in db.
                // so request url will be like localhost:8080/api/users/68449b78d1c748808455da68
    
                if(!user) return res.status(404).json({error:"User not found"});  //implemented status code for unfound user also "!user" means if(user==null) i.e. user not found in the users data.
       return res.json(user);
})


app.post("/api/users",async(req,res)=>{  // ststus code is 201 => for user created/post request

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
   return(res.status(201).json({msg:"success"}));

});


app.patch("/api/users/:id",async(req,res)=>{
    //Edit user with id....
    await User.findByIdAndUpdate(req.params.id,{lastName:"changed"})  //here we find userbydata and update the changes....but here we hardcoded to change lastname to changes..instead it should be recieved form the frontedn request to edit the field i.e.(it should be req.body )
    res.status(200).json({method:"Success"});   
    })


app.delete("/api/users/:id",async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({method:"Success"});   
})    



app.listen(8080,()=>console.log(`server started on port 8080`));




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

    // delete a particular user based on id
    // app.delete("/api/users/:id", (req, res) => {
    //     const id = Number(req.params.id);
    
    //     const userIndex = users.findIndex(user => user.id === id);
    //     if (userIndex === -1) {
    //         return res.status(404).json({ error: "User not found" });
    //     }
    
    //     users.splice(userIndex, 1); // remove user from array
    
    //     fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    //         return res.json({ status: "User deleted successfully" });
    //     });
    // });


