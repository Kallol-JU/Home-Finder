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

app.get("/register" , (req,res)=>{
    let {name = "anoynymous"} = req.query;
    req.session.name = name;
    req.flash("success" , "Worked!! Woooo Hooooooo");
    res.redirect("/hello");
})

app.get("/hello" , (req,res)=>{

    res.render("index.ejs" , {name : req.session.name , msg:req.flash("success")});
})

// app.get("/reqcount" , (req,res)=>{
//     if(req.session.count) {
//         req.session.count ++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`Hi, you have sent req ${req.session.count} times`);
// })


app.get("/" , (req,res)=>{
    res.send("working");
})

app.listen(8000 , ()=>{
    console.log("started");
})
