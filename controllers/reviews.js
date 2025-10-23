const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReviews = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "Review has been created successfully");
    res.redirect(`/listings/${listing.id}`);
};

module.exports.deleteReviews = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review has been deleted successfully");
    res.redirect(`/listings/${id}`);
};
