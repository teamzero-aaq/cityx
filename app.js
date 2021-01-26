// require('dotenv').config();
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds"),
    passport    = require("passport"),
   localStrategy=require("passport-local"),
passportLocalMongoose=require("passport-local-mongoose"),
methodOverride  =require("method-override");  //This is to use the Put and Delete routes

 mongoose.connect("mongodb://localhost/cityx",{ useNewUrlParser: true });
 
 //models importing
var Sight = require("./models/sights"),
    user = require("./models/users"),
    //    contact     =require("./models/contact"),
    //    comment     = require("./models/comment"),
    //Requiring routes
    sightsRoutes = require("./routes/sights"),//External referenced routed data needs to be required and used ,i.e., app.use
    // commentRoutes      = require("./routes/comments"),
    indexRoutes = require("./routes/index");
    // contactRoutes      =require("./routes/contact");
       
    


app.use(require("express-session")({ //Its position needs to be here if the possition is bit changed error would be generated!
    secret:"Its a secret",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


//The position of the declaration should always be above wherever it is used in this case the currentUser is refereced in the routes directory hence the app.use should be declared first
app.use(function(req,res,next){
    res.locals.currentUser = req.user;  //Current user ka username find karne ke liye req.user
    next();
})

app.use(indexRoutes);
 //All the comments routes start with /sights so that we dont need to write /sights each and every time
app.use("/sights",sightsRoutes);
// app.use("/sights/:id/comments",commentRoutes); 
// app.use("/sights/:id/contact",contactRoutes);  


passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




// var sights=[
//         {name:"Barcelona",image:"https://images.unsplash.com/photo-1548656094-70fd2482b05a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"},
//         {name:"South Lake",image:"https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
//         {name:"Naples",image:"https://images.unsplash.com/photo-1496328488450-9c5c5d555148?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80"},
//         {name:"Behrmann",image:"https://images.unsplash.com/photo-1546551613-09c2f83e1ede?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"},
//         {name:"Barcelona",image:"https://images.unsplash.com/photo-1548656094-70fd2482b05a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"},
//         {name:"South Lake",image:"https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
//         {name:"Naples",image:"https://images.unsplash.com/photo-1496328488450-9c5c5d555148?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80"},
//         {name:"Behrmann",image:"https://images.unsplash.com/photo-1546551613-09c2f83e1ede?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"}
        //   ];


app.get("/",function(req,res){
    res.render("landing");
});

app.post("/jiberrish",function(req,res){
    var city = req.body["key"];
    Sight.find({ city: city},function(err,foundElement){
        if(err){
            console.log(err);
        }else{
            res.render("sights/index.ejs",{sights:foundElement});
            console.log(foundElement);
        }
    });
});

app.listen(9000,process.env.IP,function(){
    console.log("Server has Started!!");
});
