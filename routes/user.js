const express = require("express");
const User = require("../models/user.js");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

passport.use(
  new LocalStrategy(
    { usernameField: "identifier" },
    async (identifier, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ username: identifier }, { email: identifier }],
        });
        if (!user) return done(null, false, { message: "User not found" });
        let result = await user.authenticate(password);
        if (!result.user) {
          return done(null, false, { message: "Incorrect Password" });
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

router.route("/signup")
  .get(userControllers.signupForm)
  .post(userControllers.signUp);

router.route("/login")
  .get(userControllers.loginForm)
  .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.login
);

router.get("/logout", userControllers.logout);

module.exports = router;
