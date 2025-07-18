/*
 * Authentication and Authorization Middleware
 * This file contains middleware functions for user authentication, validation,
 * and authorization checks throughout the application
 */
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError=require('./Utils/ExpressError.js');
const { reviewSchema, listingSchema } = require('./schema.js');

/*
 * Check if user is logged in
 * Prevents unauthenticated users from accessing protected routes
 * Saves the original URL to redirect back after login
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //Redirect URL
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'Access restricted - Sign up for an account to unlock this content.');
        return res.redirect('/login');
    }
    next();
}

/*
 * Save the redirect URL in local variables
 * Used to redirect users back to their intended destination after login
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.saveRedirectUrl = (req, res,next) => {
    if (!req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

/*
 * Check if current user is the owner of a listing
 * Prevents unauthorized editing/deletion of listings
 * 
 * @param {Object} req - Express request object containing listing ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'You are not the owner of this listings !');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

/*
 * Validate review data against schema
 * Ensures review submissions contain valid data
 * 
 * @param {Object} req - Express request object containing review data
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,1000);
    }else{
        next();
    }
};

/*
 * Check if current user is the author of a review
 * Prevents unauthorized editing/deletion of reviews
 * 
 * @param {Object} req - Express request object containing review ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.isReviewAuthor = async(req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash('error', 'You are not the Author of this review !');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

/**
 * Check if current user is NOT the owner of a listing
 * Prevents owners from reviewing their own listings
 * 
 * @param {Object} req - Express request object containing listing ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.isNotListingOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'You cannot review your own listing!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

/**
 * Validate listing data against schema
 * Ensures listing submissions contain valid data
 * 
 * @param {Object} req - Express request object containing listing data
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};