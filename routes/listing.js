const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


//function using joi for listing validation
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}



//index route
router.get("/" , wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({}); //this listing.find() means this is the method to call the documents in the data via the model
    res.render("./listings/index.ejs" , {allListings});
}));


//new route
router.get("/new" , isLoggedIn , (req,res)=>{
    res.render("./listings/new.ejs");
}) //new is written after show route but put upper bcs if not put upper, then the app would consider new as id, and throw err

//show route
router.get("/:id" ,wrapAsync( async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
        req.flash("error" , "The listing has been deleted , can't access now!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs" , {listing});
}))

//create route
router.post("/" , isLoggedIn, validateListing, wrapAsync(async (req,res)=>{ //this is async func bcs we are adding in the db
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success" , "New Listing has been created successfully");
        res.redirect("/listings");
}))

//edit route
router.get("/:id/edit", isLoggedIn , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error" , "The listing has been deleted , can't access now!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs" , {listing});
})

//update route
router.put("/:id" , isLoggedIn, validateListing , async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success" , "Listing has been edited successfully");
    res.redirect("/listings");
})

//delete route
router.delete("/:id", isLoggedIn , wrapAsync(async(req,res)=> {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing has been deleted successfully");
    res.redirect("/listings");
}))



module.exports = router;