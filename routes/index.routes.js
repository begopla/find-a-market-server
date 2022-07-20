const router = require("express").Router();
const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);


module.exports = router;
