const express = require("express");
const fs = require("fs");

const app = express();

let logBuffer = [];
let subBundles = [];

// Add logs
function writeLog(level,message){

    logBuffer.push({
        timestamp:new Date().toISOString(),
        level:level,
        message:message
    });
}


// Create sub-bundle every 1 min
setInterval(()=>{

    if(logBuffer.length>0){

        let subBundle={

            bundleId:"bundle_"+Date.now(),
            timestamp:new Date().toISOString(),
            logs:[...logBuffer]
        };

        subBundles.push(subBundle);

        console.log("Sub bundle created");

        logBuffer=[];

    }

},60000);


// Create master bundle every 2 min
setInterval(()=>{

    if(subBundles.length>0){

        let masterBundle={

            masterBundleId:"master_"+Date.now(),
            timestamp:new Date().toISOString(),
            subBundles:[...subBundles]
        };

        fs.appendFileSync(
            "app.log",
            JSON.stringify(masterBundle,null,2)+"\n"
        );

        console.log("Master bundle created");

        subBundles=[];

    }

},120000);



app.get("/",(req,res)=>{

    writeLog("INFO","Homepage visited");
    res.send("Home");

});

app.get("/login",(req,res)=>{

    writeLog("INFO","User login attempt");
    res.send("Login");

});

app.get("/error",(req,res)=>{

    writeLog("ERROR","Database failed");
    res.send("Error");

});


app.listen(3000,()=>{

console.log("Server started");

});
