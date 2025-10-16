const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js"); 
const {listingSchema , reviewSchema} = require("../schema.js");


//function using joi for review validation
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

//review route #post route creating
router.post("/" , validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

   res.redirect(`/listings/${listing.id}`);

}));

//delete route for reviews #post delete creating
router.delete("/:reviewId" ,wrapAsync( async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


module.exports = router;