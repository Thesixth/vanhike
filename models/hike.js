const mongoose = require("mongoose");
const Review = require("./review");
// to shorten the need to type mongoose.Schema each time
const Schema = mongoose.Schema;

const HikeSchema = new Schema({
  title: String,
  pass: String,
  images: String,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

HikeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Hike", HikeSchema);
