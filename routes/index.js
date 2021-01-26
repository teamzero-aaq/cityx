var express=require("express");
var router= express.Router();
var user  = require("../models/users");
var passport = require("passport");



router.get("/register",function(req,res){
    res.render("register");
})

router.post("/register",function(req,res){
    // res.send("Post working!");
    var newUser=({username:req.body.username});
user.register(newUser,req.body.password,function(err,user){
 if(err){
     console.log(err);
     res.render("register");
 }else{
     passport.authenticate("local")(req,res,function(){
         res.redirect("/");
     })
 }    
})
})

router.get("/login",function(req,res){
    res.render("login");
})

router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"}),function(req,res){
});

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports=router;