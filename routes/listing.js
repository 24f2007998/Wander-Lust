const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const { populate } = require("../models/review.js");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
  })
);
router.get("/new", isLoggedin, (req, res) => {
  return res.render("listing/new.ejs");
});

router.post(
  "/new",
  validateListing,
  wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    console.log(listing);
    if (!listing) {
      req.flash("error", "Listing you requested for doesn't exist.");
      return res.redirect("/listings");
    }
    return res.render("listing/show.ejs", { listing });
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for doesn't exist.");
      return res.redirect("/listings");
    }
    return res.render("listing/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isLoggedin,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedin,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted.");
    res.redirect("/listings");
  })
);

module.exports = router;
