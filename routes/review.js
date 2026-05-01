const express=require('express');
const router=express.Router({mergeParams: true});
const wrapAsync=require("../Utils/wrapAsync.js");
const { validateReview,isLoggedIn,isReviewAuthor,isNotListingOwner,isUserRole} = require('../middleware.js');

//Controller Access
const reviewController=require('../controllers/reviews.js');

//Reviews-Post Route
router.post('/', isLoggedIn, isUserRole, isNotListingOwner, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
