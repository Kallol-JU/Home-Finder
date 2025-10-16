const express = require("express");
const app = express();
const mongoose = require("mongoose");
//means, i am telling the app to use mongo_url from .env file
require('dotenv').config();
const path = require("path"); //for ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listRoute = require("./routes/listing.js");
const reviewRoute  =require("./routes/review.js");

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

//creating basic api
app.get("/", (req,res)=>{
    res.send("hi, i am root page");
});

//for /lisitings
app.use("/listings" , listRoute);

//for reviews
app.use("/listings/:id/reviews" , reviewRoute);

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