const express = require("express");
const app = express();
const mongoose = require("mongoose");
//means, i am telling the app to use mongo_url from .env file
require('dotenv').config();
const path = require("path"); //for ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listRouter = require("./routes/listing.js");
const reviewRouter  =require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const MONGO_URL = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Database connection successful!");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
}

main(); // calling the main for database starting

app.set("view engine" , "ejs"); //for ejs
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));// so that the data is coming from req is get parsed
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); // for serving static files


const sessionOptions = {
  secret : "kallolSDE@Google",
  resave : false, 
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
}

//creating basic api
// app.get("/", (req,res)=>{
//     res.send("hi, i am root page");
// });

//first defining session, then only i can implement passport
app.use(session(sessionOptions));
app.use(flash());
//implementing passport, see npm passport for more documentation or gpt..
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for success
app.use((req,res,next) =>{
  res.locals.success = req.flash("success");// this creates a variable named success and in the index page, at top we paste that success
  next();
})

//for error
app.use((req,res,next)=>{
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

//for /lisitings
app.use("/listings" , listRouter);

//for reviews
app.use("/listings/:id/reviews" , reviewRouter);

//for user
app.use("/" ,userRouter);

app.use( (req,res,next)=>{
    next(new expressError(404 , "Page Not Found!"));
})

//error-handling
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" ,{err});
})

//we are starting our server at port 8080
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})