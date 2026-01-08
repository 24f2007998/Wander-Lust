const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const { count } = require('console');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpreeError.js");
const { stat } = require('fs');
const { listingSchema } = require("./schema.js")

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

const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}



app.get("/", wrapAsync((req, res) =>{
    res.redirect('/listings');
}));


app.get("/listings",wrapAsync(async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings } );
}));
app.get("/listing/new" ,(req, res) =>{
    res.render("listing/new.ejs");
});

app.post("/listing/new",validateListing, wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    
    await newlisting.save();
    res.redirect("/listings");
}));
app.get("/listing/:id",wrapAsync(async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
}));

app.get("/listing/:id/edit",wrapAsync( async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

app.put("/listing/:id",validateListing, wrapAsync( async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id,req.body.listing );
    res.redirect(`/listing/${id}`);
}));

app.delete("/listing/:id",wrapAsync(async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

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