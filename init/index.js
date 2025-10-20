// here we write the logic of initialisation
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require('dotenv').config({ path: '../.env' });
const MONGO_URL = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Database connection successful!");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
}

main();

const initDB = async ()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj , owner :"68f69f5aad58416359de7fec"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();