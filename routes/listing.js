const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpreeError.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

router.get("/", wrapAsync(async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings } );
}));
router.get("/new" ,(req, res) =>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create listing.");
        return res.redirect("/login");
    }
    return res.render("listing/new.ejs");
});

router.post("/new",validateListing, wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));
router.get("/:id",wrapAsync(async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing)
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist.")
        return res.redirect("/listings");
    }
    return res.render("listing/show.ejs", { listing });

}));

router.get("/:id/edit",wrapAsync( async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist.")
        return res.redirect("/listings");
    }
    return res.render("listing/edit.ejs", { listing });
}));

router.put("/:id",validateListing, wrapAsync( async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id,req.body.listing );
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",wrapAsync(async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted.")
    res.redirect("/listings");
}));

module.exports = router;
