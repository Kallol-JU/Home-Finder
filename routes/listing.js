const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});



router
.route("/")
.get(wrapAsync(listingControllers.index)) //index route
.post(isLoggedIn, validateListing, upload.single('listing[image]') ,wrapAsync(listingControllers.createListings)); //create route



//new route
router.get("/new" , isLoggedIn , listingControllers.newRoute) //new is written after show route but put upper bcs if not put upper, then the app would consider new as id, and throw err


//privacy route
router.get("/privacy", listingControllers.privacy);

//terms route
router.get("/terms", listingControllers.terms);



router
.route("/:id")
.get(wrapAsync(listingControllers.showListings)) //show route
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing , listingControllers.updateListings) //update route
.delete( isLoggedIn , isOwner, wrapAsync(listingControllers.deleteListings)); //delete route



//edit route
router.get("/:id/edit", isLoggedIn , isOwner, listingControllers.editListings);



module.exports = router;