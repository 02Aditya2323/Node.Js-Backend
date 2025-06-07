// https://chatgpt.com/share/68432984-e1c4-8005-87b3-7976796ab0dd   .....see the last converstions...
//req.params is for dynamic url(subdomain) like for user etc. (:id) and req.body is when the post data comes form client; it gets store in body in json format

//nodemon
// mock.json file is an array cz. we r storing multiple objects.... 
// js object is in memory meanwile json data is an actual raw data (Memory vs disk data 🤯).......js object is a key value pair that we define for using and functioning for a single variable like const user = { name: "Aditya", age: 21 };...... meanwhile json is form of stroing data(like sql) but both have same syntaxxx and also this json is simply ana array of objects; each entry ther is an object btw.


const express=require("express");
const users=require("./MOCK_DATA.json");
const fs= require("fs");
const mongoose=require("mongoose");  // mongoose package to connect node and mongodb
const { stringify } = require("querystring");
// const { error } = require("console");  unwanted lol
const app = express();

app.use(express.urlencoded({extended:false}));  // middleware - plug in  .....ye form(urlencoded) request ko js object bana deta hai and stores it in bod(req.body) ....basically parsing of post request based on the file type header(form urlencoded here) and usko body mein daalke de deta hai in json form

app.use(express.json({extended:false})); ///now means even if client sends a json data too; it will parse it and store it in body in json format...


//middleware runs first chronologically and then the ports...

// app.use((req,res,next)=>{  /// this is custom middleware.....middleware handeles requests, responses and calling to the next middileware hence next() is imp.
//     console.log("hello m1");
//   //  res.send("hello from m1");           // if we write till here then middleware ka cycle hoga complete but further proceed nhi hoga anything even if we write next(); hence never give response to clinet form middleware and always write next() to proceed further     
//     next();
// })


app.use((req,res,next)=>{
    fs.appendFile("log.txt",`\n ${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`,(err,data)=>{
        console.log("request recieved,log appended and now the response has been sent to the client ") // message to indicate completion of middleware task....
        next();      ///very imp. here we put next() inside appenfile cz. this is async functiona nd if next is outside;it getsdone first instead of actually writing down the data in log....so rem. whenever we use async. function the further requests try to do it in async. only...so the appendfile doesnt gets terminated
    });
});


//Creating Schema (basically an outline of table/model) and specifying the protocols for each columns/ indexes to follow...
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
    }

})
const User = mongoose.model("user",userScehma)   //mongoose.model() — This function creates a model, which is like a blueprint for working with a MongoDB collection in code....and then we passing the entire schema to Users class(can say) for interacting further

//connection to mongodb and db name is sigma
mongoose.connect("mongodb://127.0.0.1:27017/sigma")
.then(()=>console.log("mongoDB is connected"))     //.then runs used only when the above function/task gets executed /completed correctly.....then only this line runs........and suppose ther's error at any point; the .catch below cathes it and shows as an  error..
.catch((err)=>console.log("mongo error is there",err))


app.get("/users",(req,res)=>{     // generally for all that will use normal path i.e. /users for accessing the page and will gibve them html directly
    const html = `
    <ul> 
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")} ;  
    </ul>
    `;   // here we r returning a html statement which means to "map" i.e. traverse every elemnt of array in the json file ....and for each user in array; list out .firstname..(her 'user is like 'i' when we loop..)
    res.send(html);
});

//Rest Api from here i.e. sending json data to the client.....the above one was for rendering a html document straight to client i.e. server side rendering


app.get("/api/users",(req,res)=>{   // for mobiles etc. that will use /api/users path for accesing the page and will give json for the frontend to render it on webpage

    res.setHeader("X-MyName","Aditya");  //here we set a custom header for the response sent to client...and we add X to indicate it's custom header..(this header response is sent to client with the response message)
    console.log(req.headers);     // for printing the headers of the client response  
    return res.json(users);  
});

app.get("/api/users/:id",(req,res)=>{  //remember a thing when using dynamic query ":id" ...that req.params exists here only cz. there's a dynamic query present............req.params isn`t like req.query (it sees the different parts of query) and this req.params exist for dynamic query or subdomains 
    
    if(!user) return res.status(404).json({error:"User not found"});  //implemented status code for unfound user also "!user" means if(user==null) i.e. user not found in the users data.
    
    const id =Number(req.params.id);   //here req.params is an object in express....basically whenever a request happens;.params sees if there's any dynamic query like :id here and convert it in object (but not every request; only the dynamic ones.....like here it's id {:id} ; and since req.parmas is an object i.e. string ; we convert it into number)
    const user=users.find((user)=>user.id==id);    // here we r applying a find loop in every elemnt of array; such that every elemnt(i), (user here) ka .id === id from above ...........overall; above we took the dynamic parameter from url via req.url and convert it into number cz originally it's string and now we find a user from the users json; where user.id==id from above
    return res.json(user);
})


app.post("/api/users",(req,res)=>{  // ststus code is 201 => for user created/post request

    const body=req.body; ///anything we post from frontend is available or comes in this body i.e. req.body; but we dont unserstand the typeof data that comes ; hence we use middleware
   
    if(!body||!body.first_name||!body.lastlast_name||!body.email||!body.gender||!body.goal){return res.status(400).json({msg:"All fields are to be filled"})};  // sending status code for bad request when either of required fields arent field or left


    users.push({...body,id:users.length+1});  // so first here we r pushing all the contents of the body(client data and adding the id length...but this happens all in virtual memory of js....and to actually make changes in DB or file; we use writefile)
    //now general syntax of adding any thing to an object is :const obj = { name: "Aditya", age: 21 }; const newObj = { ...obj, id: 101 }; console.log(newObj);...........=>{name: "Aditya",  age: 21,, id: 101,}     ................but if we use users.push({body,id}) then that means: {  obj: { name: "Aditya", age: 21 },  id: 101}...

    ///basically when we write {...body,id:users.length+1}...means “Take all key-value pairs from obj(client data) and add them into our original object ” but if we do ({body,id:users.length+1}).....means it creates another value pair and adds in our object data
    
    // see below gpt answer...
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{     //here we are actually writing the pushed code upwards into the file.....but since writefile happens only when we have to add a string to the data file; but here we have json ; so we stringify the json and then add here......in above line we pushed the entry from the client(i.e. added into the data) but it was virtual.....but now here we are actually making it possible by writing it in the file
        return res.status(201).json({Status : "Success yayy, lavda"});    /// lastly we did return response to client inside write file cz. writefile is async task and if we return status to client outside this; it may get sent first before even data gets written in the file
    });

});


app.patch("/api/users/:id",(req,res)=>{
    //Edit user with id....
    res.status(501).json({method:"not implemented"});   //internal server error for unimplemented request
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



// we can simply write:
// app.route("api/users/:id")
// .get ("/api/users/:id",(req,res)=>{  
//     const id =Number(req.params.id);   
//     const user=users.find((user)=>user.id==id);    
//     return res.json(user);
// })
// .patch ((req,res)=>{})
// .delete((req,res)=>{})




// 🔁 ...x in an array

// vs

// 📦 ...x in an object

// Let me break both down like daal-chawal 😋

// ⸻

// 🥔 Case 1: Spread in Arrays ([...arr])

// You’re thinking of this:

// const arr = [1, 2, 3];
// const newArr = [...arr, 4];
// console.log(newArr); // [1, 2, 3, 4]

// Here:
// 	•	...arr means: “Take all elements inside this array and spread them out into the new array.”

// ✅ You’re totally right for this case!

// ⸻

// 📦 Case 2: Spread in Objects ({...obj})

// Now this is a different beast.

// Example:

// const obj = { name: "Aditya", age: 21 };
// const newObj = { ...obj, id: 101 };
// console.log(newObj);

// Result:

// {
//   name: "Aditya",
//   age: 21,
//   id: 101
// }

// Here:
// 	•	...obj means: “Take all key-value pairs from obj and spread them directly into the new object.”

// ⸻

// 💀 And what happens if you do { obj, id }?

// Result:

// {
//   obj: { name: "Aditya", age: 21 },
//   id: 101
// }

// Now everything inside obj gets stuck under a new obj key — nested ❌

// That’s not what we want when adding a user.

// ⸻

// 🧠 Summary:

// Syntax	Meaning	Result
// [...arr]	Spread all array items	Puts elements into new array
// {...obj}	Spread all object properties	Puts key-value pairs into new object
// {obj}	Makes a nested obj key	❌ Not flattened


// ⸻

// TL;DR 🧠
// 	•	... doesn’t mean “all elements in array” only — it means “spread contents”, works in both arrays & objects
// 	•	In {...body, id}, it spreads body’s key-value pairs + adds id
// 	•	In { body, id }, body becomes nested → not what you want ❌

