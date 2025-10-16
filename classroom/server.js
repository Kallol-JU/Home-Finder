const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser("secret"));

app.get("/getsignedcookie", (req,res)=>{
    res.cookie("name" , "kallol" ,{signed : true});
    res.send("sent");
})

app.get("/verify" , (req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/greet" , (req,res)=>{
  let {name = "default"} = req.cookies;
  res.send(`hi ${name}`); 
});

app.get("/getcookies" , (req,res)=>{
    res.cookie("greet" , "hi");
    res.send("nice");
})

app.get("/" , (req,res)=>{
    console.dir(req.cookies);
    res.send("Working");
})

app.listen(8000 , ()=>{
    console.log("started");
})
