const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.use(
  new LocalStrategy({ usernameField: "identifier" },async (identifier, password, done) => {
    try {
      const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      });
      if (!user) return done(null, false, { message: "User not found" });
      let result = await user.authenticate(password)
      if (!result.user) {
        return done(null, false, { message: "Incorrect Password" });
      } else {
        return done(null, user);
      }
    } catch(err) {
        return done(err)
    }
  })
);


router.get("/signup", (req, res) => {
  return res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash("success", "Welcome to wanderLust");
    return res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  return res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome to WanderLust! You are Loged in");
    return res.redirect("/listings");
  }
);

module.exports = router;
