const router = require("express").Router();
const authRoutes = require("./auth.routes");
const marketRoutes = require("./market.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/markets", marketRoutes);
router.use("/auth", authRoutes);

module.exports = router;
