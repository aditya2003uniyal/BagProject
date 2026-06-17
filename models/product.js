const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

    image:Buffer,
    name:String,
    price:Number,
    discout:{
        type:Number,
        default:0
    },
    bgcolor:String,
    pannelcolor:String,
    textcolor:String
})

module.exports = mongoose.model("product",productSchema);