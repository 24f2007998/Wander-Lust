const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  return res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
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
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to WanderLust! You are Loged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
}

module.exports.logout = (req, res) =>{
  req.logout((err) =>{
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out!");
    return res.redirect("/listings");
  });
}

module.exports.loginForm = (req, res) => {
  return res.render("users/login.ejs");
}