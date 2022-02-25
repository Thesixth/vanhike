const mongoose = require("mongoose");
// to shorten the need to type mongoose.Schema each time
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
