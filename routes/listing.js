const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/", wrapAsync(listingcontroller.index));

router
  .route("/new")
  .get(isLoggedin, listingcontroller.renderNewForm)
  .post(isLoggedin,upload.single("listing[image]"),validateListing, wrapAsync(listingcontroller.createListing));

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showListing))
  .delete(isLoggedin, isOwner, wrapAsync(listingcontroller.destroyListing));

router
  .route("/:id/edit")
  .get(isLoggedin, isOwner, wrapAsync(listingcontroller.renderEditForm))
  .put(
    isLoggedin,
    isOwner,
    validateListing,
    wrapAsync(listingcontroller.updateListing)
  );

module.exports = router;
