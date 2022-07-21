const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User.model");
const Market = require("../models/Market.model");
const jwt = require("jsonwebtoken")

/**
 *
 * * All the routes are prefixed with `/api/profile`
 *
 */

// C(R)UD -- Read and return current user favourite markets

router.get("/favourites",isAuthenticated, async (req, res, next) =>{

    try {
        userId= req.payload._id;
        const user = await User.findById(userId).populate("bookmarkList");
        const savedMarkets = user.bookmarkList;
        res.status(200).json({
            savedList: savedMarkets,
        });
    } catch (error) {
        next(error)
    }
})


router.get("")

router.get("/", isAuthenticated, (req, res, next)=>{
    res.status(200).json(req.payload);
    
});

// C(R)UD -- Read and return followed users

router.get("/followed",isAuthenticated, async (req, res, next) =>{

    try {
        userId= req.payload._id;
        const user = await User.findById(userId).populate("usersFollowed");
        const followedUsers = user.usersFollowed;
        res.status(200).json({
            savedList: followedUsers,
        });
    } catch (error) {
        next(error)
    }
})


router.get("")

router.get("/", isAuthenticated, (req, res, next)=>{
    res.status(200).json(req.payload);
    
});

// CR(U)D -- Update user object adding image string
router.put('/',isAuthenticated, async(req, res, next) =>{
    try {
       const {image} =req.body;
       const user = await User.findByIdAndUpdate(
        req.payload._id,
        {
            image,
        },
        { new: true}
       );
       const authToken = jwt.sign(user.toObject(), process.env.TOKEN_SECRET,{
        algorithm: "HS256",
        expiresIn: "2d",
       });
       console.log(image)
       res.status(200).json({
          
        message: 'File successfully uploaded',
        image: image,
        user: req.payload,
        token: authToken

      });

    } catch (error) {
        next(error);
    }
})


//CR(U)D -- return ImageURL
//!It's returning the old image, what is wrong?
router.post('/upload', isAuthenticated, async (req,res,next) =>{
    try {   
        userObjectImage = req.payload.profilePicture
        console.log(userObjectImage);
        return res.status(200).json({
                  message: 'Current user profile picture has been sent',
                  user: userObjectImage
              })
     
      }catch (error) {
      next(error)
    }
  });

 
// CR(U)D -- Update user object adding user preferences 
router.put('/user-info',isAuthenticated, async(req, res, next) =>{
    try {
       const {typeOfCuisine, dietaryReq} =req.body;
       const user = await User.findByIdAndUpdate(
        req.payload._id,
        {
            typeOfCuisine,
            dietaryReq,
        },
        { new: true}
       );
       const authToken = jwt.sign(user.toObject(), process.env.TOKEN_SECRET,{
        algorithm: "HS256",
        expiresIn: "2d",
       });
       console.log(typeOfCuisine, dietaryReq)
       res.status(200).json({
          
        message: 'File successfully uploaded',
        user: req.payload,
        token: authToken

      });

    } catch (error) {
        next(error);
    }
})



module.exports = router;