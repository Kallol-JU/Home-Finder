const Listing = require("../models/listing.js");
// import * as maptilerClient from '@maptiler/client';
const mapKey = process.env.MAP_TOKEN;


module.exports.index = async (req, res) => {
    const { q, filter } = req.query;
    let searchFilter = {};
    
    // Handle text search
    if (q) {
        searchFilter = {
            // '$or' searches multiple fields
            $or: [
                // Checking if 'q' is in the title/country/location
                { title: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } }
            ]
        };
    }
    
    // Handle category filters
    if (filter) {
        switch (filter) {
            case 'trending':
                // For trending, we'll show listings with most reviews (most popular)
                const trendingListings = await Listing.find(searchFilter).populate('reviews');
                const sortedListings = trendingListings.sort((a, b) => b.reviews.length - a.reviews.length);
                return res.render("listings/index.ejs", { allListings: sortedListings });
                
            case 'rooms':
                searchFilter.$or = [
                    { title: { $regex: /room|bedroom|suite|apartment/i } },
                    { description: { $regex: /room|bedroom|suite|apartment/i } }
                ];
                break;
                
            case 'iconic-cities':
                searchFilter.$or = [
                    { location: { $regex: /paris|london|new york|tokyo|rome|barcelona|amsterdam|prague|vienna|budapest/i } },
                    { country: { $regex: /france|england|usa|japan|italy|spain|netherlands|czech|austria|hungary/i } }
                ];
                break;
                
            case 'mountains':
                searchFilter.$or = [
                    { title: { $regex: /mountain|alpine|peak|summit|hill/i } },
                    { description: { $regex: /mountain|alpine|peak|summit|hill/i } },
                    { location: { $regex: /mountain|alpine|peak|summit|hill/i } }
                ];
                break;
                
            case 'castles':
                searchFilter.$or = [
                    { title: { $regex: /castle|palace|fortress|chateau|manor/i } },
                    { description: { $regex: /castle|palace|fortress|chateau|manor/i } }
                ];
                break;
                
            case 'amazing-pools':
                searchFilter.$or = [
                    { title: { $regex: /pool|swimming|aqua|water/i } },
                    { description: { $regex: /pool|swimming|aqua|water|infinity pool|jacuzzi/i } }
                ];
                break;
                
            case 'camping':
                searchFilter.$or = [
                    { title: { $regex: /camp|camping|tent|cabin|lodge/i } },
                    { description: { $regex: /camp|camping|tent|cabin|lodge|outdoor/i } }
                ];
                break;
                
            case 'farms':
                searchFilter.$or = [
                    { title: { $regex: /farm|ranch|barn|countryside|rural/i } },
                    { description: { $regex: /farm|ranch|barn|countryside|rural|agriculture/i } }
                ];
                break;
                
            case 'arctic':
                searchFilter.$or = [
                    { title: { $regex: /arctic|ice|snow|northern|aurora/i } },
                    { description: { $regex: /arctic|ice|snow|northern|aurora|winter/i } },
                    { location: { $regex: /arctic|ice|snow|northern/i } }
                ];
                break;
                
            case 'bed-and-breakfast':
                searchFilter.$or = [
                    { title: { $regex: /bed and breakfast|b&b|breakfast|inn/i } },
                    { description: { $regex: /bed and breakfast|b&b|breakfast|inn|homestay/i } }
                ];
                break;
                
            case 'domes':
                searchFilter.$or = [
                    { title: { $regex: /dome|geodesic|spherical|bubble/i } },
                    { description: { $regex: /dome|geodesic|spherical|bubble|glamping/i } }
                ];
                break;
        }
    }
    
    const allListings = await Listing.find(searchFilter);
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