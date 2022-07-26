const router = require("express").Router();
const authRoutes = require("./auth.routes");
const marketRoutes = require("./market.routes");
const profileRoutes = require("./profile.routes");
const Market = require("../models/Market.model")

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
		const markets = await Market.find()
		return res.status(200).json(markets)
	} catch (error) {
		next(error)
	}
});

router.use("/markets", marketRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);


module.exports = router;
