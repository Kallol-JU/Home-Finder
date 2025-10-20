const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

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
        //as soon as an user registers, we directly login them
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to Finder");
            res.redirect("/listings");
        })
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
router.post("/login" , saveRedirectUrl, 
    passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true}),
    (req,res)=>{
    req.flash("success" , "Welcome back on Finder");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})


//get logout
router.get("/logout" , (req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
            next(err);
        }
        req.flash("error" , "You are logged out");
        res.redirect("/listings");
    });
})


module.exports = router;