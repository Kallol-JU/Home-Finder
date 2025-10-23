const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn ,isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//review route #post route creating
router.post("/" ,isLoggedIn, validateReview, wrapAsync(reviewController.postReviews));

//delete route for reviews #post delete creating
router.delete("/:reviewId" , isLoggedIn,isAuthor , wrapAsync(reviewController.deleteReviews));

module.exports = router;