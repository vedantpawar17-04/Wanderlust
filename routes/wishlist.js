const express = require('express');
const router = express.Router();
const wrapAsync = require('../Utils/wrapAsync.js');
const { isLoggedIn, isUserRole, validateWishlist } = require('../middleware.js');
const wishlistController = require('../controllers/wishlist.js');

router.get('/', isLoggedIn, isUserRole, wrapAsync(wishlistController.index));
router.post('/listings/:id', isLoggedIn, isUserRole, validateWishlist, wrapAsync(wishlistController.addItem));
router.put('/:wishlistId', isLoggedIn, isUserRole, validateWishlist, wrapAsync(wishlistController.updateItem));
router.delete('/:wishlistId', isLoggedIn, isUserRole, wrapAsync(wishlistController.removeItem));

module.exports = router;
