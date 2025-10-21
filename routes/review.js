const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn ,isAuthor} = require("../middleware.js");



//review route #post route creating
router.post("/" ,isLoggedIn, validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "Review has been created successfully");
    res.redirect(`/listings/${listing.id}`);

}));

//delete route for reviews #post delete creating
router.delete("/:reviewId" , isLoggedIn,isAuthor , wrapAsync( async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review has been deleted successfully");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;