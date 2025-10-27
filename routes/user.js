const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Home route - redirect to listings index
router.get("/", (req, res) => {
    res.redirect("/listings");
});

router
.route("/signup")
.get(userController.renderSignup) //get signup
.post(wrapAsync(userController.signup)); //post signup


router
.route("/login")
.get(userController.renderLogin ) //get login
.post( saveRedirectUrl, 
    passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true}),
    userController.login
); //post login


//get logout
router.get("/logout" , userController.logout);


module.exports = router;