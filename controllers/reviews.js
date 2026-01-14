const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");

module.exports.redirectListingRoute =  async (req, res) =>{
    let{id} = req.params;
    if(!id){
        return res.redirect("/listings")
    }
    return res.redirect(`/listings/${id}`);
}

module.exports.createReview = async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews({...req.body.review, author:res.locals.currUser._id});
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added.")
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview =  async (req, res) => {
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await Reviews.findByIdAndDelete(review_id);
    req.flash("success", "Review Deleted.")
    res.redirect(`/listings/${id}`);
}