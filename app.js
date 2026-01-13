const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpreeError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
} 

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());                                       

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main().then((res) =>{
    console.log("Connection with DB is successful!");
}).catch((err) =>{
    console.log("Something went wrong during connection with DB.\n" + err);
});


async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

app.get("/", wrapAsync((req, res) =>{
    return res.send("Hi I am root.");
}));
 
app.all('/*splat',(req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) =>{
    let {statusCode = 500, message = "Something went wrong!"} = err;
    let data = {statusCode: statusCode, message: message}
    res.render("error.ejs",{ data });
});

app.listen(8080, () =>{
    console.log("Server is listening on Port 8080!");
});