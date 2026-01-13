const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then((res) => {
    console.log("Connection with DB is successful.");
  })
  .catch((err) => {
    console.log("Something went wrong during connection with DB. \n" + err);
  });

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6964ad7b645deab7134b040f",
  }));
  await Listing.insertMany(initdata.data);
  console.log("Data was intiliazed.");
};

initDB();
