// here we write the logic of initialisation
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require('dotenv').config();
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
    const maptilerClient = await import('@maptiler/client');
    maptilerClient.config.apiKey = process.env.MAP_TOKEN;
    
    await Listing.deleteMany({});
    
    // Geocode each listing and add geometry
    const listingsWithGeometry = [];
    for (let obj of initData.data) {
        try {
            let response = await maptilerClient.geocoding.forward(
                obj.location, 
                { limit: 1 }      
            );
            
            listingsWithGeometry.push({
                ...obj, 
                owner: "68f69f5aad58416359de7fec",
                geometry: response.features[0].geometry
            });
        } catch (error) {
            console.error(`Error geocoding ${obj.location}:`, error);
        }
    }
    
    await Listing.insertMany(listingsWithGeometry);
    console.log("data was initialized");
}

initDB();