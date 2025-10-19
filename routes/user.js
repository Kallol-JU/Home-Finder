const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

//get signup
router.get("/signup" , (req,res)=>{
    res.render("../views/users/signup.ejs");
})

//post signup
router.post("/signup" ,wrapAsync(async(req,res)=>{
    try{
        let{username , email , password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        req.flash("success" , "Welcome to Finder");
        res.redirect("/listings");
    }catch(err) {
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
    
}));

//get login
router.get("/login" , (req,res)=>{
    res.render("../views/users/login.ejs");
})

//post login
router.post("/login" , passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true}),(req,res)=>{
    req.flash("success" , "Welcome back on Finder");
    res.redirect("/listings");
})

module.exports = router;