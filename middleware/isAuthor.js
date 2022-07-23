const Market = require("../models/Market.model")

const isAuthor = async (req, res, next) => {
	const { marketId } = req.params;
	const market = await Market.findById(marketId).populate('author');

	if (req.payload._id === market.author._id.valueOf()) {
		return next()
	}
	return res.status(400).json({ message: "You are not the author" })
}

module.exports = isAuthor