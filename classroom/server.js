const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
app.set("view engine" , "ejs"); //for ejs
const path = require("path"); //for ejs
app.set("views" , path.join(__dirname,"views"));



app.use(session({
    secret : "kallolSDE@Google",
    resave : false, 
    saveUninitialized : true,
}));

app.use(flash());

app.use((req,res,next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register" , (req,res)=>{
    let {name = "anoynymous"} = req.query;
    req.session.name = name;
   
    if(name === "anoynymous"){
        req.flash("error" , "User not registered");
    }else{
        req.flash("success" , "User registered");
    }

    res.redirect("/hello");
})

app.get("/hello" , (req,res)=>{
    res.render("index.ejs" , {name : req.session.name });
})


app.get("/" , (req,res)=>{
    res.send("working");
})

app.listen(8000 , ()=>{
    console.log("started");
})
