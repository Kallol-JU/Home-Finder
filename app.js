const express = require("express");
const app = express();
const mongoose = require("mongoose");
//means, i am telling the app to use mongo_url from .env file
require('dotenv').config();
const path = require("path"); //for ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//now i am requiring the model from models folder
const Listing = require("./models/listing.js")

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


//index route
app.get("/listings" , async(req,res)=>{
    const allListings = await Listing.find({}); //this listing.find() means this is the method to call the documents in the data via the model
    res.render("./listings/index.ejs" , {allListings});
});


//new route
app.get("/listings/new" , (req,res)=>{
    res.render("./listings/new.ejs");
}) //new is written after show route but put upper bcs if not put upper, then the app would consider new as id, and throw err

//show route
app.get("/listings/:id" , async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs" , {listing});
})

//create route
app.post("/listings" ,async (req,res)=>{ //this is async func bcs we are adding in the db
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs" , {listing});
})

//update route
app.put("/listings/:id" ,async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
})

//delete route
app.delete("/listings/:id", async(req,res)=> {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//testing the listing model
// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "home",
//         description : "ok",
//         price : 2,
//         location: "earth",
//         country : "ok",
//     })

//     await sampleListing.save();
//     console.log("samplelisting was saved");
//     res.send("successful");

// })

//we are starting our server at port 8080
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})