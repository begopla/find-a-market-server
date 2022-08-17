const express = require("express")
const isAuthenticated = require("../middleware/isAuthenticated")
const isAuthor = require("../middleware/isAuthor")
const isReviewCreator = require("../middleware/isReviewCreator")
const router = express.Router()
const Market = require("../models/Market.model")
const Review = require("../models/Review.model")
const User = require("../models/User.model")
const uploader = require('../config/cloudinary.config')

/**
 *
 * * All the routes are prefixed with `/api/markets`
 *
 */

//Display markets creted by user

router.get("/my-markets", isAuthenticated,  async (req,res,next) =>{
	try {
		const markets = await Market.find().populate('author');	
		const userId = req.payload._id;
		// const marketsByAuthor = markets.filter(market =>{
		// 	market.author._id.valueOf()===userId
		// })
		
		const marketsByAuthor = []
		for(i=0; i<markets.length; i++){
			const currentMarket = markets[i]
		    const marketAuthorID = currentMarket.author._id;
			const marketID= marketAuthorID.valueOf();
			
			 if(marketID === userId){
			 	marketsByAuthor.push(markets[i])	
			 }
		}
		

		return res.status(200).json(marketsByAuthor);
		
	} catch (error) {
		next(error)
	} 

})

//Display search results

router.get("/search", async (req, res, next) => {
	const q = req.query.q;
	const options = [
	{name: {$regex: `${q}`, $options: 'i'}},
	{type: {$regex: `${q}`, $options: 'i'}},
	{address: {$regex: `${q}`, $options: 'i'}}  //!needs country and city keys
	]
    //console.log("req.query: ", req.query)
	//console.log("q: ", q)
	try {
		const searchResults = await Market.find({$or: options})
		//console.log(searchResults.length, " search results")
		return res.status(200).json(searchResults);
	} catch (error) {
		next(error);
	}
});

//Display random market page

router.get("/discover", async (req, res, next) => {
	
	 try {
		const markets = await Market.find()
		
		const randomId = markets[Math.floor(Math.random() * markets.length)]._id.valueOf();
		//console.log(randomId)

		const market = await Market.findById(randomId)
		return res.status(200).json(market)
		
	} catch (error) {
		next(error)
	} 
});

//Display market details page

router.get("/:marketId", async (req, res, next) => {
	try {
		const { marketId } = req.params
		const market = await Market.findById(marketId).populate('author');
		const allReviews = await Review.find({market:marketId}).populate('author');
		//console.log(market, allReviews)
		
		return res.status(200).json({market, allReviews})
	} catch (error) {
		next(error)
	}
});

//Edit market details

router.put("/:marketId", isAuthenticated, isAuthor, uploader.single('imageUrl'), async (req, res, next) => {
     const { name, type, description, coordinates ,address,website } = req.body;
    if (req.file) {
        req.body.imageUrl = req.file.path;
    }
	console.log(name, type,  JSON.parse(coordinates),)
	//return res.status(200).json({ok:'ok'})
	try { 
        const { marketId } = req.params
        const market = await Market.findByIdAndUpdate(marketId,{
			name, 
			type, 
			description,
			address,
			imageUrl: req.file?.path,
			coordinates: JSON.parse(coordinates),
			website,


		}, { new: true})
		console.log(market)
        return res.status(200).json(market)
    } catch (error) {
        next(error)
    }
});


//Delete market

router.delete("/:marketId", isAuthenticated, isAuthor, async (req, res, next) => {
	try { 
		const { marketId } = req.params
		await Market.findByIdAndDelete(marketId).populate('author');
		return res.status(200).json({ message: `Market ${marketId} deleted` })
	} catch (error) {
		next(error)
	}
});

//Create new market

router.post("/", isAuthenticated, uploader.single('imageUrl'), async (req, res, next) => {
	
	try {
		const { name, type, description, coordinates,address, openingDays, openingMonths, from, to, website } = req.body
		// if (req.file) {
		// 	req.body.imageUrl = req.file.path;
		// }
		if (!name) {
			return res.status(400).json({ message: "Name is required" })
		}
		const market = await Market.create({
            name,
            author: req.payload, 
            type,
            description, 
            coordinates, 
			address,
            openingDays, 
            openingMonths, 
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
		const { review } = req.body;
		console.log(req.body);

		const newReview = await Review.create({
			market: marketId,
			author: req.payload._id,
			review
		});

		const allReviews = await Review.find();
		console.log(allReviews)
		const reviews = [];
		for (let i=0; i< allReviews.length;  i++){
			const currentMarketId = allReviews[i].market.valueOf();
			console.log('currentMarketId:', currentMarketId)
			if(marketId === currentMarketId){
				reviews.push(allReviews[i])
			}
		}
		console.log('reviews:', reviews)
		
		return res.status(200).json({ message: 'Review added',
			reviews
			
	 });

	} catch (error) {
		console.error(error)
	}
});

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
});

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

