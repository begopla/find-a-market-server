const express = require("express")
const isAuthenticated = require("../middleware/isAuthenticated")
const isAuthor = require("../middleware/isAuthor")
const isReviewCreator = require("../middleware/isReviewCreator")
const router = express.Router()
const Market = require("../models/Market.model")
const Review = require("../models/Review.model")
const User = require("../models/User.model")

router.get("/search", async (req, res, next) => {
	const q = req.query.q;
	const options = [
	{name: {$regex: `${q}`, $options: 'i'}},
	{type: {$regex: `${q}`, $options: 'i'}}  //!needs country and city keys
	]
    console.log("req.query: ", req.query)
	console.log("q: ", q)
	try {
		const searchResults = await Market.find({$or: options})
		console.log(searchResults.length, " search results")
		return res.status(200).json(searchResults);
	} catch (error) {
		next(error);
	}
});

router.get("/discover", async (req, res, next) => {
	console.log("something")
	 try {
		const markets = await Market.find()

		const randomId = markets[Math.floor(Math.random() * markets.length)]._id.valueOf();
		console.log(randomId)

		const market = await Market.findById(randomId)
		return res.status(200).json(market)
		
	} catch (error) {
		next(error)
	} 
});


router.get("/:marketId", async (req, res, next) => {
	try {
		const { marketId } = req.params
		const market = await Market.findById(marketId)
		return res.status(200).json(market)
	} catch (error) {
		next(error)
	}
})

router.put("/:marketId", isAuthenticated, isAuthor, async (req, res, next) => {
    try { 
        const { marketId } = req.params
        const market = await Market.findByIdAndUpdate(marketId, req.body, { new: true})
        return res.status(200).json(market)
    } catch (error) {
        next(error)
    }
});

router.delete("/:marketId", isAuthenticated, isAuthor, async (req, res, next) => {
	try { 
		const { marketId } = req.params
		await Market.findByIdAndDelete(marketId)
		return res.status(200).json({ message: `Market ${marketId} deleted` })
	} catch (error) {
		next(error)
	}
});

router.get("/", async (req, res, next) => {
	try {
		const markets = await Market.find()
		return res.status(200).json(markets)
	} catch (error) {
		next(error)
	}
});

router.post("/", isAuthenticated, async (req, res, next) => {
	console.log(req.payload)
	try {
		const { name, author, type, imageUrl, description, address, opening_days, opening_months, from, to, website } = req.body
		if (!name) {
			return res.status(400).json({ message: "Name is required" })
		}
		const market = await Market.create({ 
            name,
            author: req.payload, 
            type,
            imageUrl, 
            description, 
            address, 
            opening_days, 
            opening_months, 
            opening_hours: {from, to},
            website
		})
		return res.status(200).json(market)
	} catch (error) {
		next(error)
	}
});



//Create a new review

router.post("/:marketId/review", isAuthenticated, async(req, res, next) =>{

	try {
		const { marketId } = req.params;
		const { comment } = req.body;

		const newReview = await Review.create({
			market: marketId,
			author: req.payload._id,
			review: comment,
		});
		
		return res.status(200).json({ message: 'Review added',
			review: newReview
			
	 });

	} catch (error) {
		
	}
})


// Save a market as favourite

router.post("/:marketId/favourites", isAuthenticated, async (req, res, next) =>{

	try {
		const { marketId } = req.params;
		
		const newUser = await User.findByIdAndUpdate(
			req.payload._id,
			{
				$addToSet: {bookmarkList: marketId}
			},
			{new: true}
		);
		const starsUpdate = await Market.findByIdAndUpdate(
			marketId,
			{$addToSet: {stars: req.payload._id}},
			{new: true}
		)
		return res.status(200).json({message: 'Market saved as favourites',
				users: newUser.bookmarkList,
				stars: starsUpdate.stars	})


	} catch (error) {
		next(error);
	}
})
// Remove a market from favourite list

router.post("/:marketId/removefav", isAuthenticated, async (req, res, next) =>{

	try {
		const { marketId } = req.params;
		
		const newUser = await User.findByIdAndUpdate(
			req.payload._id,
			{$pull: {bookmarkList: marketId}},
			{new: true}
		);
		const starsUpdate = await Market.findByIdAndUpdate(
			marketId,
			{$pull: {stars: req.payload._id}},
			{new: true}
		)
		return res.status(200).json({message: `Market ${marketId} removed from favourite list`,
				users: newUser.bookmarkList,
				stars: starsUpdate.stars	})


	} catch (error) {
		next(error);
	}
})


//Edit review
router.put("/:marketId/:reviewId", isAuthenticated, isReviewCreator, async (req, res, next) => {
    try { 
        const {  reviewId } = req.params;
		const { review } = req.body;
		console.log(review)
		const newReview = await Review.findByIdAndUpdate(reviewId, {review}, { new: true})
        return res.status(200).json({message: `New review ${review}`,
									review: newReview});
    } catch (error) {
        next(error)
    }
});

//Delete review

router.delete("/:marketId/:reviewId",isAuthenticated, isReviewCreator, async (req, res, next) => {
	try { 
		const {  reviewId } = req.params
		await Review.findByIdAndDelete(reviewId)
		return res.status(200).json({ message: `Review ${reviewId} deleted` })
	} catch (error) {
		next(error)
	}
});


module.exports = router

