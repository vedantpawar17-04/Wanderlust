const express=require('express');
const router=express.Router();
const wrapAsync=require("../Utils/wrapAsync.js");
const { isLoggedIn,isOwner} = require('../middleware.js');
const Listing = require('../models/listing.js');

const listingController=require('../controllers/listings.js');

//Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.
const multer=require('multer');
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});

//Index Route And Create Route
router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));

//New Route
router.get('/new',isLoggedIn,listingController.renderNewForm);

//About Route
router.get('/aboutUs', (req, res) => {
  res.render('listings/aboutUs');
});

//Search Route
router.get('/search', wrapAsync(listingController.searchListings));

//Show ,Update And Delete Route
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//Edit Route
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// Rating Report Route
router.get('/:id/report', (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please log in first to view the report');
        return res.redirect('/login');
    }
    next();
}, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author',
                    model: 'User'
                }
            })
            .populate('owner');
        
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        // Check if the current user is the listing owner
        if (!listing.owner._id.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to view this report');
            return res.redirect(`/listings/${listing._id}`);
        }

        // Calculate rating statistics
        const ratingStats = {
            total: listing.reviews.length,
            average: 0,
            distribution: {
                5: 0, 4: 0, 3: 0, 2: 0, 1: 0
            }
        };

        if (listing.reviews && listing.reviews.length > 0) {
            let totalRating = 0;
            listing.reviews.forEach(review => {
                if (review && review.rating) {
                    ratingStats.distribution[review.rating]++;
                    totalRating += review.rating;
                }
            });
            ratingStats.average = (totalRating / listing.reviews.length).toFixed(1);
        }

        res.render('listings/report', { listing, ratingStats });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error loading report');
        res.redirect(`/listings/${req.params.id}`);
    }
});

//Owner Listings Route
router.get('/owner/:id', wrapAsync(listingController.ownerListings));

module.exports=router;