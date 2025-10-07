const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required : true,
    },
    description : {
        type: String,
        required : true,
    },
    image : {
        filename: String,
        url : {
            type : String,
            default: "https://unsplash.com/photos/historic-lodge-nestled-among-pine-trees-with-mountains-behind-DEgeMwdOfK8",
            set: (v) => v ==="" ?"https://unsplash.com/photos/historic-lodge-nestled-among-pine-trees-with-mountains-behind-DEgeMwdOfK8" : v,
        },
    },
    price :{
        type: Number,
        required : true,
    } ,
    location : {
        type: String,
        required : true,
    },
    country : {
        type: String,
        required : true,
    },
});

//now using this schema we are going to create a model
const Listing = mongoose.model("Listing" , listingSchema);

//and now, exporting the model
module.exports = Listing;