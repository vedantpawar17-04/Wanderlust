const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listings');
const wrapAsync = require('../Utils/wrapAsync');
const { validateListing } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// Index route - Show all listings
router.get('/', wrapAsync(listingController.index));

// New listing form
router.get('/new', listingController.renderNewForm);

// Search listings - must be before /:id routes
router.get('/search', wrapAsync(listingController.searchListings));

// Owner listings - must be before /:id routes
router.get('/owner/:id', wrapAsync(listingController.ownerListings));

// Create listing
router.post('/', 
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.createListing)
);

// Show listing details
router.get('/:id', wrapAsync(listingController.showListing));

// Edit listing form
router.get('/:id/edit', wrapAsync(listingController.renderEditForm));

// Update listing
router.put('/:id', 
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.updateListing)
);

// Delete listing
router.delete('/:id', wrapAsync(listingController.destroyListing));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Route error:', err);
    if (err.name === 'CastError') {
        req.flash('error', 'Invalid listing ID');
        return res.redirect('/listings');
    }
    if (err.name === 'ValidationError') {
        req.flash('error', 'Validation failed: ' + err.message);
        return res.redirect('back');
    }
    req.flash('error', 'Something went wrong');
    res.redirect('/listings');
});

module.exports = router;
