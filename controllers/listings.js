const Listing = require("../models/listing.js");
// import * as maptilerClient from '@maptiler/client';
const mapKey = process.env.MAP_TOKEN;


module.exports.index = async (req, res) => {
    const { q } = req.query;
    let filter = {};
    if (q) {
        filter = {
            // '$or' searches multiple fields
            $or: [
                // Checking if 'q' is in the title/country/location
                { title: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } }
            ]
        };
    };
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings });
};

module.exports.privacy = (req, res) => {
    res.render("./listings/privacy.ejs");
};

module.exports.terms = (req, res) => {
    res.render("./listings/terms.ejs");
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

        const maptilerClient = await import('@maptiler/client');
        maptilerClient.config.apiKey = mapKey;

        let response = await maptilerClient.geocoding.forward(
            req.body.listing.location, 
            { limit: 1 }      
        );
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        newListing.geometry = response.features[0].geometry ;
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

    let originImg = listing.image.url;
    originImg = originImg.replace( "/upload" ,"/upload/h_300,w_250"); 
    res.render("./listings/edit.ejs" , {listing , originImg});
};

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    
    req.flash("success" , "Listing has been edited successfully");
    res.redirect("/listings");
};

module.exports.deleteListings = async(req,res)=> {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing has been deleted successfully");
    res.redirect("/listings");
};