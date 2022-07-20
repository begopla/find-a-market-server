const express = require("express")
const isAuthenticated = require("../middlewares/isAuthenticated")
const router = express.Router()
const Market = require("../models/Market.model")

router.get("/", async (req, res, next) => {
	try {
		const markets = await Market.find()
		return res.status(200).json(markets)
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

router.post("/", isAuthenticated, async (req, res, next) => {
	console.log(req.payload)
	try {
		const { name, author, type, imageUrl, description, address, opening_days, opening_months, from, to, website } = req.body
		if (!name) {
			return res.status(400).json({ message: "Name is required" })
		}
		const market = await Market.create({ 
            name,
            author: req.payload, //?
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

router.put("/:marketId", async (req, res, next) => {
    try {
        const { marketId } = req.params
        const market = await Market.findByIdAndUpdate(marketId, req.body, { new: true})
        return res.status(200).json(market)
    } catch (error) {
        next(error)
    }
});

router.delete("/:marketId", async (req, res, next) => {
	try {
		const { marketId } = req.params
		await Market.findByIdAndDelete(id)
		return res.status(200).json({ message: `Market ${marketId} deleted` })
	} catch (error) {
		next(error)
	}
});

/*router.get("/search", async (req, res) => {
	const { q } = req.query;
    
	try {
		const searchResults = await Market.find({name:{$regex: q, $options: 'i'}});
		
		return res.status(200).json(searchResults);
	} catch (error) {
		next(error);
	}
});*/

module.exports = router