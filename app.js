const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpreeError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main().then((res) =>{
    console.log("Connection with DB is successful!");
}).catch((err) =>{
    console.log("Something went wrong during connection with DB.\n" + err);
});


async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

app.get("/", wrapAsync((req, res) =>{
    res.redirect('/listings');
}));

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)

app.all("*catchAll",(req, res,next) =>{
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