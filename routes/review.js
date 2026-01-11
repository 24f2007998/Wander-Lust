const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const ExpressError = require("../utils/ExpreeError.js");


const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

router.post("/",validateReview, wrapAsync( async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:review_id", async (req, res) => {
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await Reviews.findByIdAndDelete(review_id);

    res.redirect(`/listings/${id}`);
})

module.exports = router;