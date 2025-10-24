const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({}); //this listing.find() means this is the method to call the documents in the data via the model
    res.render("./listings/index.ejs" , {allListings});
};

module.exports.newRoute = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListings = async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing) {
        req.flash("error" , "The listing has been deleted , can't access now!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs" , {listing});
};

module.exports.createListings = async (req,res)=>{ //this is async func bcs we are adding in the db
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success" , "New Listing has been created successfully");
        res.redirect("/listings");
};

module.exports.editListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error" , "The listing has been deleted , can't access now!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs" , {listing});
};

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success" , "Listing has been edited successfully");
    res.redirect("/listings");
};

module.exports.deleteListings = async(req,res)=> {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing has been deleted successfully");
    res.redirect("/listings");
};