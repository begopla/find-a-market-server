const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: String, maxLength: 200, required: true },
    date: {type: Date, default: Date.now}
});

const Review = model("Review", reviewSchema);

module.exports = Review;