const Market = require("../models/Market.model")

const isAuthor = async (req, res, next) => {
	const {id} = req.params;
    console.log("params: ", req.params)
    const market = await Market.findById(id).populate('author');
    console.log("market: ", market)
    console.log(req.payload)
	if (req.payload._id === market.author._id.valueOf()) {
		return next();
	}
	//res.redirect("/");
}

module.exports = isAuthor