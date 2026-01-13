const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const {isLoggedin,validateReview, isAuthor} = require("../middleware.js")


router.get("/",isLoggedin, wrapAsync( async (req, res) =>{
    let{id} = req.params;
    if(!id){
        return res.redirect("/listings")
    }
    return res.redirect(`/listings/${id}`);
}));
router.post("/",isLoggedin,validateReview, wrapAsync( async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews({...req.body.review, author:res.locals.currUser._id});
    console.log(newReview);
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added.")
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:review_id",isLoggedin,isAuthor, async (req, res) => {
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await Reviews.findByIdAndDelete(review_id);
    req.flash("success", "Review Deleted.")
    res.redirect(`/listings/${id}`);
})

module.exports = router;