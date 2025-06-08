const fs= require("fs");

function logReqRes(filename){
    return (req,res,next)=>{
        fs.appendFile("log.txt",`\n ${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`,(err,data)=>{
            console.log("request recieved,log appended and now the response has been sent to the client ") // message to indicate completion of middleware task....
            next();      ///very imp. here we put next() inside appenfile cz. this is async functiona nd if next is outside;it getsdone first instead of actually writing down the data in log....so rem. whenever we use async. function the further requests try to do it in async. only...so the appendfile doesnt gets terminated
        });
    };
};   
 // log appends even though error is thrown up....so appending file along with error is remaining


module.exports={
    logReqRes
}