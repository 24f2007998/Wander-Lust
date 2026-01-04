const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1761839257469-96c78a7c2dd3",
       set: (link) => link === ""?"https://images.unsplash.com/photo-1761839257469-96c78a7c2dd3": link
    },
    price:{
        type: Number
    },
    location: {
        type:String
    },
    country:{
        type: String
    }
});

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;