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
    res.render("listing/new.ejs");
});

router.post("/new",validateListing, wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    
    await newlisting.save();
    res.redirect("/listings");
}));
router.get("/:id",wrapAsync(async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
}));

router.get("/:id/edit",wrapAsync( async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

router.put("/:id",validateListing, wrapAsync( async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id,req.body.listing );
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",wrapAsync(async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;
