const express = require("express");
const User = require("../models/user.js");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");

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
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to wanderLust");
        return res.redirect("/listings");
    })
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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome to WanderLust! You are Loged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
  }
);

router.get("/logout",(req, res) =>{
  req.logout((err) =>{
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out!");
    return res.redirect("/listings");
  });
})

module.exports = router;
