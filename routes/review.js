const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, validateReview, isAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

router.get("/", isLoggedin, wrapAsync(reviewControllers.redirectListingRoute));
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewControllers.createReview)
);

router.delete(
  "/:review_id",
  isLoggedin,
  isAuthor,
  reviewControllers.destroyReview
);

module.exports = router;
