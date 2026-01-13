const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpreeError.js");

module.exports.isLoggedin = (req, res, next) =>{
    console.log(req)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to logged in to perform this task");
        return res.redirect("/login")
    }
    return next();
}


module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    return next()
}

module.exports.isOwner = async (req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing"); 
      return res.redirect(`/listings/${id}`);
    }
    return next();
}

module.exports.isAuthor = async (req, res, next) =>{
    let {id, review_id } = req.params;
    let review = await Review.findById(review_id);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the author of this review."); 
      return res.redirect(`/listings/${id}`);
    }
    return next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}