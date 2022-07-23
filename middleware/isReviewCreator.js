const Review = require("../models/Review.model")

const isReviewCreator = async (req, res, next) => {
	const { reviewId } = req.params;
	const review = await Review.findById(reviewId).populate('author');

	if (req.payload._id === review.author._id.valueOf()) {
		return next()
	}
	return res.status(400).json({ message: "You are not the author" })
}

module.exports = isReviewCreator