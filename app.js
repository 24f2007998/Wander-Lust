const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const { count } = require('console');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app = express();
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

app.get("/", (req, res) =>{
    res.redirect('/listings');
});


app.get("/listings",async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings } );
});
app.get("/listing/new" ,(req, res) =>{
    res.render("listing/new.ejs");
});

app.post("/listing/new",async (req, res) =>{
    console.log(req.body);
    let {title, description, image, price, country, location} = req.body;
    const listing = new Listing({title: title, description: description, image: image, price: Number(price), location: location, country: country});
    await listing.save();
    res.redirect("/listings");
});
app.get("/listing/:id",async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
});

app.get("/listing/:id/edit", async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
})

app.put("/listing/:id",async (req, res) =>{
    let { id } = req.params;
    let {title, description, image, price, country, location} = req.body;
    const listing = await Listing.findByIdAndUpdate(id,{title: title, description: description, image: image, price: Number(price), location: location, country: country} );
    res.redirect(`/listing/${id}`);
});

app.delete("/listing/:id",async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(8080, () =>{
    console.log("Server is listening on Port 8080!");
});