var express   = require("express");
var router    = express.Router();  //using Routers to send the routing data out
var Sight     = require("../models/sights");
var middleware = require("../middleware/index");
// var NodeGeocoder = require('node-geocoder');

// var options = {
//     provider: 'google',
//     httpAdapter: 'https',
//     apiKey: process.env.GEOCODER_API_KEY, // the key which is stored in dotenv file
//     formatter: null
//   };
  
//   var geocoder = NodeGeocoder(options);


//Show all the sights
router.get("/",function(req,res){
    //Get all locations from db and showcase them
    Sight.find({},function(err,allSights){
        if(err){
            console.log(err);
        }else{
            res.render("sights/index",{sights:allSights});
        }
    });
   
});


router.post("/",middleware.isLoggedIn,function(req,res){
    
    var name       = req.body.name;
    var image      = req.body.image;
    var description= req.body.description;
    var location   = req.body.location;
    var city       = req.body.city;
    var price      = req.body.price;
    var author     ={
        id: req.user._id,
        username:req.user.username
    };
    var newSight={name:name,image:image,description:description,author:author,location:location,city:city,price:price};
    Sight.create(newSight,function(err,found){
        if(err){
            console.log("Error in the post!");
        }else{
           //This is another way of doing the thing
           //  found.author.id=req.user._id;
           //  found.author.username=req.user.username;
           //  found.save();
            console.log("Posted!");
            res.redirect("/sights");
        }
    });
});




//Using Google map
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to sights array
//     var name  = req.body.name;
//     var image = req.body.image;
//     var desc  = req.body.description;
//     var price = req.body.price;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     geocoder.geocode(req.body.location, function (err, data) {
//       if (err || !data.length) {
//           console.log(err)
//       //   req.flash('error', 'Invalid address');
//         return res.redirect('back');
//       }
//       var lat = data[0].latitude;
//       var lng = data[0].longitude;
//       var location = data[0].formattedAddress;
//       var newSight = {name: name, image: image, description: desc, author:author,price:price, location: location, lat: lat, lng: lng};
//       // Create a new sight and save to DB
//       Sight.create(newSight, function(err, newlyCreated){
//           if(err){
//               console.log(err);
//           } else {
//               //redirect back to campgrounds page
//             //   req.flash("success","Sight Registered!");
//               console.log(newlyCreated);
//               res.redirect("/sights");
//           }
//       });
//     });
//   });
  
  









// Show new form
router.get("/new",middleware.isLoggedIn,function(req,res){
   res.render("sights/new");
});

//Show comments

router.get("/:id",function(req,res){
    Sight.findById(req.params.id).populate("comments").exec(function(err,foundsight){
       if(err){
        //   console.log("There is an error");
          console.log(err);
       }else{
        //   console.log("Comment in found Sight="+foundsight.comments);
           res.render("sights/show",{sight:foundsight,currentUser:req.user});
       }
    })
});

//EDIT
router.get("/:id/edit",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
    
    var val=req.params.id;
            Sight.findById(val,function(err,found){
      if(err){
          console.log(err)
      }else{
         var data={
        author:found.name,
        image:found.image,
        description:found.description,
        id:found._id,
        location:found.location,
        city    :found.city,
        price   :found.price
        
    };
         res.render("sights/edit",{data:data});
      }
    });
   
});

router.put("/:id",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
    Sight.findByIdAndUpdate(req.params.id,req.body.sights,function(err,found){
        if(err){
            console.log("Error in the update")
            res.redirect("/sights");
        }else{
            // console.log("The body="+req.body.sights);
            // console.log("Edited="+found);
            res.redirect("/sights/"+req.params.id);
        }
    })
})


//Update using google maps

// router.put("/:id", middleware.checkUser, function(req, res){
//     geocoder.geocode(req.body.sights.location, function (err, data) {  // in this error might occur in place of req.body.location you might write req.body.sights.location
//       if (err || !data.length) {
//         console.log(err);
//         return res.redirect('back');
//       }
//       req.body.sights.location = data[0].formattedAddress;
//       req.body.sights.lat = data[0].latitude;
//       req.body.sights.lng = data[0].longitude;
//       req.body.sights.price = req.body.sights.price;
  
  
//       Sight.findByIdAndUpdate(req.params.id, req.body.sights, function(err, sights){
//           if(err){
//               // req.flash("error", err.message);
//               console.log(err);
//               res.redirect("back");
//           } else {
//               // req.flash("success","Successfully Updated!");
//               req.flash("success","Sight updated!");
//               res.redirect("/sights/"+sights._id);
//           }
//       });
//     });
//   });
  










//DELETE

router.delete("/:id",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
   Sight.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("Error in Deleting!");
            res.redirect("/sights/"+req.params.id);
                }else{
            res.redirect("/sights");
             }
    })
});

//middleware in middleware directory

module.exports=router;