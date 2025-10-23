const User = require("../models/user.js");

module.exports.renderSignup = (req,res)=>{
    res.render("../views/users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
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
    
};

module.exports.renderLogin = (req,res)=>{
    res.render("../views/users/login.ejs");
};

module.exports.login = (req,res)=>{
    req.flash("success" , "Welcome back on Finder");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
            next(err);
        }
        req.flash("error" , "You are logged out");
        res.redirect("/listings");
    });
};